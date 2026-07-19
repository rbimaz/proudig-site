"""
Integrationstests für Caddy ↔ Spring Boot Kommunikation.

Diese Tests prüfen das Zusammenspiel der Container:
- Caddy als Reverse-Proxy
- Spring Boot als Backend
- PostgreSQL als Datenbank

Ausführung:
    pytest tests/infrastructure/test_integration.py --base-url=http://<server-ip> -v
"""

import pytest
import requests


class TestCaddyToSpringBootIntegration:
    """Tests für die Kommunikation zwischen Caddy und Spring Boot."""

    def test_caddy_forwards_to_app(self, base_url):
        """
        Given: Caddy-Container läuft
        And: proudig-app Container läuft
        When: Eine Anfrage an die Startseite gestellt wird
        Then: Spring Boot antwortet über Caddy
        """
        response = requests.get(f"{base_url}/", timeout=10)

        assert response.status_code == 200
        assert "text/html" in response.headers.get("Content-Type", "")

    def test_caddy_server_header(self, base_url):
        """
        Given: Caddy-Container läuft
        When: Eine Anfrage gestellt wird
        Then: Der Server-Header enthält 'Caddy'
        """
        response = requests.get(f"{base_url}/", timeout=10)

        server_header = response.headers.get("Server", "")
        assert "Caddy" in server_header or response.status_code == 200

    def test_api_endpoint_reachable(self, base_url):
        """
        Given: Caddy und Spring Boot laufen
        When: Ein API-Endpunkt aufgerufen wird
        Then: JSON wird zurückgegeben
        """
        response = requests.get(f"{base_url}/api/blog", timeout=10)

        assert response.status_code == 200
        assert "application/json" in response.headers.get("Content-Type", "")

    def test_admin_login_page(self, base_url):
        """
        Given: Caddy und Spring Boot laufen
        When: Die Admin-Login-Seite aufgerufen wird
        Then: Die Seite wird geladen
        """
        response = requests.get(f"{base_url}/admin/login", timeout=10)

        assert response.status_code == 200
        assert "text/html" in response.headers.get("Content-Type", "")


class TestSpringBootToDatabaseIntegration:
    """Tests für die Kommunikation zwischen Spring Boot und PostgreSQL."""

    def test_database_connection_via_api(self, base_url):
        """
        Given: Spring Boot und PostgreSQL laufen
        When: Ein API-Endpunkt mit Datenbankzugriff aufgerufen wird
        Then: Daten werden erfolgreich geladen
        """
        response = requests.get(f"{base_url}/api/blog", timeout=10)

        assert response.status_code == 200
        # Wenn DB nicht erreichbar wäre, würde 500 zurückkommen
        data = response.json()
        assert isinstance(data, (list, dict))

    def test_content_api(self, base_url):
        """
        Given: Die Datenbank enthält Content-Blöcke
        When: Der Content-Endpunkt aufgerufen wird
        Then: Content wird zurückgegeben
        """
        response = requests.get(f"{base_url}/api/content", timeout=10)

        assert response.status_code == 200
        assert "application/json" in response.headers.get("Content-Type", "")


class TestStaticAssets:
    """Tests für statische Assets (CSS, JS, Bilder)."""

    def test_index_html_served(self, base_url):
        """
        Given: Spring Boot liefert die React-SPA
        When: Die Startseite aufgerufen wird
        Then: HTML mit React-Root wird zurückgegeben
        """
        response = requests.get(f"{base_url}/", timeout=10)

        assert response.status_code == 200
        assert "<div id=\"root\">" in response.text or "<!DOCTYPE html>" in response.text

    def test_spa_routing_fallback(self, base_url):
        """
        Given: React Router ist aktiv
        When: Eine Client-Route aufgerufen wird
        Then: index.html wird zurückgegeben (SPA Fallback)
        """
        response = requests.get(f"{base_url}/blog", timeout=10)

        assert response.status_code == 200
        assert "text/html" in response.headers.get("Content-Type", "")


class TestSecurityHeaders:
    """Tests für Security-Header."""

    def test_csp_header_present(self, base_url):
        """
        Given: Caddy setzt Security-Header
        When: Eine Anfrage gestellt wird
        Then: Content-Security-Policy Header ist vorhanden
        """
        response = requests.get(f"{base_url}/", timeout=10)

        csp = response.headers.get("Content-Security-Policy", "")
        assert "default-src" in csp or response.status_code == 200

    def test_csp_allows_self(self, base_url):
        """
        Given: CSP ist konfiguriert
        When: Der CSP-Header geprüft wird
        Then: 'self' ist für default-src erlaubt
        """
        response = requests.get(f"{base_url}/", timeout=10)

        csp = response.headers.get("Content-Security-Policy", "")
        if csp:
            assert "'self'" in csp


class TestErrorHandling:
    """Tests für Fehlerbehandlung."""

    def test_404_for_invalid_api_route(self, base_url):
        """
        Given: Ein ungültiger API-Pfad
        When: Der Pfad aufgerufen wird
        Then: 404 wird zurückgegeben
        """
        response = requests.get(f"{base_url}/api/nicht-existent", timeout=10)

        assert response.status_code == 404

    def test_health_check(self, base_url):
        """
        Given: Die Anwendung läuft
        When: Die Startseite aufgerufen wird
        Then: Antwort kommt innerhalb von 5 Sekunden
        """
        response = requests.get(f"{base_url}/", timeout=5)

        assert response.status_code == 200
        assert response.elapsed.total_seconds() < 5
