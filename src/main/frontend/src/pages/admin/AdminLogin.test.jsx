import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AdminLogin } from './AdminLogin';

const mockLogin = vi.fn();
let mockLocation = { state: null };

vi.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({ login: mockLogin }),
}));

vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
  useLocation: () => mockLocation,
}));

describe('AdminLogin – E-Mail-Vorbefüllung', () => {
  beforeEach(() => {
    mockLogin.mockReset();
    mockLocation = { state: null };
  });

  it('Given location.state.email ist gesetzt, When gerendert, Then ist das E-Mail-Feld vorbefüllt', () => {
    mockLocation = { state: { email: 'user@example.de' } };
    render(<AdminLogin />);
    expect(screen.getByLabelText('Email')).toHaveValue('user@example.de');
  });

  it('Given kein Navigations-State, When gerendert, Then ist das E-Mail-Feld leer', () => {
    render(<AdminLogin />);
    expect(screen.getByLabelText('Email')).toHaveValue('');
  });

  it('Given Passwortfeld, When Toggle geklickt, Then wechselt die Sichtbarkeit', () => {
    render(<AdminLogin />);
    const pw = screen.getByLabelText('Passwort');
    expect(pw).toHaveAttribute('type', 'password');

    fireEvent.click(screen.getByRole('button', { name: 'Passwort anzeigen' }));
    expect(pw).toHaveAttribute('type', 'text');

    fireEvent.click(screen.getByRole('button', { name: 'Passwort verbergen' }));
    expect(pw).toHaveAttribute('type', 'password');
  });
});
