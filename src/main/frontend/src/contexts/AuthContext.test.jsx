import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { AuthProvider, useAuth } from './AuthContext';

/**
 * Unit Tests für AuthContext
 *
 * Diese Tests stellen sicher, dass die Rollen-Prüfung korrekt funktioniert.
 * Der Fehler war: Backend sendete "ROLE_ADMIN", Frontend erwartete "ADMIN".
 */
describe('AuthContext', () => {
  let originalFetch;

  beforeEach(() => {
    originalFetch = global.fetch;
    localStorage.clear();
  });

  afterEach(() => {
    global.fetch = originalFetch;
    localStorage.clear();
  });

  const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;

  describe('isAdmin()', () => {
    describe('Szenario: Backend sendet Rollen OHNE ROLE_-Prefix (korrektes Verhalten)', () => {
      it('Given Backend sendet roles=["ADMIN"], When isAdmin() aufgerufen wird, Then gibt true zurück', async () => {
        // Given: Mock successful login response WITHOUT ROLE_ prefix
        global.fetch = vi.fn().mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({
            token: 'jwt-token',
            refreshToken: 'refresh-token',
            email: 'admin@proudig.de',
            firstName: 'Admin',
            lastName: 'ProuDig',
            roles: ['ADMIN'], // Korrekt: OHNE ROLE_-Prefix
            forcePasswordChange: false
          })
        });

        const { result } = renderHook(() => useAuth(), { wrapper });

        // When
        await act(async () => {
          await result.current.login('admin@proudig.de', 'password');
        });

        // Then
        expect(result.current.isAdmin()).toBe(true);
        expect(result.current.hasRole('ADMIN')).toBe(true);
      });

      it('Given Backend sendet roles=["CONSULTANT"], When isAdmin() aufgerufen wird, Then gibt true zurück', async () => {
        // Given
        global.fetch = vi.fn().mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({
            token: 'jwt-token',
            refreshToken: 'refresh-token',
            email: 'consultant@proudig.de',
            firstName: 'Maria',
            lastName: 'Berater',
            roles: ['CONSULTANT'],
            forcePasswordChange: false
          })
        });

        const { result } = renderHook(() => useAuth(), { wrapper });

        // When
        await act(async () => {
          await result.current.login('consultant@proudig.de', 'password');
        });

        // Then
        expect(result.current.isAdmin()).toBe(true);
        expect(result.current.hasRole('CONSULTANT')).toBe(true);
      });

      it('Given Backend sendet roles=["CLIENT"], When isAdmin() aufgerufen wird, Then gibt false zurück', async () => {
        // Given
        global.fetch = vi.fn().mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({
            token: 'jwt-token',
            refreshToken: 'refresh-token',
            email: 'client@firma.de',
            firstName: 'Hans',
            lastName: 'Kunde',
            roles: ['CLIENT'],
            forcePasswordChange: false
          })
        });

        const { result } = renderHook(() => useAuth(), { wrapper });

        // When
        await act(async () => {
          await result.current.login('client@firma.de', 'password');
        });

        // Then
        expect(result.current.isAdmin()).toBe(false);
        expect(result.current.hasRole('CLIENT')).toBe(true);
      });
    });

    describe('Szenario: Regressionstest - Backend darf NICHT ROLE_-Prefix senden', () => {
      it('Given Backend sendet roles=["ROLE_ADMIN"] (FEHLER), When isAdmin() aufgerufen wird, Then gibt false zurück (Test dokumentiert den Bug)', async () => {
        // Given: Fehlerhaftes Backend-Verhalten mit ROLE_-Prefix
        global.fetch = vi.fn().mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({
            token: 'jwt-token',
            refreshToken: 'refresh-token',
            email: 'admin@proudig.de',
            firstName: 'Admin',
            lastName: 'ProuDig',
            roles: ['ROLE_ADMIN'], // FEHLER: Mit ROLE_-Prefix
            forcePasswordChange: false
          })
        });

        const { result } = renderHook(() => useAuth(), { wrapper });

        // When
        await act(async () => {
          await result.current.login('admin@proudig.de', 'password');
        });

        // Then: isAdmin() sollte false sein, weil hasRole('ADMIN') nicht matcht
        // Dies dokumentiert den Bug - wenn Backend ROLE_ADMIN sendet, funktioniert isAdmin() NICHT
        expect(result.current.isAdmin()).toBe(false);
        expect(result.current.hasRole('ADMIN')).toBe(false);
        expect(result.current.hasRole('ROLE_ADMIN')).toBe(true);
      });
    });

    describe('Szenario: Benutzer mit mehreren Rollen', () => {
      it('Given Backend sendet roles=["ADMIN", "CONSULTANT"], When hasRole() aufgerufen wird, Then werden beide Rollen erkannt', async () => {
        // Given
        global.fetch = vi.fn().mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({
            token: 'jwt-token',
            refreshToken: 'refresh-token',
            email: 'superadmin@proudig.de',
            firstName: 'Super',
            lastName: 'Admin',
            roles: ['ADMIN', 'CONSULTANT'],
            forcePasswordChange: false
          })
        });

        const { result } = renderHook(() => useAuth(), { wrapper });

        // When
        await act(async () => {
          await result.current.login('superadmin@proudig.de', 'password');
        });

        // Then
        expect(result.current.isAdmin()).toBe(true);
        expect(result.current.hasRole('ADMIN')).toBe(true);
        expect(result.current.hasRole('CONSULTANT')).toBe(true);
        expect(result.current.hasRole('CLIENT')).toBe(false);
      });
    });
  });

  describe('hasRole()', () => {
    it('Given Benutzer ohne Rollen, When hasRole("ADMIN") aufgerufen wird, Then gibt false zurück', async () => {
      // Given: User mit leerem roles Array
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          token: 'jwt-token',
          refreshToken: 'refresh-token',
          email: 'test@test.de',
          firstName: 'Test',
          lastName: 'User',
          roles: [],
          forcePasswordChange: false
        })
      });

      const { result } = renderHook(() => useAuth(), { wrapper });

      await act(async () => {
        await result.current.login('test@test.de', 'password');
      });

      // Then
      expect(result.current.hasRole('ADMIN')).toBe(false);
      expect(result.current.hasRole('CONSULTANT')).toBe(false);
      expect(result.current.hasRole('CLIENT')).toBe(false);
    });

    it('Given Benutzer nicht eingeloggt, When hasRole() aufgerufen wird, Then gibt false zurück', () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      expect(result.current.hasRole('ADMIN')).toBeFalsy();
      expect(result.current.isAdmin()).toBeFalsy();
    });
  });
});
