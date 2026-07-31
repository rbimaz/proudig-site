import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, beforeAll } from 'vitest';
import { Expertise } from './Expertise';

/**
 * Prüft, dass die Leistungs-Karten korrekt verlinken:
 * - Weiterbildung -> /seminare (bestehende Kategorie-Übersicht)
 * - übrige Karten -> /offerings/:key (Offering-Übersicht)
 */
beforeAll(() => {
  global.IntersectionObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

describe('Expertise-Karten', () => {
  it('Given Leistungs-Sektion, When gerendert, Then verlinken die Karten korrekt', () => {
    render(
      <MemoryRouter>
        <Expertise />
      </MemoryRouter>
    );

    const hrefs = screen.getAllByRole('link').map((l) => l.getAttribute('href'));

    expect(hrefs).toContain('/offerings/consulting'); // Beratung
    expect(hrefs).toContain('/offerings/studies'); // Studien
    expect(hrefs).toContain('/offerings/talks'); // Vorträge
    expect(hrefs).toContain('/offerings/software'); // Software-Lösungen
    expect(hrefs).toContain('/offerings/ai'); // KI-Anwendungen
    expect(hrefs).toContain('/seminare'); // Weiterbildung
  });
});
