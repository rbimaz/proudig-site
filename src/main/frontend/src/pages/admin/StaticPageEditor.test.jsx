import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter, MemoryRouter, Routes, Route } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { StaticPageEditor } from './StaticPageEditor';

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock useAuth
const mockAuthFetch = vi.fn();
vi.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({
    authFetch: mockAuthFetch
  })
}));

/**
 * Unit Tests fuer StaticPageEditor
 *
 * Testet die korrekte Navigation:
 * - "Zurueck" navigiert zu /admin/cms/seiten
 * - Nach Speichern navigiert zu /admin/cms/seiten/{id}
 * - Nach Veroeffentlichen navigiert zu /admin/cms/seiten/{id}
 */
describe('StaticPageEditor', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockPage = {
    id: 'page-123',
    title: 'Test Seite',
    slug: 'test-seite',
    content: '<p>Test</p>',
    status: 'draft'
  };

  const renderEditor = (id = null) => {
    if (id) {
      return render(
        <MemoryRouter initialEntries={[`/admin/cms/seiten/${id}`]}>
          <Routes>
            <Route path="/admin/cms/seiten/:id" element={<StaticPageEditor />} />
          </Routes>
        </MemoryRouter>
      );
    }
    return render(
      <MemoryRouter initialEntries={['/admin/cms/seiten/new']}>
        <Routes>
          <Route path="/admin/cms/seiten/new" element={<StaticPageEditor />} />
        </Routes>
      </MemoryRouter>
    );
  };

  describe('Szenario 3: Zurueck zur Liste', () => {
    it('Given Editor wird angezeigt (neue Seite), When "Zurueck" geklickt, Then navigiert zu /admin/cms/seiten', async () => {
      renderEditor();

      await waitFor(() => {
        expect(screen.getByText('Neue Seite')).toBeInTheDocument();
      });

      const backButton = screen.getByRole('button', { name: /Zurueck/i });
      fireEvent.click(backButton);

      expect(mockNavigate).toHaveBeenCalledWith('/admin/cms/seiten');
    });

    it('Given Editor bearbeitet existierende Seite, When "Zurueck" geklickt, Then navigiert zu /admin/cms/seiten', async () => {
      mockAuthFetch.mockImplementation((url) => {
        if (url.includes('/api/admin/pages/page-123')) {
          return Promise.resolve({ ok: true, json: () => Promise.resolve(mockPage) });
        }
        return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
      });

      renderEditor('page-123');

      await waitFor(() => {
        expect(screen.getByText('Seite bearbeiten')).toBeInTheDocument();
      });

      const backButton = screen.getByRole('button', { name: /Zurueck/i });
      fireEvent.click(backButton);

      expect(mockNavigate).toHaveBeenCalledWith('/admin/cms/seiten');
    });
  });

  describe('Szenario 4: Nach Speichern einer neuen Seite', () => {
    it('Given neue Seite erstellt, When gespeichert, Then navigiert zu /admin/cms/seiten/{id}', async () => {
      mockAuthFetch.mockImplementation((url, options) => {
        if (options?.method === 'POST') {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ id: 'new-page-id', status: 'draft' })
          });
        }
        return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
      });

      renderEditor();

      await waitFor(() => {
        expect(screen.getByText('Neue Seite')).toBeInTheDocument();
      });

      // Fill in title - use specific placeholder text to select first input
      const titleInput = screen.getByPlaceholderText('z.B. Impressum, Leistungen, Datenschutz');
      fireEvent.change(titleInput, { target: { value: 'Neue Test Seite' } });

      const saveButton = screen.getByRole('button', { name: /Entwurf speichern/i });
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/admin/cms/seiten/new-page-id', { replace: true });
      });
    });
  });

  describe('Szenario 5: Nach Veroeffentlichen einer neuen Seite', () => {
    it('Given neue Seite erstellt, When veroeffentlicht, Then navigiert zu /admin/cms/seiten/{id}', async () => {
      let postCalled = false;
      mockAuthFetch.mockImplementation((url, options) => {
        if (options?.method === 'POST' && !postCalled) {
          postCalled = true;
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ id: 'published-page-id', status: 'draft' })
          });
        }
        if (options?.method === 'PUT' && url.includes('/publish')) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ id: 'published-page-id', status: 'published' })
          });
        }
        return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
      });

      renderEditor();

      await waitFor(() => {
        expect(screen.getByText('Neue Seite')).toBeInTheDocument();
      });

      // Fill in title - use specific placeholder text to select first input
      const titleInput = screen.getByPlaceholderText('z.B. Impressum, Leistungen, Datenschutz');
      fireEvent.change(titleInput, { target: { value: 'Publish Test' } });

      const publishButton = screen.getByRole('button', { name: /Veroeffentlichen/i });
      fireEvent.click(publishButton);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/admin/cms/seiten/published-page-id', { replace: true });
      });
    });
  });

  describe('Editor Anzeige', () => {
    it('Given neue Seite, When Editor geladen, Then zeigt "Neue Seite"', async () => {
      renderEditor();

      await waitFor(() => {
        expect(screen.getByText('Neue Seite')).toBeInTheDocument();
      });
    });

    it('Given existierende Seite, When Editor geladen, Then zeigt "Seite bearbeiten"', async () => {
      mockAuthFetch.mockImplementation((url) => {
        if (url.includes('/api/admin/pages/page-123')) {
          return Promise.resolve({ ok: true, json: () => Promise.resolve(mockPage) });
        }
        return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
      });

      renderEditor('page-123');

      await waitFor(() => {
        expect(screen.getByText('Seite bearbeiten')).toBeInTheDocument();
      });
    });
  });
});
