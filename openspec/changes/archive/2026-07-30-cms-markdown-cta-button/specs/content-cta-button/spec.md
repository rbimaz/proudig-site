## ADDED Requirements

### Requirement: CTA-Button aus Markdown-Link

CMS-Inhalte SHALL einen Markdown-Link, dessen Title exakt `button` lautet
(`[Text](/ziel "button")`), als hervorgehobenen Call-to-Action-Button mit der
CSS-Klasse `.btn-cta` rendern statt als normalen Text-Link. Der sichtbare
Link-Text SHALL zur Button-Beschriftung werden.

Dieses Verhalten SHALL einheitlich in allen öffentlichen Content-Renderern
gelten: statische Seiten, Blog-Beiträge, News-Beiträge und Seminar-Details.

#### Scenario: Interner Link mit Button-Title wird zum CTA-Button

- **WHEN** ein Inhalt den Markdown `[Jetzt anfragen](/kontakt "button")` enthält
- **THEN** wird ein Element mit der Klasse `btn-cta` und der Beschriftung
  „Jetzt anfragen" gerendert, das auf `/kontakt` verweist

#### Scenario: Normaler Link ohne Button-Title bleibt Text-Link

- **WHEN** ein Inhalt den Markdown `[Mehr erfahren](/blog)` (ohne Title `button`)
  enthält
- **THEN** wird ein normaler Text-Link ohne die Klasse `btn-cta` gerendert

### Requirement: Clientseitige Navigation für interne Ziele

Der Renderer SHALL interne Ziele — Link-Zieladressen, die mit `/` beginnen und
keine externe URL sind — über den React-Router (`Link`) clientseitig
navigieren, sodass kein voller Seiten-Reload ausgelöst wird. Dies SHALL sowohl
für CTA-Buttons als auch für normale interne Links gelten.

#### Scenario: Interner CTA-Button navigiert clientseitig

- **WHEN** ein Nutzer einen CTA-Button mit internem Ziel `/seminare` anklickt
- **THEN** wechselt die App über den React-Router zur Zielseite ohne vollen
  Seiten-Reload

#### Scenario: Interner Text-Link navigiert clientseitig

- **WHEN** ein Nutzer einen normalen internen Link mit Ziel `/blog` anklickt
- **THEN** wechselt die App über den React-Router zur Zielseite ohne vollen
  Seiten-Reload

### Requirement: Externe Ziele bleiben Standard-Links

Der Renderer SHALL Ziele, die nicht als interne Pfade erkannt werden (z. B.
`https://…`, `mailto:` oder `#anker`), als Standard-`<a>`-Element rendern und
NICHT über den React-Router navigieren. Externe CTA-Buttons SHALL weiterhin die
`.btn-cta`-Optik erhalten, aber als `<a>` mit `href` gerendert werden.

#### Scenario: Externer Link bleibt Standard-Anchor

- **WHEN** ein Inhalt den Markdown `[Website](https://example.com)` enthält
- **THEN** wird ein `<a href="https://example.com">`-Element gerendert (keine
  React-Router-Navigation)

#### Scenario: Externer CTA-Button behält Button-Optik

- **WHEN** ein Inhalt den Markdown `[Extern öffnen](https://example.com "button")`
  enthält
- **THEN** wird ein `<a>`-Element mit der Klasse `btn-cta` und Ziel
  `https://example.com` gerendert

### Requirement: Einheitliche Editor-Vorschau

Die Editor-Vorschau im CMS SHALL denselben Renderer verwenden, sodass ein CTA-
Button in der Vorschau genauso dargestellt wird wie auf der veröffentlichten
Seite.

#### Scenario: CTA-Button erscheint in der Vorschau

- **WHEN** eine Redakteurin im Seiten-Editor `[Jetzt anfragen](/kontakt "button")`
  eingibt und die Vorschau ansieht
- **THEN** zeigt die Vorschau denselben CTA-Button wie die veröffentlichte Seite