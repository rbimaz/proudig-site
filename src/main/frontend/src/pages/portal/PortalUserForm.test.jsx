import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PortalUserForm } from './PortalUserForm';

const mockAuthFetch = vi.fn();
const mockNavigate = vi.fn();
let currentParams = {};

vi.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({ authFetch: mockAuthFetch, user: { email: 'me@admin.de', roles: ['ADMIN'] } }),
}));

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  useParams: () => currentParams,
}));

const postOk = () => mockAuthFetch.mockResolvedValueOnce({
  ok: true, json: () => Promise.resolve({ id: 'x', roles: ['CLIENT'] })
});

describe('PortalUserForm', () => {
  beforeEach(() => {
    mockAuthFetch.mockReset();
    mockNavigate.mockReset();
    currentParams = {};
  });

  describe('Anlegen (users/new)', () => {
    const fillNew = () => {
      fireEvent.change(screen.getByPlaceholderText('user@example.com'), { target: { value: 'neu@x.de' } });
      fireEvent.change(screen.getByPlaceholderText('Max'), { target: { value: 'Neu' } });
      fireEvent.change(screen.getByPlaceholderText('Mustermann'), { target: { value: 'User' } });
      fireEvent.change(screen.getByPlaceholderText('Initialpasswort'), { target: { value: 'Geheim123!' } });
      fireEvent.change(screen.getByPlaceholderText('Passwort wiederholen'), { target: { value: 'Geheim123!' } });
    };

    it('Given alle Felder, When Erstellen, Then POST /api/users mit roles:[CLIENT] und Navigation zur Liste', async () => {
      render(<PortalUserForm />);
      fillNew();
      postOk();
      fireEvent.click(screen.getByText('Erstellen'));

      await waitFor(() => {
        const post = mockAuthFetch.mock.calls.find(c => c[1]?.method === 'POST');
        expect(post[0]).toBe('/api/users');
        const body = JSON.parse(post[1].body);
        expect(body.roles).toEqual(['CLIENT']);
        expect(body.forcePasswordChange).toBe(false);
      });
      expect(mockNavigate).toHaveBeenCalledWith('/admin/portal/users');
    });

    it('Given die Erst-Login-Checkbox aktiviert, When Erstellen, Then forcePasswordChange:true', async () => {
      render(<PortalUserForm />);
      fillNew();
      fireEvent.click(screen.getByRole('checkbox'));
      postOk();
      fireEvent.click(screen.getByText('Erstellen'));

      await waitFor(() => {
        const post = mockAuthFetch.mock.calls.find(c => c[1]?.method === 'POST');
        expect(JSON.parse(post[1].body).forcePasswordChange).toBe(true);
      });
    });

    it('Given Passwörter weichen ab, When Erstellen, Then kein POST', async () => {
      render(<PortalUserForm />);
      fillNew();
      fireEvent.change(screen.getByPlaceholderText('Passwort wiederholen'), { target: { value: 'Anders9!' } });
      fireEvent.click(screen.getByText('Erstellen'));
      await new Promise(r => setTimeout(r, 30));
      expect(mockAuthFetch.mock.calls.find(c => c[1]?.method === 'POST')).toBeUndefined();
    });

    it('Given Pflichtfelder leer, When Erstellen, Then kein POST', async () => {
      render(<PortalUserForm />);
      fireEvent.click(screen.getByText('Erstellen'));
      await new Promise(r => setTimeout(r, 30));
      expect(mockAuthFetch).not.toHaveBeenCalled();
      expect(screen.getByText('Bitte alle Felder ausfüllen')).toBeInTheDocument();
    });
  });

  describe('Bearbeiten (users/:id)', () => {
    const editUser = { id: 'u1', email: 'ada@x.de', firstName: 'Ada', lastName: 'Admin', roles: ['CLIENT', 'ADMIN'] };

    const mountEdit = (list) => {
      currentParams = { id: 'u1' };
      mockAuthFetch
        .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(editUser) })   // GET /api/users/u1
        .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(list) });       // GET /api/users
    };

    it('Given ein Benutzer, When geladen, Then Vorbelegung; nach Speichern PUT mit Rollenmenge und Navigation', async () => {
      mountEdit([editUser, { id: 'z', email: 'other@x.de', roles: ['ADMIN'] }]);
      render(<PortalUserForm />);
      await waitFor(() => expect(screen.getByDisplayValue('Ada')).toBeInTheDocument());

      expect(screen.getByLabelText('Benutzer')).toBeChecked();
      expect(screen.getByLabelText('Administrator')).toBeChecked();

      fireEvent.change(screen.getByDisplayValue('Ada'), { target: { value: 'Neu' } });
      mockAuthFetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(editUser) });
      fireEvent.click(screen.getByText('Speichern'));

      await waitFor(() => {
        const put = mockAuthFetch.mock.calls.find(c => c[1]?.method === 'PUT');
        expect(put[0]).toBe('/api/users/u1');
        const body = JSON.parse(put[1].body);
        expect(body.firstName).toBe('Neu');
        expect([...body.roles].sort()).toEqual(['ADMIN', 'CLIENT']);
        expect(body.password).toBeUndefined();
      });
      expect(mockNavigate).toHaveBeenCalledWith('/admin/portal/users');
    });

    it('Given nur ein Administrator, When Dialog geladen, Then ADMIN-Checkbox deaktiviert', async () => {
      mountEdit([editUser]); // adminCount = 1
      render(<PortalUserForm />);
      await waitFor(() => expect(screen.getByDisplayValue('Ada')).toBeInTheDocument());

      expect(screen.getByLabelText('Administrator')).toBeDisabled();
      expect(screen.getByText(/letzte Administratorrolle/i)).toBeInTheDocument();
    });

    it('Given alle Rollen abgewählt, When Speichern, Then kein PUT', async () => {
      const soloUser = { id: 'u2', email: 'solo@x.de', firstName: 'Solo', lastName: 'User', roles: ['CLIENT'] };
      currentParams = { id: 'u2' };
      mockAuthFetch
        .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(soloUser) })
        .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve([soloUser]) });
      render(<PortalUserForm />);
      await waitFor(() => expect(screen.getByDisplayValue('Solo')).toBeInTheDocument());

      fireEvent.click(screen.getByLabelText('Benutzer')); // einzige Rolle abwählen
      fireEvent.click(screen.getByText('Speichern'));
      await new Promise(r => setTimeout(r, 30));

      expect(mockAuthFetch.mock.calls.find(c => c[1]?.method === 'PUT')).toBeUndefined();
      expect(screen.getByText('Bitte mindestens eine Rolle wählen')).toBeInTheDocument();
    });
  });
});
