# Kontaktformular - Spezifikation

## Übersicht

Das Kontaktformular ermöglicht Website-Besuchern, Nachrichten an ProuDig zu senden. Die Nachrichten werden in der Datenbank gespeichert und von Mitarbeitern manuell bearbeitet. Es erfolgt **kein automatischer E-Mail-Versand**.

---

## Given-When-Then Spezifikationen

### 1. Kontaktformular absenden (Besucher)

#### 1.1 Erfolgreiche Nachricht

```gherkin
Given ein Besucher ist auf der Startseite im Bereich "Kontakt"
And das Kontaktformular ist sichtbar
When der Besucher alle Pflichtfelder ausfüllt:
  | Feld       | Wert                    | Pflicht |
  | Vorname    | Max                     | Ja      |
  | Nachname   | Mustermann              | Ja      |
  | E-Mail     | max@beispiel.de         | Ja      |
  | Unternehmen| Musterfirma GmbH        | Nein    |
  | Nachricht  | Ich interessiere mich...| Ja      |
And auf "Nachricht senden" klickt
Then wird die Nachricht in der Datenbank gespeichert
And eine Erfolgsmeldung wird angezeigt: "Vielen Dank für Ihre Nachricht. Wir melden uns in Kürze bei Ihnen."
And das Formular wird geleert
```

#### 1.2 Fehlende Pflichtfelder

```gherkin
Given ein Besucher ist auf der Startseite im Bereich "Kontakt"
When der Besucher das Formular absendet ohne alle Pflichtfelder auszufüllen
Then wird das Formular NICHT abgesendet
And die fehlenden Pflichtfelder werden markiert
And der Besucher bleibt auf der Seite
```

#### 1.3 Ungültige E-Mail-Adresse

```gherkin
Given ein Besucher füllt das Kontaktformular aus
And gibt eine ungültige E-Mail-Adresse ein (z.B. "max@")
When der Besucher auf "Nachricht senden" klickt
Then wird das Formular NICHT abgesendet
And ein Hinweis erscheint: "Bitte geben Sie eine gültige E-Mail-Adresse ein."
```

#### 1.4 Server-Fehler

```gherkin
Given ein Besucher hat das Kontaktformular korrekt ausgefüllt
When der Besucher auf "Nachricht senden" klickt
And der Server nicht erreichbar ist oder einen Fehler zurückgibt
Then wird eine Fehlermeldung angezeigt: "Die Nachricht konnte nicht gesendet werden. Bitte versuchen Sie es später erneut."
And die Formulardaten bleiben erhalten (werden nicht gelöscht)
```

#### 1.5 Ladeindikator während des Sendens

```gherkin
Given ein Besucher hat das Kontaktformular korrekt ausgefüllt
When der Besucher auf "Nachricht senden" klickt
Then wird der Button deaktiviert und zeigt "Wird gesendet..."
And der Besucher kann das Formular nicht erneut absenden
Until die Serverantwort eingetroffen ist
```

---

### 2. Nachrichten verwalten (Admin)

#### 2.1 Nachrichtenübersicht anzeigen

```gherkin
Given ein Administrator ist im CMS eingeloggt
When er den Bereich "Nachrichten" öffnet
Then sieht er eine Liste aller eingegangenen Kontaktanfragen
And die Liste zeigt pro Eintrag:
  | Spalte     | Inhalt                          |
  | Status     | Neu / Gelesen                   |
  | Datum      | Eingangsdatum und Uhrzeit       |
  | Name       | Vorname + Nachname              |
  | E-Mail     | E-Mail-Adresse                  |
  | Unternehmen| Unternehmen (falls angegeben)   |
  | Vorschau   | Erste 50 Zeichen der Nachricht  |
And die Liste ist nach Datum sortiert (neueste zuerst)
```

#### 2.2 Neue Nachrichten erkennen

```gherkin
Given ein Administrator öffnet die Nachrichtenübersicht
When neue (ungelesene) Nachrichten vorhanden sind
Then werden diese visuell hervorgehoben (z.B. fett, farbiger Punkt)
And die Anzahl ungelesener Nachrichten wird angezeigt
```

#### 2.3 Nachricht lesen (Detailansicht)

```gherkin
Given ein Administrator ist in der Nachrichtenübersicht
When er auf eine Nachricht klickt
Then öffnet sich die Detailansicht mit:
  | Feld        | Inhalt                    |
  | Vorname     | Max                       |
  | Nachname    | Mustermann                |
  | E-Mail      | max@beispiel.de (klickbar)|
  | Unternehmen | Musterfirma GmbH          |
  | Eingegangen | 10.06.2025 um 14:32 Uhr   |
  | Nachricht   | Vollständiger Text        |
And die Nachricht wird automatisch als "gelesen" markiert
```

#### 2.4 Nachricht als ungelesen markieren

```gherkin
Given ein Administrator hat eine Nachricht geöffnet
When er auf "Als ungelesen markieren" klickt
Then wird die Nachricht wieder als "Neu" markiert
And sie erscheint wieder hervorgehoben in der Liste
```

#### 2.5 Nachricht löschen

```gherkin
Given ein Administrator ist in der Nachrichtenübersicht oder Detailansicht
When er auf "Löschen" klickt
Then erscheint ein Bestätigungsdialog: "Nachricht wirklich löschen?"
And wenn er bestätigt, wird die Nachricht unwiderruflich gelöscht
And er kehrt zur Nachrichtenübersicht zurück
```

#### 2.6 Mehrere Nachrichten löschen (Spam-Bereinigung)

```gherkin
Given ein Administrator ist in der Nachrichtenübersicht
When er mehrere Nachrichten per Checkbox auswählt
And auf "Ausgewählte löschen" klickt
Then erscheint ein Bestätigungsdialog: "X Nachrichten wirklich löschen?"
And wenn er bestätigt, werden alle ausgewählten Nachrichten gelöscht
```

#### 2.7 Nachrichten filtern

```gherkin
Given ein Administrator ist in der Nachrichtenübersicht
When er den Filter "Nur ungelesene" aktiviert
Then werden nur Nachrichten mit Status "Neu" angezeigt
```

#### 2.8 E-Mail direkt antworten

```gherkin
Given ein Administrator liest eine Nachricht
When er auf die E-Mail-Adresse des Absenders klickt
Then öffnet sich das Standard-E-Mail-Programm
And die Empfängeradresse ist vorausgefüllt
```

---

### 3. Berechtigungen

#### 3.1 Nur Admins und Consultants haben Zugriff

```gherkin
Given ein Benutzer mit der Rolle "CLIENT" ist eingeloggt
When er versucht, /admin/cms/nachrichten aufzurufen
Then wird er zur Admin-Home-Seite weitergeleitet
And erhält keinen Zugriff auf die Nachrichten
```

#### 3.2 Admins und Consultants können Nachrichten verwalten

```gherkin
Given ein Benutzer mit der Rolle "ADMIN" oder "CONSULTANT" ist eingeloggt
When er /admin/cms/nachrichten aufruft
Then hat er vollen Zugriff auf alle Nachrichten (lesen, löschen)
```

---

### 4. Datenmodell

#### 4.1 Nachricht speichern

```gherkin
Given eine Kontaktanfrage wird abgesendet
When die Nachricht gespeichert wird
Then enthält der Datenbankeintrag:
  | Feld        | Typ          | Beschreibung              |
  | id          | BIGINT       | Primärschlüssel           |
  | firstName   | VARCHAR(100) | Vorname                   |
  | lastName    | VARCHAR(100) | Nachname                  |
  | email       | VARCHAR(255) | E-Mail-Adresse            |
  | company     | VARCHAR(255) | Unternehmen (optional)    |
  | message     | TEXT         | Nachrichtentext           |
  | isRead      | BOOLEAN      | Gelesen-Status            |
  | createdAt   | TIMESTAMP    | Eingangszeitpunkt         |
```

---

## Nicht-funktionale Anforderungen

| ID | Anforderung |
|----|-------------|
| NF-01 | Spam-Schutz: Einfacher Honeypot-Mechanismus (verstecktes Feld) |
| NF-02 | Rate-Limiting: Max. 5 Nachrichten pro IP pro Stunde |
| NF-03 | Validierung: E-Mail-Format serverseitig prüfen |
| NF-04 | Längenbegrenzung: Nachricht max. 5000 Zeichen |
| NF-05 | Keine sensiblen Daten loggen (DSGVO) |

---

## Abgrenzung

| Feature | In Scope | Out of Scope |
|---------|----------|--------------|
| Nachricht speichern | ✓ | |
| Admin-Übersicht | ✓ | |
| Löschen (einzeln/mehrfach) | ✓ | |
| Gelesen-Status | ✓ | |
| E-Mail-Versand | | ✗ |
| Automatische Antwort | | ✗ |
| Ticket-System | | ✗ |
| Kategorisierung | | ✗ |
