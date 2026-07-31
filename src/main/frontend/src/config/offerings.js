// Zentrale Zuordnung Leistungs-Karte ↔ URL-Key ↔ Content-Tag.
// Einzige Quelle für die klickbaren Karten (Expertise.jsx) und die
// Offering-Übersicht (OfferingOverviewPage). Der Tag ist der kanonische
// deutsche Content-Tag, mit dem Redaktion die Offering-Beiträge versieht.
export const OFFERINGS = [
  { key: 'consulting', title: 'Beratung', tag: 'Beratung' },
  { key: 'studies', title: 'Studien', tag: 'Studien' },
  { key: 'talks', title: 'Vorträge', tag: 'Vorträge' },
  { key: 'software', title: 'Software-Lösungen', tag: 'Software-Lösungen' },
  { key: 'ai', title: 'KI-Anwendungen', tag: 'KI-Anwendungen' },
];

export const getOfferingByKey = (key) => OFFERINGS.find((o) => o.key === key) || null;
