# Externe Freigabe-Links für Nicht-Admins

## Warum
Seit `portal-admin-only-access` haben nur noch ADMINs Zugriff auf das Dokumentenportal. Damit fehlt
der Weg, wie Dokumente **Nicht-Admins/Kunden** erreichen. Das bisherige User-zu-User-Sharing
(„Geteilt mit mir") setzt Portal-Accounts der Empfänger voraus — die es künftig nicht mehr gibt.

Lösung: **login-freie, externe Freigabe-Links.** Ein Admin erzeugt für **ein Dokument oder einen
ganzen Ordner** (inkl. Unterordner) einen unerratbaren Token-Link; der Empfänger lädt im Browser
herunter — **ohne Account, ohne Portal**. Bei einem Ordner-Link sieht der Empfänger die Dateiliste des
Ordners (samt Unterordner) und lädt einzelne Dateien.

## Was
- **Neu:** Entität `ExternalShareLink` (Ziel = **Dokument ODER Ordner**) + Admin-Endpunkte zum
  Erstellen/Auflisten/Widerrufen und **öffentliche** Endpunkte zum Abrufen/Listen/Download über den Token.
  - Admin (ADMIN-only, `/api/shares`): Link erstellen (Ziel Dokument **oder** Ordner, optionales
    Passwort, optionales Ablaufdatum, optionale Empfänger-E-Mail), Links auflisten, Link widerrufen.
  - Öffentlich (`/api/public/shares/{token}`, permitAll): Metadaten (Ziel-Typ, Name, Passwort nötig?,
    gültig?); bei Ordner zusätzlich Dateiliste (rekursiv); Download-Stream einzelner Dateien bei
    gültigem Token/Passwort — bei Ordner-Links nur für Dateien **innerhalb** des freigegebenen Ordners.
  - Öffentliche Seite `/s/{token}` (React), **ausgenommen vom Coming-Soon-Gate**: bei Dokument ein
    Download-Button, bei Ordner die Dateiliste mit Download je Datei; optionale Passwort-Eingabe.
- **Sicherheit:** kryptografisch zufälliger Token; optionales BCrypt-Passwort; Ablauf + Widerruf;
  Rate-Limit auf Passwortversuche; Datei per ID-Lookup (kein Pfad-Traversal); jeder Zugriff wird im
  bestehenden `ActivityLog` protokolliert (schließt die Lücke „Downloads nicht auditiert").
- **Abgelöst:** das alte User-zu-User-`DocumentShare` (Backend: Controller/Service/Entity/DTO/Repo;
  Frontend: „Geteilt mit mir"-Seite + Nav + Share-Dialog). 0 Bestandsfreigaben → nichts zu migrieren.
  `DocumentController.download` wird von `canAccessDocument` entkoppelt (Portal ist ADMIN-only).

## Nicht-Ziele
- **Kein** eingehender Rückkanal (Upload-Anfrage) — v1 ist **nur ausgehend** (Admin → extern).
- Keine dauerhafte Empfänger-Ansicht/Magic-Link-Login (Variante B), keine Nextcloud-Integration.
- **Kein** Löschen von CLIENT-Accounts (bleiben bestehen).
- Kein E-Mail-Versand-Zwang: Empfänger-E-Mail ist optional (Label/Audit); automatischer Mailversand
  ist optional und kann später ergänzt werden.
