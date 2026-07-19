"""
Systemtests für das Gesamtsystem.

Diese Tests prüfen End-to-End-Funktionalität:
- Phase 1: HTTP/IP-Zugriff
- Phase 2: HTTPS/Domain-Zugriff mit Zertifikat

Ausführung:
    # Phase 1
    pytest tests/infrastructure/test_system.py --base-url=http://<server-ip> --phase=1 -v

    # Phase 2
    pytest tests/infrastructure/test_system.py --base-url=https://proudig.de --phase=2 -v
"""

import pytest
import requests
import ssl
import socket
from datetime import datetime, timedelta


class TestPhase1HttpAccess:
    """Systemtests für Phase 1: IP-basierter HTTP-Zugriff."""

    @pytest.mark.skipif("phase == 2", reason="Phase 1 Test")
    def test_http_access_works(self, base_url, phase):
        """
        Given: Server läuft mit Caddy (Phase 1)
        When: HTTP-Anfrage an Server-IP
        Then: Startseite wird angezeigt
        """
        if phase != 1:
            pytest.skip("Phase 1 Test")

        response = requests.get(f"{base_url}/", timeout=10)

        assert response.status_code == 200
        assert "text/html" in response.headers.get("Content-Type", "")

    def test_all_main_routes_accessible(self, base_url):
        """
        Given: Server läuft
        When: Alle Hauptrouten aufgerufen werden
        Then: Alle geben 200 zurück
        """
        routes = [
            "/",
            "/blog",
            "/seminare",
            "/impressum",
            "/datenschutz",
            "/admin/login",
        ]

        for route in routes:
            response = requests.get(f"{base_url}{route}", timeout=10)
            assert response.status_code == 200, f"Route {route} failed with {response.status_code}"

    def test_api_endpoints_work(self, base_url):
        """
        Given: Server läuft
        When: API-Endpunkte aufgerufen werden
        Then: JSON wird zurückgegeben
        """
        api_routes = [
            "/api/blog",
            "/api/seminare",
            "/api/content",
        ]

        for route in api_routes:
            response = requests.get(f"{base_url}{route}", timeout=10)
            assert response.status_code == 200, f"API {route} failed"
            assert "application/json" in response.headers.get("Content-Type", "")


class TestPhase2HttpsAccess:
    """Systemtests für Phase 2: Domain-basierter HTTPS-Zugriff."""

    def test_https_works(self, base_url, phase, is_https):
        """
        Given: DNS ist konfiguriert und HTTPS aktiv (Phase 2)
        When: HTTPS-Anfrage an Domain
        Then: Startseite wird über HTTPS angezeigt
        """
        if phase != 2 or not is_https:
            pytest.skip("Phase 2 HTTPS Test")

        response = requests.get(f"{base_url}/", timeout=10)

        assert response.status_code == 200
        assert "text/html" in response.headers.get("Content-Type", "")

    def test_http_redirects_to_https(self, domain, phase):
        """
        Given: HTTPS ist aktiv (Phase 2)
        When: HTTP-Anfrage an Domain
        Then: Redirect zu HTTPS erfolgt
        """
        if phase != 2:
            pytest.skip("Phase 2 Test")

        # Redirect nicht automatisch folgen
        response = requests.get(
            f"http://{domain}/",
            timeout=10,
            allow_redirects=False
        )

        assert response.status_code in [301, 302, 307, 308]
        location = response.headers.get("Location", "")
        assert location.startswith("https://")

    def test_www_domain_works(self, domain, phase):
        """
        Given: HTTPS ist aktiv (Phase 2)
        When: www-Domain aufgerufen wird
        Then: Seite wird angezeigt
        """
        if phase != 2:
            pytest.skip("Phase 2 Test")

        response = requests.get(f"https://www.{domain}/", timeout=10)

        assert response.status_code == 200

    def test_www_http_redirects_to_https(self, domain, phase):
        """
        Given: HTTPS ist aktiv (Phase 2)
        When: www mit HTTP aufgerufen wird
        Then: Redirect zu HTTPS erfolgt
        """
        if phase != 2:
            pytest.skip("Phase 2 Test")

        response = requests.get(
            f"http://www.{domain}/",
            timeout=10,
            allow_redirects=False
        )

        assert response.status_code in [301, 302, 307, 308]
        location = response.headers.get("Location", "")
        assert "https://" in location


class TestSslCertificate:
    """Tests für SSL-Zertifikat (Phase 2)."""

    def test_certificate_valid(self, domain, phase):
        """
        Given: HTTPS ist aktiv (Phase 2)
        When: SSL-Zertifikat geprüft wird
        Then: Zertifikat ist gültig
        """
        if phase != 2:
            pytest.skip("Phase 2 Test")

        context = ssl.create_default_context()
        try:
            with socket.create_connection((domain, 443), timeout=10) as sock:
                with context.wrap_socket(sock, server_hostname=domain) as ssock:
                    cert = ssock.getpeercert()
                    assert cert is not None
        except ssl.SSLCertVerificationError as e:
            pytest.fail(f"SSL-Zertifikat ungültig: {e}")

    def test_certificate_not_expired(self, domain, phase):
        """
        Given: HTTPS ist aktiv (Phase 2)
        When: SSL-Zertifikat Ablaufdatum geprüft wird
        Then: Zertifikat läuft nicht in den nächsten 7 Tagen ab
        """
        if phase != 2:
            pytest.skip("Phase 2 Test")

        context = ssl.create_default_context()
        with socket.create_connection((domain, 443), timeout=10) as sock:
            with context.wrap_socket(sock, server_hostname=domain) as ssock:
                cert = ssock.getpeercert()
                not_after = datetime.strptime(
                    cert["notAfter"], "%b %d %H:%M:%S %Y %Z"
                )
                days_until_expiry = (not_after - datetime.utcnow()).days
                assert days_until_expiry > 7, f"Zertifikat läuft in {days_until_expiry} Tagen ab"

    def test_certificate_covers_www(self, domain, phase):
        """
        Given: HTTPS ist aktiv (Phase 2)
        When: SSL-Zertifikat für www geprüft wird
        Then: Zertifikat gilt auch für www
        """
        if phase != 2:
            pytest.skip("Phase 2 Test")

        context = ssl.create_default_context()
        try:
            with socket.create_connection((f"www.{domain}", 443), timeout=10) as sock:
                with context.wrap_socket(sock, server_hostname=f"www.{domain}") as ssock:
                    cert = ssock.getpeercert()
                    assert cert is not None
        except ssl.SSLCertVerificationError as e:
            pytest.fail(f"SSL-Zertifikat für www ungültig: {e}")


class TestPerformance:
    """Performance-Tests."""

    def test_response_time_under_2_seconds(self, base_url):
        """
        Given: Server läuft
        When: Startseite aufgerufen wird
        Then: Antwort kommt in unter 2 Sekunden
        """
        response = requests.get(f"{base_url}/", timeout=10)

        assert response.elapsed.total_seconds() < 2

    def test_concurrent_requests(self, base_url):
        """
        Given: Server läuft
        When: 10 gleichzeitige Anfragen gestellt werden
        Then: Alle werden erfolgreich beantwortet
        """
        import concurrent.futures

        def make_request():
            return requests.get(f"{base_url}/", timeout=10)

        with concurrent.futures.ThreadPoolExecutor(max_workers=10) as executor:
            futures = [executor.submit(make_request) for _ in range(10)]
            results = [f.result() for f in futures]

        for response in results:
            assert response.status_code == 200


class TestCompleteUserJourney:
    """End-to-End User Journey Tests."""

    def test_visitor_can_browse_website(self, base_url):
        """
        Given: Ein Besucher öffnet die Website
        When: Er durch verschiedene Seiten navigiert
        Then: Alle Seiten werden korrekt angezeigt
        """
        session = requests.Session()

        # Startseite
        response = session.get(f"{base_url}/")
        assert response.status_code == 200

        # Blog
        response = session.get(f"{base_url}/blog")
        assert response.status_code == 200

        # Impressum
        response = session.get(f"{base_url}/impressum")
        assert response.status_code == 200

        # Kontaktbereich (Teil der Startseite)
        response = session.get(f"{base_url}/#kontakt")
        assert response.status_code == 200

    def test_admin_login_page_accessible(self, base_url):
        """
        Given: Ein Admin möchte sich anmelden
        When: Er die Login-Seite aufruft
        Then: Das Login-Formular wird angezeigt
        """
        response = requests.get(f"{base_url}/admin/login")

        assert response.status_code == 200
        assert "text/html" in response.headers.get("Content-Type", "")
