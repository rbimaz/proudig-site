import { render, screen } from '@testing-library/react';
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
});
