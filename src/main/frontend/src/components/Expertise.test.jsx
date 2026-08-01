import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, beforeAll, afterEach, vi } from 'vitest';
import { Expertise } from './Expertise';

/**
 * Leistungs-Karten sind nur klickbar, wenn Inhalt vorhanden ist:
 * - Offering-Tag in /api/offerings/tags -> Link auf /offerings/:key
 * - Seminare vorhanden -> Weiterbildung-Link auf /seminare
 * - kein Inhalt -> kein Link (keine Navigation)
 */
beforeAll(() => {
  global.IntersectionObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

afterEach(() => {
  vi.restoreAllMocks();
});

function mockFetch({ tags, seminarsCount }) {
  global.fetch = vi.fn((url) => {
    if (url.includes('/api/offerings/tags')) {
      return Promise.resolve({ ok: true, json: async () => tags });
    }
    // /api/seminare
    return Promise.resolve({ ok: true, json: async () => ({ content: Array(seminarsCount).fill({}), totalElements: seminarsCount }) });
  });
}

describe('Expertise-Karten (inhaltsabhängig)', () => {
  it('Given alle Leistungen haben Inhalt, When geladen, Then verlinken alle Karten korrekt', async () => {
    mockFetch({
      tags: ['Beratung', 'Studien', 'Vorträge', 'Software-Lösungen', 'KI-Anwendungen'],
      seminarsCount: 2,
    });

    render(<MemoryRouter><Expertise /></MemoryRouter>);

    const links = await screen.findAllByRole('link');
    const hrefs = links.map((l) => l.getAttribute('href'));
    expect(hrefs).toEqual(expect.arrayContaining([
      '/offerings/consulting', '/offerings/studies', '/offerings/talks',
      '/offerings/software', '/offerings/ai', '/seminare',
    ]));
    expect(links).toHaveLength(6);
  });

  it('Given keine Inhalte, When geladen, Then reagiert keine Karte (kein Link)', async () => {
    mockFetch({ tags: [], seminarsCount: 0 });

    render(<MemoryRouter><Expertise /></MemoryRouter>);

    // Karten sind sichtbar ...
    expect(screen.getByText('Beratung')).toBeInTheDocument();
    // ... aber es gibt keine Links.
    await waitFor(() => expect(global.fetch).toHaveBeenCalled());
    expect(screen.queryAllByRole('link')).toHaveLength(0);
  });
});
