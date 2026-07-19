import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PortalUsers } from './PortalUsers';

/**
 * Unit Tests für PortalUsers (Liste)
 *
 * Anlegen/Bearbeiten erfolgen jetzt auf eigenen Routen — hier wird nur die
 * Liste getestet: korrekte API-Endpunkte, Navigation, Löschen, Rollen-Toggle.
 */

const mockAuthFetch = vi.fn();
const mockNavigate = vi.fn();

vi.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({ authFetch: mockAuthFetch }),
}));

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

describe('PortalUsers (Liste)', () => {
  beforeEach(() => {
    mockAuthFetch.mockReset();
    mockNavigate.mockReset();
  });

  it('Given die Komponente wird geladen, When fetchUsers läuft, Then wird GET /api/users aufgerufen (NICHT /api/admin/users)', async () => {
    mockAuthFetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve([]) });
    render(<PortalUsers />);
    await waitFor(() => expect(mockAuthFetch).toHaveBeenCalledWith('/api/users'));
    expect(mockAuthFetch).not.toHaveBeenCalledWith('/api/admin/users');
  });

  it('Given die Liste, When »Neuer Benutzer« geklickt wird, Then wird zu /admin/portal/users/new navigiert', async () => {
    mockAuthFetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve([]) });
    render(<PortalUsers />);
    await waitFor(() => expect(mockAuthFetch).toHaveBeenCalled());

    fireEvent.click(screen.getByRole('button', { name: /neuer benutzer/i }));
    expect(mockNavigate).toHaveBeenCalledWith('/admin/portal/users/new');
  });

  it('Given ein Benutzer, When »Bearbeiten« geklickt wird, Then wird zu /admin/portal/users/{id} navigiert', async () => {
    const user = { id: 'u1', email: 'a@b.de', firstName: 'Max', lastName: 'Admin', roles: ['ADMIN'] };
    mockAuthFetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve([user]) });
    render(<PortalUsers />);
    await waitFor(() => expect(screen.getByText('Max Admin')).toBeInTheDocument());

    fireEvent.click(screen.getByText('Bearbeiten'));
    expect(mockNavigate).toHaveBeenCalledWith('/admin/portal/users/u1');
  });

  it('Given ein Benutzer, When gelöscht und bestätigt wird, Then wird DELETE /api/users/{id} aufgerufen', async () => {
    const user = { id: 'u2', email: 'del@b.de', firstName: 'Delete', lastName: 'Me', roles: ['CLIENT'] };
    mockAuthFetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve([user]) });
    render(<PortalUsers />);
    await waitFor(() => expect(screen.getByText('Delete Me')).toBeInTheDocument());

    fireEvent.click(screen.getByText('Löschen'));
    expect(screen.getByText('Benutzer löschen')).toBeInTheDocument();
    expect(mockAuthFetch).toHaveBeenCalledTimes(1); // noch kein DELETE

    mockAuthFetch.mockResolvedValueOnce({ ok: true });
    const dialog = screen.getByRole('dialog');
    fireEvent.click(within(dialog).getByText('Löschen'));

    await waitFor(() => {
      expect(mockAuthFetch).toHaveBeenCalledWith('/api/users/u2', { method: 'DELETE' });
    });
  });

  it('Given der Löschdialog ist offen, When abgebrochen wird, Then kein DELETE', async () => {
    const user = { id: 'u3', email: 'keep@b.de', firstName: 'Keep', lastName: 'Me', roles: ['CLIENT'] };
    mockAuthFetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve([user]) });
    render(<PortalUsers />);
    await waitFor(() => expect(screen.getByText('Keep Me')).toBeInTheDocument());

    fireEvent.click(screen.getByText('Löschen'));
    fireEvent.click(screen.getByText('Abbrechen'));
    await new Promise(r => setTimeout(r, 30));
    expect(mockAuthFetch.mock.calls.find(c => c[1]?.method === 'DELETE')).toBeUndefined();
  });

  it('Given ein Benutzer, When ein Rollen-Badge geklickt wird, Then wird PUT /api/users/{id} aufgerufen', async () => {
    const user = { id: 'u4', email: 'r@b.de', firstName: 'Rolle', lastName: 'Test', roles: ['CLIENT'] };
    mockAuthFetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve([user]) });
    render(<PortalUsers />);
    await waitFor(() => expect(screen.getByText('Rolle Test')).toBeInTheDocument());

    mockAuthFetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ ...user, roles: ['CLIENT', 'ADMIN'] }) });
    mockAuthFetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve([{ ...user, roles: ['CLIENT', 'ADMIN'] }]) });

    fireEvent.click(screen.getByText('ADMIN'));
    await waitFor(() => {
      const putCall = mockAuthFetch.mock.calls.find(c => c[1]?.method === 'PUT');
      expect(putCall[0]).toBe('/api/users/u4');
    });
  });

  it('Given Benutzer existieren, When die Seite geladen wird, Then werden alle angezeigt', async () => {
    const users = [
      { id: '1', email: 'admin@test.de', firstName: 'Max', lastName: 'Admin', roles: ['ADMIN'] },
      { id: '2', email: 'user@test.de', firstName: 'Hans', lastName: 'User', roles: ['CLIENT'] },
    ];
    mockAuthFetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(users) });
    render(<PortalUsers />);
    await waitFor(() => {
      expect(screen.getByText('Max Admin')).toBeInTheDocument();
      expect(screen.getByText('Hans User')).toBeInTheDocument();
    });
    expect(screen.getByText('2 Benutzer')).toBeInTheDocument();
  });
});
