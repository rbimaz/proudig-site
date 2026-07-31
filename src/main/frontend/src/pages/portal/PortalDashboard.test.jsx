import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import { PortalDashboard } from './PortalDashboard';

const state = vi.hoisted(() => ({ roles: [] }));

vi.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({
    hasRole: (r) => state.roles.includes(r),
    isAdmin: () => state.roles.includes('ADMIN') || state.roles.includes('CONSULTANT'),
    authFetch: vi.fn().mockResolvedValue({ ok: true, json: async () => [] }),
  }),
}));

function renderAt(roles) {
  state.roles = roles;
  return render(
    <MemoryRouter initialEntries={['/admin/portal']}>
      <Routes>
        <Route path="/admin/portal" element={<PortalDashboard />} />
        <Route path="/admin/portal/documents" element={<div>DOCS-PAGE</div>} />
      </Routes>
    </MemoryRouter>
  );
}

describe('PortalDashboard', () => {
  it('Given Consultant, When /admin/portal, Then Redirect auf Dokumente', () => {
    renderAt(['CONSULTANT']);
    expect(screen.getByText('DOCS-PAGE')).toBeInTheDocument();
  });

  it('Given Admin, When /admin/portal, Then kein Redirect (Dashboard)', () => {
    renderAt(['ADMIN']);
    expect(screen.queryByText('DOCS-PAGE')).not.toBeInTheDocument();
  });
});
