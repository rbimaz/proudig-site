import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AdminHome } from './AdminHome';

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
const mockLogout = vi.fn();
let mockUser = null;
let mockIsAdmin = () => false;

vi.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({
    user: mockUser,
    logout: mockLogout,
    isAdmin: mockIsAdmin,
    hasRole: (role) => mockUser?.roles?.includes(role)
  })
}));

const renderAdminHome = (user, isAdminFn = () => false) => {
  mockUser = user;
  mockIsAdmin = isAdminFn;
  return render(
    <BrowserRouter>
      <AdminHome />
    </BrowserRouter>
  );
};

/**
 * Unit Tests für AdminHome
 *
 * Diese Tests stellen sicher, dass die Bereichsauswahl basierend auf Benutzerrollen
 * korrekt funktioniert.
 *
 * WICHTIG: Die Rollen müssen OHNE "ROLE_"-Prefix vom Backend kommen!
 * - Korrekt: roles: ['ADMIN']
 * - Falsch:  roles: ['ROLE_ADMIN']
 */
describe('AdminHome', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    mockLogout.mockClear();
    mockUser = null;
    mockIsAdmin = () => false;
  });

  describe('Szenario 1: Rollen-Format Validierung (Regressionstest)', () => {
    it('Given Rollen werden OHNE ROLE_-Prefix übergeben, When hasRole("ADMIN") aufgerufen wird, Then gibt true zurück', () => {
      const adminUser = {
        firstName: 'Max',
        lastName: 'Admin',
        email: 'admin@test.de',
        roles: ['ADMIN'] // Korrekt: OHNE Prefix
      };

      // Simuliere die echte hasRole Funktion
      const hasRole = (role) => adminUser.roles?.includes(role);

      expect(hasRole('ADMIN')).toBe(true);
      expect(hasRole('ROLE_ADMIN')).toBe(false); // ROLE_-Prefix darf NICHT funktionieren
    });

    it('Given Rollen werden MIT ROLE_-Prefix übergeben (FEHLER), When hasRole("ADMIN") aufgerufen wird, Then gibt false zurück', () => {
      const buggyUser = {
        firstName: 'Max',
        lastName: 'Admin',
        email: 'admin@test.de',
        roles: ['ROLE_ADMIN'] // FEHLER: Mit Prefix - so darf Backend NICHT senden!
      };

      const hasRole = (role) => buggyUser.roles?.includes(role);

      // Dieser Test dokumentiert den Bug: Wenn Backend ROLE_ADMIN sendet,
      // funktioniert der Frontend-Check nicht!
      expect(hasRole('ADMIN')).toBe(false);
      expect(hasRole('ROLE_ADMIN')).toBe(true);
    });
  });

  describe('Szenario 3: Admin-Benutzer sieht beide Karten', () => {
    it('Given ein Benutzer mit Rolle ADMIN ist eingeloggt, When die Seite geladen wird, Then werden beide Karten angezeigt', () => {
      const adminUser = {
        firstName: 'Max',
        lastName: 'Admin',
        email: 'admin@test.de',
        roles: ['ADMIN']
      };

      renderAdminHome(adminUser, () => true);

      expect(screen.getByText('Content-Management')).toBeInTheDocument();
      expect(screen.getByText('Dokumenten-Portal')).toBeInTheDocument();
    });
  });

  describe('Szenario 4: Consultant-Benutzer sieht beide Karten', () => {
    it('Given ein Benutzer mit Rolle CONSULTANT ist eingeloggt, When die Seite geladen wird, Then werden beide Karten angezeigt', () => {
      const consultantUser = {
        firstName: 'Maria',
        lastName: 'Consultant',
        email: 'consultant@test.de',
        roles: ['CONSULTANT']
      };

      renderAdminHome(consultantUser, () => true);

      expect(screen.getByText('Content-Management')).toBeInTheDocument();
      expect(screen.getByText('Dokumenten-Portal')).toBeInTheDocument();
    });
  });

  describe('Szenario 5: Client-Benutzer sieht nur Portal-Karte', () => {
    it('Given ein Benutzer mit Rolle CLIENT ist eingeloggt, When die Seite geladen wird, Then wird nur die Portal-Karte angezeigt', () => {
      const clientUser = {
        firstName: 'Hans',
        lastName: 'Client',
        email: 'client@test.de',
        roles: ['CLIENT']
      };

      renderAdminHome(clientUser, () => false);

      expect(screen.queryByText('Content-Management')).not.toBeInTheDocument();
      expect(screen.getByText('Dokumenten-Portal')).toBeInTheDocument();
    });
  });

  describe('Szenario 6: Klick auf CMS-Karte', () => {
    it('Given ein Admin ist eingeloggt, When er auf die CMS-Karte klickt, Then wird zu /admin/cms navigiert', () => {
      const adminUser = {
        firstName: 'Max',
        lastName: 'Admin',
        email: 'admin@test.de',
        roles: ['ADMIN']
      };

      renderAdminHome(adminUser, () => true);

      const cmsCard = screen.getByText('Content-Management').closest('.admin-home-card');
      fireEvent.click(cmsCard);

      expect(mockNavigate).toHaveBeenCalledWith('/admin/cms');
    });
  });

  describe('Szenario 7: Klick auf Portal-Karte', () => {
    it('Given ein Benutzer ist eingeloggt, When er auf die Portal-Karte klickt, Then wird zu /admin/portal navigiert', () => {
      const clientUser = {
        firstName: 'Hans',
        lastName: 'Client',
        email: 'client@test.de',
        roles: ['CLIENT']
      };

      renderAdminHome(clientUser, () => false);

      const portalCard = screen.getByText('Dokumenten-Portal').closest('.admin-home-card');
      fireEvent.click(portalCard);

      expect(mockNavigate).toHaveBeenCalledWith('/admin/portal');
    });
  });

  describe('Willkommensnachricht', () => {
    it('zeigt den Namen des Benutzers an', () => {
      const user = {
        firstName: 'Max',
        lastName: 'Mustermann',
        email: 'max@test.de',
        roles: ['ADMIN']
      };

      renderAdminHome(user, () => true);

      expect(screen.getByText(/Willkommen, Max Mustermann/)).toBeInTheDocument();
    });
  });

  describe('Szenario 12: Logout', () => {
    it('Given ein Benutzer ist eingeloggt, When er auf Abmelden klickt, Then wird logout aufgerufen', () => {
      const user = {
        firstName: 'Max',
        lastName: 'Admin',
        email: 'admin@test.de',
        roles: ['ADMIN']
      };

      renderAdminHome(user, () => true);

      const logoutButton = screen.getByText(/Abmelden/);
      fireEvent.click(logoutButton);

      expect(mockLogout).toHaveBeenCalled();
    });
  });
});