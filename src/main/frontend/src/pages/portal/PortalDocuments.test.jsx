import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PortalDocuments } from './PortalDocuments';

// Mock useAuth
const mockAuthFetch = vi.fn();
vi.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({
    authFetch: mockAuthFetch
  })
}));

// Mock useFolderTree
const mockSetCurrentFolderId = vi.fn();
const mockSetFolderPath = vi.fn();
const mockTriggerRefresh = vi.fn();
let mockFolderPath = [];

vi.mock('../../contexts/FolderTreeContext', () => ({
  useFolderTree: () => ({
    currentFolderId: null,
    setCurrentFolderId: mockSetCurrentFolderId,
    folderPath: mockFolderPath,
    setFolderPath: mockSetFolderPath,
    triggerRefresh: mockTriggerRefresh
  })
}));

/**
 * Unit Tests für PortalDocuments - Option 4 Redesign
 *
 * Testet das neue Layout mit:
 * - Einheitlicher Gutter-Achse
 * - Kompakter Toolbar
 * - Unified List
 * - Einheitlichem Action-Button-System
 */
describe('PortalDocuments', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFolderPath = [];
    vi.spyOn(window, 'prompt').mockImplementation(() => null);
    vi.spyOn(window, 'confirm').mockImplementation(() => false);
  });

  const mockFolders = [
    { id: 'folder-1', name: 'Projekte', documentCount: 5, childFolderCount: 2, hasChildren: true },
    { id: 'folder-2', name: 'Archiv', documentCount: 0, childFolderCount: 0, hasChildren: false }
  ];

  const mockDocuments = [
    { id: 'doc-1', fileName: 'Report.pdf', fileSize: 1258291, contentType: 'application/pdf', createdAt: '2026-06-08T14:30:00Z' },
    { id: 'doc-2', fileName: 'Bild.png', fileSize: 524288, contentType: 'image/png', createdAt: '2026-06-07T09:15:00Z' }
  ];

  const setupMocks = (folders = mockFolders, documents = mockDocuments) => {
    mockAuthFetch.mockImplementation((url) => {
      if (url === '/api/folders' || url.includes('/children')) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve(folders) });
      }
      if (url === '/api/documents' || url.includes('/folder/')) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve(documents) });
      }
      return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
    });
  };

  describe('Szenario 1: Einheitliche Gutter-Achse', () => {
    it('Given Seite wird geladen, When angezeigt, Then haben Titel, Toolbar und Liste gleiche Klassen', async () => {
      setupMocks();
      render(<PortalDocuments />);

      await waitFor(() => {
        expect(document.querySelector('.pd-title-block')).toBeInTheDocument();
        expect(document.querySelector('.pd-toolbar-block')).toBeInTheDocument();
        expect(document.querySelector('.pd-list-block')).toBeInTheDocument();
      });
    });
  });

  describe('Szenario 2: Kompakte Toolbar', () => {
    it('Given Seite wird geladen, When Toolbar angezeigt, Then zeigt Breadcrumb und Buttons', async () => {
      setupMocks();
      render(<PortalDocuments />);

      await waitFor(() => {
        // Breadcrumb
        expect(screen.getByText('Stammverzeichnis')).toBeInTheDocument();

        // Buttons
        expect(screen.getByText('Hochladen')).toBeInTheDocument();
        expect(screen.getByText('Neuer Ordner')).toBeInTheDocument();
      });
    });
  });

  describe('Szenario 4: Hochladen-Button öffnet File-Dialog', () => {
    it('Given Toolbar wird angezeigt, When Hochladen geklickt, Then wird File-Input getriggert', async () => {
      setupMocks();
      render(<PortalDocuments />);

      await waitFor(() => {
        expect(screen.getByText('Hochladen')).toBeInTheDocument();
      });

      // File input sollte existieren
      const fileInput = document.querySelector('input[type="file"]');
      expect(fileInput).toBeInTheDocument();
    });
  });

  describe('Szenario 5: Unified List - Ordner und Dateien in einer Tabelle', () => {
    it('Given Ordner und Dateien existieren, When Liste angezeigt, Then in einer Tabelle', async () => {
      setupMocks();
      render(<PortalDocuments />);

      await waitFor(() => {
        // Header
        expect(screen.getByText('NAME')).toBeInTheDocument();
        expect(screen.getByText('GRÖSSE')).toBeInTheDocument();
        expect(screen.getByText('HOCHGELADEN')).toBeInTheDocument();
        expect(screen.getByText('AKTION')).toBeInTheDocument();

        // Ordner
        expect(screen.getByText('Projekte')).toBeInTheDocument();
        expect(screen.getByText('Archiv')).toBeInTheDocument();

        // Dateien
        expect(screen.getByText('Report.pdf')).toBeInTheDocument();
        expect(screen.getByText('Bild.png')).toBeInTheDocument();
      });
    });
  });

  describe('Szenario 6: Ordner-Zeile', () => {
    it('Given Ordner mit Elementen, When angezeigt, Then zeigt Element-Anzahl', async () => {
      setupMocks();
      render(<PortalDocuments />);

      await waitFor(() => {
        // Projekte hat 5 Dokumente + 2 Unterordner = 7 Elemente
        expect(screen.getByText('7 Elemente')).toBeInTheDocument();

        // Archiv hat 0 Elemente
        expect(screen.getByText('0 Elemente')).toBeInTheDocument();
      });
    });

    it('Given Ordner, When angezeigt, Then zeigt "—" für Hochgeladen', async () => {
      setupMocks();
      render(<PortalDocuments />);

      await waitFor(() => {
        const rows = document.querySelectorAll('.pd-list-row-folder');
        expect(rows.length).toBe(2);

        // Jeder Ordner sollte "—" für Datum haben
        rows.forEach(row => {
          expect(row.textContent).toContain('—');
        });
      });
    });
  });

  describe('Szenario 7: Datei-Zeile', () => {
    it('Given Datei mit Größe, When angezeigt, Then zeigt formatierte Größe', async () => {
      setupMocks();
      render(<PortalDocuments />);

      await waitFor(() => {
        expect(screen.getByText('1.2 MB')).toBeInTheDocument();
        expect(screen.getByText('512.0 KB')).toBeInTheDocument();
      });
    });
  });

  describe('Szenario 8-10: Action-Buttons', () => {
    it('Given Ordner-Zeile, When angezeigt, Then hat Öffnen, Umbenennen, Löschen Buttons', async () => {
      setupMocks();
      render(<PortalDocuments />);

      await waitFor(() => {
        const openButtons = screen.getAllByTitle('Öffnen');
        const renameButtons = screen.getAllByTitle('Umbenennen');
        const deleteButtons = screen.getAllByTitle('Löschen');

        expect(openButtons.length).toBeGreaterThan(0);
        expect(renameButtons.length).toBeGreaterThan(0);
        expect(deleteButtons.length).toBeGreaterThan(0);
      });
    });

    it('Given Datei-Zeile, When angezeigt, Then hat Download Button statt Öffnen', async () => {
      setupMocks();
      render(<PortalDocuments />);

      await waitFor(() => {
        const downloadButtons = screen.getAllByTitle('Download');
        expect(downloadButtons.length).toBe(2); // 2 Dateien
      });
    });
  });

  describe('Szenario 12: Drop-Zone unter Tabelle', () => {
    it('Given Seite wird geladen, When angezeigt, Then ist Drop-Zone unter Liste', async () => {
      setupMocks();
      render(<PortalDocuments />);

      await waitFor(() => {
        const dropzone = document.querySelector('.pd-dropzone');
        expect(dropzone).toBeInTheDocument();
        expect(screen.getByText('Dateien hier ablegen')).toBeInTheDocument();
      });
    });
  });

  describe('Szenario 14: Empty State', () => {
    it('Given keine Ordner oder Dateien, When angezeigt, Then zeigt Empty State', async () => {
      setupMocks([], []);
      render(<PortalDocuments />);

      await waitFor(() => {
        expect(screen.getByText('Noch keine Elemente')).toBeInTheDocument();
      });
    });
  });

  describe('Ordner-Aktionen', () => {
    it('Given Ordner, When Öffnen geklickt, Then navigiert zu Ordner', async () => {
      setupMocks();
      render(<PortalDocuments />);

      await waitFor(() => {
        expect(screen.getByText('Projekte')).toBeInTheDocument();
      });

      const openButtons = screen.getAllByTitle('Öffnen');
      fireEvent.click(openButtons[0]);

      expect(mockSetFolderPath).toHaveBeenCalled();
      expect(mockSetCurrentFolderId).toHaveBeenCalledWith('folder-1');
    });

    it('Given Ordner, When Umbenennen geklickt und Name eingegeben, Then API aufgerufen', async () => {
      setupMocks();
      window.prompt.mockReturnValue('Neuer Name');
      mockAuthFetch.mockImplementation((url, options) => {
        if (options?.method === 'PUT') {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ ...mockFolders[0], name: 'Neuer Name' })
          });
        }
        if (url === '/api/folders') {
          return Promise.resolve({ ok: true, json: () => Promise.resolve(mockFolders) });
        }
        return Promise.resolve({ ok: true, json: () => Promise.resolve([]) });
      });

      render(<PortalDocuments />);

      await waitFor(() => {
        expect(screen.getByText('Projekte')).toBeInTheDocument();
      });

      const renameButtons = screen.getAllByTitle('Umbenennen');
      fireEvent.click(renameButtons[0]);

      await waitFor(() => {
        expect(mockAuthFetch).toHaveBeenCalledWith(
          '/api/folders/folder-1',
          expect.objectContaining({ method: 'PUT' })
        );
      });
    });

    it('Given Ordner mit Inhalt, When Löschen geklickt, Then ConfirmDialog mit Warnung angezeigt', async () => {
      setupMocks();
      render(<PortalDocuments />);

      await waitFor(() => {
        expect(screen.getByText('Projekte')).toBeInTheDocument();
      });

      const deleteButtons = screen.getAllByTitle('Löschen');
      fireEvent.click(deleteButtons[0]); // First delete button is for "Projekte" folder

      // ConfirmDialog should be shown
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
        expect(screen.getByText('Ordner löschen')).toBeInTheDocument();
        expect(screen.getByText(/5 Dateien/)).toBeInTheDocument();
      });
    });

    it('Given Ordner-Lösch-Dialog offen, When bestätigt, Then API aufgerufen', async () => {
      setupMocks();
      mockAuthFetch.mockImplementation((url, options) => {
        if (options?.method === 'DELETE') {
          return Promise.resolve({ ok: true });
        }
        if (url === '/api/folders') {
          return Promise.resolve({ ok: true, json: () => Promise.resolve(mockFolders) });
        }
        return Promise.resolve({ ok: true, json: () => Promise.resolve([]) });
      });

      render(<PortalDocuments />);

      await waitFor(() => {
        expect(screen.getByText('Projekte')).toBeInTheDocument();
      });

      const deleteButtons = screen.getAllByTitle('Löschen');
      fireEvent.click(deleteButtons[0]);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      // Click confirm button in dialog (use the dialog's danger button)
      const dialogConfirmBtn = document.querySelector('.confirm-dialog-btn-danger');
      fireEvent.click(dialogConfirmBtn);

      await waitFor(() => {
        expect(mockAuthFetch).toHaveBeenCalledWith(
          '/api/folders/folder-1',
          expect.objectContaining({ method: 'DELETE' })
        );
      });
    });

    it('Given Ordner-Lösch-Dialog offen, When abgebrochen, Then Dialog geschlossen und keine API', async () => {
      setupMocks();
      render(<PortalDocuments />);

      await waitFor(() => {
        expect(screen.getByText('Projekte')).toBeInTheDocument();
      });

      const deleteButtons = screen.getAllByTitle('Löschen');
      fireEvent.click(deleteButtons[0]);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      // Click cancel button in dialog
      const dialogCancelBtn = document.querySelector('.confirm-dialog-btn-cancel');
      fireEvent.click(dialogCancelBtn);

      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });

      // API should not have been called with DELETE
      expect(mockAuthFetch).not.toHaveBeenCalledWith(
        '/api/folders/folder-1',
        expect.objectContaining({ method: 'DELETE' })
      );
    });
  });

  describe('Datei löschen (Szenario 22-25)', () => {
    it('Given Datei, When Löschen geklickt, Then ConfirmDialog geöffnet', async () => {
      setupMocks();
      render(<PortalDocuments />);

      await waitFor(() => {
        expect(screen.getByText('Report.pdf')).toBeInTheDocument();
      });

      // Get all delete buttons, file delete buttons come after folder delete buttons
      const deleteButtons = screen.getAllByTitle('Löschen');
      // Folder delete buttons: 0, 1 (Projekte, Archiv)
      // File delete buttons: 2, 3 (Report.pdf, Bild.png)
      fireEvent.click(deleteButtons[2]);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
        expect(screen.getByText('Datei löschen')).toBeInTheDocument();
        // Check dialog message contains file name
        expect(screen.getByText(/wirklich löschen/)).toBeInTheDocument();
      });
    });

    it('Given Datei-Lösch-Dialog offen, When bestätigt, Then DELETE API aufgerufen', async () => {
      setupMocks();
      mockAuthFetch.mockImplementation((url, options) => {
        if (options?.method === 'DELETE' && url.includes('/api/documents/')) {
          return Promise.resolve({ ok: true });
        }
        if (url === '/api/folders') {
          return Promise.resolve({ ok: true, json: () => Promise.resolve(mockFolders) });
        }
        if (url === '/api/documents') {
          return Promise.resolve({ ok: true, json: () => Promise.resolve(mockDocuments) });
        }
        return Promise.resolve({ ok: true, json: () => Promise.resolve([]) });
      });

      render(<PortalDocuments />);

      await waitFor(() => {
        expect(screen.getByText('Report.pdf')).toBeInTheDocument();
      });

      const deleteButtons = screen.getAllByTitle('Löschen');
      fireEvent.click(deleteButtons[2]); // First file delete button

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      const dialogConfirmBtn = document.querySelector('.confirm-dialog-btn-danger');
      fireEvent.click(dialogConfirmBtn);

      await waitFor(() => {
        expect(mockAuthFetch).toHaveBeenCalledWith(
          '/api/documents/doc-1',
          expect.objectContaining({ method: 'DELETE' })
        );
      });
    });

    it('Given Datei-Lösch-Dialog offen, When abgebrochen, Then keine API-Anfrage', async () => {
      setupMocks();
      render(<PortalDocuments />);

      await waitFor(() => {
        expect(screen.getByText('Report.pdf')).toBeInTheDocument();
      });

      const deleteButtons = screen.getAllByTitle('Löschen');
      fireEvent.click(deleteButtons[2]);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      const dialogCancelBtn = document.querySelector('.confirm-dialog-btn-cancel');
      fireEvent.click(dialogCancelBtn);

      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });

      // Datei sollte noch da sein
      expect(screen.getByText('Report.pdf')).toBeInTheDocument();
    });

    it('Given Datei gelöscht, When erfolgreich, Then Datei aus Liste entfernt', async () => {
      setupMocks();
      mockAuthFetch.mockImplementation((url, options) => {
        if (options?.method === 'DELETE' && url.includes('/api/documents/')) {
          return Promise.resolve({ ok: true });
        }
        if (url === '/api/folders') {
          return Promise.resolve({ ok: true, json: () => Promise.resolve(mockFolders) });
        }
        if (url === '/api/documents') {
          return Promise.resolve({ ok: true, json: () => Promise.resolve(mockDocuments) });
        }
        return Promise.resolve({ ok: true, json: () => Promise.resolve([]) });
      });

      render(<PortalDocuments />);

      await waitFor(() => {
        expect(screen.getByText('Report.pdf')).toBeInTheDocument();
      });

      const deleteButtons = screen.getAllByTitle('Löschen');
      fireEvent.click(deleteButtons[2]);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      const dialogConfirmBtn = document.querySelector('.confirm-dialog-btn-danger');
      fireEvent.click(dialogConfirmBtn);

      await waitFor(() => {
        expect(screen.queryByText('Report.pdf')).not.toBeInTheDocument();
      });
    });

    it('Given Datei löschen fehlgeschlagen, When 403, Then Fehlermeldung angezeigt', async () => {
      setupMocks();
      mockAuthFetch.mockImplementation((url, options) => {
        if (options?.method === 'DELETE' && url.includes('/api/documents/')) {
          return Promise.resolve({ ok: false, status: 403 });
        }
        if (url === '/api/folders') {
          return Promise.resolve({ ok: true, json: () => Promise.resolve(mockFolders) });
        }
        if (url === '/api/documents') {
          return Promise.resolve({ ok: true, json: () => Promise.resolve(mockDocuments) });
        }
        return Promise.resolve({ ok: true, json: () => Promise.resolve([]) });
      });

      render(<PortalDocuments />);

      await waitFor(() => {
        expect(screen.getByText('Report.pdf')).toBeInTheDocument();
      });

      const deleteButtons = screen.getAllByTitle('Löschen');
      fireEvent.click(deleteButtons[2]);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      const dialogConfirmBtn = document.querySelector('.confirm-dialog-btn-danger');
      fireEvent.click(dialogConfirmBtn);

      await waitFor(() => {
        expect(screen.getByText(/Keine Berechtigung/)).toBeInTheDocument();
      });
    });
  });

  describe('Neuer Ordner erstellen', () => {
    it('Given Toolbar, When Neuer Ordner geklickt und Name eingegeben, Then API aufgerufen', async () => {
      setupMocks();
      window.prompt.mockReturnValue('Neuer Ordner');
      mockAuthFetch.mockImplementation((url, options) => {
        if (options?.method === 'POST' && url === '/api/folders') {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ id: 'new-folder', name: 'Neuer Ordner' })
          });
        }
        if (url === '/api/folders') {
          return Promise.resolve({ ok: true, json: () => Promise.resolve(mockFolders) });
        }
        return Promise.resolve({ ok: true, json: () => Promise.resolve([]) });
      });

      render(<PortalDocuments />);

      await waitFor(() => {
        expect(screen.getByText('Neuer Ordner')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText('Neuer Ordner'));

      await waitFor(() => {
        expect(mockAuthFetch).toHaveBeenCalledWith(
          '/api/folders',
          expect.objectContaining({ method: 'POST' })
        );
        expect(mockTriggerRefresh).toHaveBeenCalled();
      });
    });
  });

  describe('Sidebar-Aktualisierung', () => {
    it('Given Ordner erstellt, When erfolgreich, Then triggerRefresh aufgerufen', async () => {
      setupMocks();
      window.prompt.mockReturnValue('Test');
      mockAuthFetch.mockImplementation((url, options) => {
        if (options?.method === 'POST') {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ id: 'new', name: 'Test' })
          });
        }
        if (url === '/api/folders') {
          return Promise.resolve({ ok: true, json: () => Promise.resolve(mockFolders) });
        }
        return Promise.resolve({ ok: true, json: () => Promise.resolve([]) });
      });

      render(<PortalDocuments />);

      await waitFor(() => {
        expect(screen.getByText('Neuer Ordner')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText('Neuer Ordner'));

      await waitFor(() => {
        expect(mockTriggerRefresh).toHaveBeenCalled();
      });
    });
  });
});
