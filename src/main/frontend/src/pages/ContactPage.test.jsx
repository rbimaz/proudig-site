import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { describe, it, expect, beforeAll } from 'vitest';
import { ContactPage } from './ContactPage';

/**
 * Unit Test für die Kontaktseite unter der Route /kontakt.
 * Prüft, dass das bestehende Kontaktformular als eigenständige Seite rendert.
 */
beforeAll(() => {
  // useFadeUp nutzt IntersectionObserver, den jsdom nicht bereitstellt.
  global.IntersectionObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

describe('ContactPage (/kontakt)', () => {
  it('Given Route /kontakt, When gerendert, Then zeigt das Kontaktformular', () => {
    render(
      <MemoryRouter initialEntries={['/kontakt']}>
        <Routes>
          <Route path="/kontakt" element={<ContactPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: 'Kontakt aufnehmen' })).toBeInTheDocument();
    expect(screen.getByLabelText('Vorname')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /senden|absenden|nachricht/i })).toBeInTheDocument();
  });
});
