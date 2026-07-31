import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { OfferingOverviewPage } from './OfferingOverviewPage';

function renderAt(key) {
  return render(
    <MemoryRouter initialEntries={[`/offerings/${key}`]}>
      <Routes>
        <Route path="/offerings/:key" element={<OfferingOverviewPage />} />
      </Routes>
    </MemoryRouter>
  );
}

// URL-abhängiger fetch-Mock: /api/offerings/<key> = Index-Seite (Kopf),
// /api/offerings?tag=... = Grid.
function mockFetch({ index, grid }) {
  global.fetch = vi.fn((url) => {
    if (url.includes('tag=')) {
      return Promise.resolve({ ok: true, json: async () => ({ content: grid || [] }) });
    }
    if (index) {
      return Promise.resolve({ ok: true, json: async () => index });
    }
    return Promise.resolve({ ok: false, json: async () => null }); // 404 = kein Index
  });
}

describe('OfferingOverviewPage', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('Given keine Index-Seite, When geladen, Then Fallback-Kopf (Config-Titel) + Grid', async () => {
    mockFetch({ index: null, grid: [{ id: '1', slug: 'b1', title: 'Beitrag 1', excerpt: 'Ex', tags: ['Beratung'] }] });

    renderAt('consulting');

    expect(await screen.findByText('Beitrag 1')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1, name: 'Beratung' })).toBeInTheDocument(); // Config-Fallback
    expect(screen.getByRole('link', { name: /Mehr lesen/ })).toHaveAttribute('href', '/offerings/consulting/b1');
  });

  it('Given Index-Seite, When geladen, Then Kopf aus CMS (Titel, Untertitel, Intro)', async () => {
    mockFetch({
      index: { slug: 'consulting', title: 'Beratung — Ihr Partner', excerpt: 'Von der Analyse bis zur Umsetzung', content: 'Intro-Absatz zur Beratung.' },
      grid: [],
    });

    renderAt('consulting');

    expect(await screen.findByRole('heading', { level: 1, name: 'Beratung — Ihr Partner' })).toBeInTheDocument();
    expect(screen.getByText('Von der Analyse bis zur Umsetzung')).toBeInTheDocument();
    expect(screen.getByText('Intro-Absatz zur Beratung.')).toBeInTheDocument();
    expect(screen.getByText(/Noch keine Beiträge/)).toBeInTheDocument();
  });

  it('Given Index-Seite auch im Grid getaggt, When geladen, Then Index-Seite nicht als Karte', async () => {
    mockFetch({
      index: { slug: 'consulting', title: 'Beratung', excerpt: '', content: '' },
      grid: [
        { id: 'idx', slug: 'consulting', title: 'Index-Seite', excerpt: 'x', tags: ['Beratung'] },
        { id: '1', slug: 'b1', title: 'Echter Beitrag', excerpt: 'y', tags: ['Beratung'] },
      ],
    });

    renderAt('consulting');

    expect(await screen.findByText('Echter Beitrag')).toBeInTheDocument();
    expect(screen.queryByText('Index-Seite')).not.toBeInTheDocument();
  });

  it('Given unbekannter Key, When geladen, Then Not-Found statt Crash', () => {
    global.fetch = vi.fn();

    renderAt('does-not-exist');

    expect(screen.getByText(/Leistung nicht gefunden/)).toBeInTheDocument();
    expect(global.fetch).not.toHaveBeenCalled();
  });
});
