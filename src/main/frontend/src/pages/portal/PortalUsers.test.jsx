import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PortalUsers } from './PortalUsers';

/**
 * Unit Tests für PortalUsers
 *
 * WICHTIG: Diese Tests validieren, dass die korrekten API-Endpunkte aufgerufen werden.
 *
 * REST-Konvention:
 * - Korrekt: /api/users (Ressourcen-basiert)
 * - Falsch:  /api/admin/users (Rollen-Prefix in URL)
 *
 * Autorisierung erfolgt über @PreAuthorize im Backend, NICHT über URL-Prefixe!
 */

// Mock authFetch
const mockAuthFetch = vi.fn();

vi.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({
    authFetch: mockAuthFetch
  })
}));

describe('PortalUsers', () => {
  beforeEach(() => {
    mockAuthFetch.mockClear();
  });

  describe('API-Endpunkt Validierung (Regressionstest)', () => {

    it('Given die Komponente wird geladen, When fetchUsers aufgerufen wird, Then wird GET /api/users aufgerufen (NICHT /api/admin/users)', async () => {
      mockAuthFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([])
      });

      render(<PortalUsers />);

      await waitFor(() => {
        expect(mockAuthFetch).toHaveBeenCalledWith('/api/users');
      });

      // Stelle sicher, dass NICHT /api/admin/users aufgerufen wird
      expect(mockAuthFetch).not.toHaveBeenCalledWith('/api/admin/users');
    });

    it('Given ein neuer Benutzer wird erstellt, When handleCreateUser aufgerufen wird, Then wird POST /api/users aufgerufen', async () => {
      // Erst fetchUsers beim Mount
      mockAuthFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([])
      });

      render(<PortalUsers />);

      await waitFor(() => {
        expect(mockAuthFetch).toHaveBeenCalled();
      });

      // Dialog öffnen, dann Formular ausfüllen
      fireEvent.click(screen.getByRole('button', { name: /neuer benutzer/i }));

      const emailInput = screen.getByPlaceholderText('user@example.com');
      const firstNameInput = screen.getByPlaceholderText('Max');
      const lastNameInput = screen.getByPlaceholderText('Mustermann');
      const passwordInput = screen.getByPlaceholderText('Initialpasswort');
      const passwordConfirmInput = screen.getByPlaceholderText('Passwort wiederholen');

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(firstNameInput, { target: { value: 'Test' } });
      fireEvent.change(lastNameInput, { target: { value: 'User' } });
      fireEvent.change(passwordInput, { target: { value: 'Geheim123!' } });
      fireEvent.change(passwordConfirmInput, { target: { value: 'Geheim123!' } });

      // Mock für POST
      mockAuthFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          id: '123',
          email: 'test@example.com',
          firstName: 'Test',
          lastName: 'User',
          roles: ['USER']
        })
      });

      // Submit
      const submitButton = screen.getByText('Erstellen');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockAuthFetch).toHaveBeenCalledWith('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: expect.any(String)
        });
      });

      // Stelle sicher, dass NICHT /api/admin/users aufgerufen wird
      const calls = mockAuthFetch.mock.calls;
      const postCall = calls.find(call => call[1]?.method === 'POST');
      expect(postCall[0]).toBe('/api/users');
      expect(postCall[0]).not.toBe('/api/admin/users');

      // Standardrolle „Benutzer" wird als roles: ["USER"] gesendet
      expect(JSON.parse(postCall[1].body)).toMatchObject({
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        password: 'Geheim123!',
        roles: ['USER']
      });
    });

    it('Given eine Rolle wird gewählt, When der Benutzer angelegt wird, Then wird die gemappte Systemrolle im roles-Array gesendet', async () => {
      mockAuthFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([])
      });

      render(<PortalUsers />);

      await waitFor(() => {
        expect(mockAuthFetch).toHaveBeenCalled();
      });

      fireEvent.click(screen.getByRole('button', { name: /neuer benutzer/i }));

      fireEvent.change(screen.getByPlaceholderText('user@example.com'), { target: { value: 'admin@example.com' } });
      fireEvent.change(screen.getByPlaceholderText('Max'), { target: { value: 'Ada' } });
      fireEvent.change(screen.getByPlaceholderText('Mustermann'), { target: { value: 'Admin' } });
      fireEvent.change(screen.getByPlaceholderText('Initialpasswort'), { target: { value: 'Geheim123!' } });
      fireEvent.change(screen.getByPlaceholderText('Passwort wiederholen'), { target: { value: 'Geheim123!' } });
      fireEvent.change(screen.getByDisplayValue('Benutzer'), { target: { value: 'ADMIN' } });

      mockAuthFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ id: '9', email: 'admin@example.com', firstName: 'Ada', lastName: 'Admin', roles: ['ADMIN'] })
      });

      fireEvent.click(screen.getByText('Erstellen'));

      await waitFor(() => {
        const postCall = mockAuthFetch.mock.calls.find(call => call[1]?.method === 'POST');
        expect(postCall).toBeTruthy();
        expect(JSON.parse(postCall[1].body).roles).toEqual(['ADMIN']);
      });
    });

    it('Given Passwort und Bestätigung weichen ab, When Erstellen geklickt wird, Then wird KEIN POST gemacht', async () => {
      mockAuthFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([])
      });

      render(<PortalUsers />);

      await waitFor(() => {
        expect(mockAuthFetch).toHaveBeenCalledTimes(1);
      });

      fireEvent.click(screen.getByRole('button', { name: /neuer benutzer/i }));
      fireEvent.change(screen.getByPlaceholderText('user@example.com'), { target: { value: 'test@example.com' } });
      fireEvent.change(screen.getByPlaceholderText('Max'), { target: { value: 'Test' } });
      fireEvent.change(screen.getByPlaceholderText('Mustermann'), { target: { value: 'User' } });
      fireEvent.change(screen.getByPlaceholderText('Initialpasswort'), { target: { value: 'Geheim123!' } });
      fireEvent.change(screen.getByPlaceholderText('Passwort wiederholen'), { target: { value: 'Anders456!' } });

      fireEvent.click(screen.getByText('Erstellen'));
      await new Promise(resolve => setTimeout(resolve, 100));

      expect(mockAuthFetch).toHaveBeenCalledTimes(1); // Kein POST bei Mismatch
      // Hinweis erscheint sowohl als Live-Feedback als auch als Statusmeldung
      expect(screen.getAllByText('Passwörter stimmen nicht überein').length).toBeGreaterThanOrEqual(1);
    });

    it('Given ein Benutzer existiert, When eine Rolle geändert wird, Then wird PUT /api/users/{id} aufgerufen', async () => {
      const existingUser = {
        id: 'user-123',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        roles: ['USER']
      };

      mockAuthFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([existingUser])
      });

      render(<PortalUsers />);

      await waitFor(() => {
        expect(screen.getByText('Test User')).toBeInTheDocument();
      });

      // Mock für PUT und anschließenden fetchUsers
      mockAuthFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ ...existingUser, roles: ['USER', 'ADMIN'] })
      });
      mockAuthFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([{ ...existingUser, roles: ['USER', 'ADMIN'] }])
      });

      // Klicke auf ADMIN Badge
      const adminBadge = screen.getByText('ADMIN');
      fireEvent.click(adminBadge);

      await waitFor(() => {
        expect(mockAuthFetch).toHaveBeenCalledWith('/api/users/user-123', expect.objectContaining({
          method: 'PUT'
        }));
      });

      // Stelle sicher, dass NICHT /api/admin/users aufgerufen wird
      const calls = mockAuthFetch.mock.calls;
      const putCall = calls.find(call => call[1]?.method === 'PUT');
      expect(putCall[0]).toBe('/api/users/user-123');
      expect(putCall[0]).not.toContain('/api/admin/');
    });

    it('Given ein Benutzer existiert, When er gelöscht wird, Then wird DELETE /api/users/{id} aufgerufen', async () => {
      const existingUser = {
        id: 'user-456',
        email: 'delete@example.com',
        firstName: 'Delete',
        lastName: 'Me',
        roles: ['USER']
      };

      mockAuthFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([existingUser])
      });

      // Mock window.confirm
      vi.spyOn(window, 'confirm').mockReturnValue(true);

      render(<PortalUsers />);

      await waitFor(() => {
        expect(screen.getByText('Delete Me')).toBeInTheDocument();
      });

      // Mock für DELETE
      mockAuthFetch.mockResolvedValueOnce({
        ok: true
      });

      // Klicke auf Löschen
      const deleteButton = screen.getByText('Löschen');
      fireEvent.click(deleteButton);

      await waitFor(() => {
        expect(mockAuthFetch).toHaveBeenCalledWith('/api/users/user-456', { method: 'DELETE' });
      });

      // Stelle sicher, dass NICHT /api/admin/users aufgerufen wird
      const calls = mockAuthFetch.mock.calls;
      const deleteCall = calls.find(call => call[1]?.method === 'DELETE');
      expect(deleteCall[0]).toBe('/api/users/user-456');
      expect(deleteCall[0]).not.toContain('/api/admin/');
    });
  });

  describe('Szenario 3: Validierung bei leeren Feldern', () => {
    it('Given Pflichtfelder sind leer, When Benutzer erstellen geklickt wird, Then wird KEIN API-Aufruf gemacht', async () => {
      mockAuthFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([])
      });

      render(<PortalUsers />);

      await waitFor(() => {
        expect(mockAuthFetch).toHaveBeenCalledTimes(1); // Nur fetchUsers
      });

      // Dialog öffnen und ohne Daten absenden
      fireEvent.click(screen.getByRole('button', { name: /neuer benutzer/i }));
      const submitButton = screen.getByText('Erstellen');
      fireEvent.click(submitButton);

      // Warte kurz und prüfe, dass kein weiterer Aufruf erfolgt
      await new Promise(resolve => setTimeout(resolve, 100));

      expect(mockAuthFetch).toHaveBeenCalledTimes(1); // Immer noch nur fetchUsers
      expect(screen.getByText('Bitte alle Felder ausfüllen')).toBeInTheDocument();
    });

    it('Given alle Felder außer Passwort sind gefüllt, When Benutzer erstellen geklickt wird, Then wird KEIN POST gemacht', async () => {
      mockAuthFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([])
      });

      render(<PortalUsers />);

      await waitFor(() => {
        expect(mockAuthFetch).toHaveBeenCalledTimes(1); // Nur fetchUsers
      });

      fireEvent.click(screen.getByRole('button', { name: /neuer benutzer/i }));
      fireEvent.change(screen.getByPlaceholderText('user@example.com'), { target: { value: 'test@example.com' } });
      fireEvent.change(screen.getByPlaceholderText('Max'), { target: { value: 'Test' } });
      fireEvent.change(screen.getByPlaceholderText('Mustermann'), { target: { value: 'User' } });
      // Passwort bewusst leer lassen

      fireEvent.click(screen.getByText('Erstellen'));
      await new Promise(resolve => setTimeout(resolve, 100));

      expect(mockAuthFetch).toHaveBeenCalledTimes(1); // Kein POST ohne Passwort
      expect(screen.getByText('Bitte alle Felder ausfüllen')).toBeInTheDocument();
    });
  });

  describe('Erstellungs-Dialog', () => {
    it('Given die Seite ist geladen, When kein Button geklickt wurde, Then ist das Erstellungs-Formular nicht sichtbar', async () => {
      mockAuthFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([])
      });

      render(<PortalUsers />);

      await waitFor(() => {
        expect(mockAuthFetch).toHaveBeenCalledTimes(1);
      });

      expect(screen.queryByPlaceholderText('user@example.com')).not.toBeInTheDocument();
    });

    it('Given der Dialog ist offen, When Abbrechen geklickt wird, Then wird das Formular wieder ausgeblendet', async () => {
      mockAuthFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([])
      });

      render(<PortalUsers />);

      await waitFor(() => {
        expect(mockAuthFetch).toHaveBeenCalledTimes(1);
      });

      fireEvent.click(screen.getByRole('button', { name: /neuer benutzer/i }));
      expect(screen.getByPlaceholderText('user@example.com')).toBeInTheDocument();

      fireEvent.click(screen.getByText('Abbrechen'));
      expect(screen.queryByPlaceholderText('user@example.com')).not.toBeInTheDocument();
    });
  });

  describe('Benutzer-Anzeige', () => {
    it('Given Benutzer existieren, When die Seite geladen wird, Then werden alle Benutzer angezeigt', async () => {
      const users = [
        { id: '1', email: 'admin@test.de', firstName: 'Max', lastName: 'Admin', roles: ['ADMIN'] },
        { id: '2', email: 'user@test.de', firstName: 'Hans', lastName: 'User', roles: ['USER'] }
      ];

      mockAuthFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(users)
      });

      render(<PortalUsers />);

      await waitFor(() => {
        expect(screen.getByText('Max Admin')).toBeInTheDocument();
        expect(screen.getByText('Hans User')).toBeInTheDocument();
      });

      expect(screen.getByText('2 Benutzer')).toBeInTheDocument();
    });
  });
});
