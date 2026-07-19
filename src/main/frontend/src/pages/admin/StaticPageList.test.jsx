import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { StaticPageList } from './StaticPageList';

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
 * Unit Tests fuer StaticPageList
 *
 * Testet die korrekte Navigation zu CMS-Seiten-Editor:
 * - "Neue Seite" navigiert zu /admin/cms/seiten/new
 * - "Bearbeiten" navigiert zu /admin/cms/seiten/{id}
 */
describe('StaticPageList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockPages = [
    { id: 'page-1', title: 'Impressum', slug: 'impressum', status: 'published', updatedAt: '2026-06-09T10:00:00Z' },
    { id: 'page-2', title: 'Datenschutz', slug: 'datenschutz', status: 'draft', updatedAt: '2026-06-08T14:30:00Z' }
  ];

  const setupMocks = (pages = mockPages) => {
    mockAuthFetch.mockImplementation((url) => {
      if (url.includes('/api/admin/pages')) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve(pages) });
      }
      return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
    });
  };

  describe('Szenario 1: Neue Seite erstellen', () => {
    it('Given Seiten-Liste wird angezeigt, When "Neue Seite" geklickt, Then navigiert zu /admin/cms/seiten/new', async () => {
      setupMocks();
      render(
        <BrowserRouter>
          <StaticPageList />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('Impressum')).toBeInTheDocument();
      });

      const newButton = screen.getByRole('button', { name: /Neue Seite/i });
      fireEvent.click(newButton);

      expect(mockNavigate).toHaveBeenCalledWith('/admin/cms/seiten/new');
    });
  });

  describe('Szenario 2: Bestehende Seite bearbeiten', () => {
    it('Given Seiten-Liste mit Seite, When "Bearbeiten" geklickt, Then navigiert zu /admin/cms/seiten/{id}', async () => {
      setupMocks();
      render(
        <BrowserRouter>
          <StaticPageList />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('Impressum')).toBeInTheDocument();
      });

      const editButtons = screen.getAllByRole('button', { name: /Bearbeiten/i });
      fireEvent.click(editButtons[0]);

      expect(mockNavigate).toHaveBeenCalledWith('/admin/cms/seiten/page-1');
    });

    it('Given mehrere Seiten, When zweite Seite bearbeitet, Then navigiert zu korrekter ID', async () => {
      setupMocks();
      render(
        <BrowserRouter>
          <StaticPageList />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('Datenschutz')).toBeInTheDocument();
      });

      const editButtons = screen.getAllByRole('button', { name: /Bearbeiten/i });
      fireEvent.click(editButtons[1]);

      expect(mockNavigate).toHaveBeenCalledWith('/admin/cms/seiten/page-2');
    });
  });

  describe('Seiten-Liste Anzeige', () => {
    it('Given Seiten existieren, When Liste geladen, Then zeigt alle Seiten', async () => {
      setupMocks();
      render(
        <BrowserRouter>
          <StaticPageList />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('Impressum')).toBeInTheDocument();
        expect(screen.getByText('Datenschutz')).toBeInTheDocument();
      });
    });

    it('Given keine Seiten, When Liste geladen, Then zeigt "Keine Seiten vorhanden"', async () => {
      setupMocks([]);
      render(
        <BrowserRouter>
          <StaticPageList />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('Keine Seiten vorhanden')).toBeInTheDocument();
      });
    });
  });
});
