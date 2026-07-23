# cms-settings Specification

## Purpose
Definiert persistente, über die Admin-UI konfigurierbare Systemeinstellungen (Key-Value) mit Property-Fallback (DB-Wert vor application.properties-Default), ADMIN-beschränkte Verwaltung und die hier genutzten News-Lebenszyklus-Defaults.

## Requirements
### Requirement: Persistente Systemeinstellungen mit Property-Fallback

Das System SHALL Systemeinstellungen als persistente Schlüssel-Wert-Paare vorhalten. Beim Auflösen eines Wertes SHALL ein in der Datenbank gesetzter Wert Vorrang haben; ist kein DB-Wert vorhanden, SHALL der als `application.properties` definierte Default greifen.

#### Scenario: DB-Wert überschreibt Property-Default

- **WHEN** für einen Einstellungs-Schlüssel ein DB-Wert gesetzt ist
- **THEN** liefert die Auflösung den DB-Wert statt des Property-Defaults

#### Scenario: Fallback auf Property-Default

- **WHEN** für einen Schlüssel kein DB-Wert existiert
- **THEN** liefert die Auflösung den Property-Default

### Requirement: Einstellungen nur für ADMIN verwaltbar

Das Lesen und Ändern der Systemeinstellungen über die Admin-API SHALL ausschließlich der Rolle `ADMIN` erlaubt sein. Zugriffe anderer Rollen SHALL abgewiesen werden.

#### Scenario: ADMIN ändert eine Einstellung

- **WHEN** ein ADMIN die Einstellungsseite speichert
- **THEN** werden die geänderten Werte persistiert und wirken bei der nächsten Auflösung

#### Scenario: Nicht-ADMIN wird abgewiesen

- **WHEN** ein Nutzer ohne Rolle `ADMIN` die Einstellungs-Endpunkte aufruft
- **THEN** wird der Zugriff verweigert

### Requirement: Konfigurierbare News-Lebenszyklus-Defaults in der UI

Die Admin-Einstellungsseite SHALL die folgenden News-Lebenszyklus-Defaults anzeigen und editierbar machen: die Default-Frist A (Vorbelegung neuer News), die globale Frist B (Aufbewahrungsdauer bis `HIDDEN`) und den Lebenszyklus-Cron/Intervall. Duration-Werte SHALL in der Systematik `30d/30h/30m/30s` erfasst werden; ungültige Werte SHALL abgewiesen werden.

#### Scenario: Aufbewahrungsdauer per UI ändern

- **WHEN** ein ADMIN die globale Frist B auf einen neuen gültigen Wert setzt und speichert
- **THEN** verwendet der nächste Lebenszyklus-Lauf den neuen Wert ohne Neustart

#### Scenario: Cron per UI ändern

- **WHEN** ein ADMIN den Lebenszyklus-Cron auf einen neuen gültigen Ausdruck setzt und speichert
- **THEN** läuft der Job künftig nach dem neuen Zeitplan ohne Neustart

#### Scenario: Ungültiger Wert wird abgewiesen

- **WHEN** ein ADMIN einen Duration- oder Cron-Wert im falschen Format speichern will
- **THEN** wird die Eingabe als ungültig zurückgewiesen und der bisherige Wert bleibt erhalten
