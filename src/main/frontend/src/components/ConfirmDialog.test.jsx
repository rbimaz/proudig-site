import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ConfirmDialog } from './ConfirmDialog';

/**
 * Unit Tests für ConfirmDialog
 *
 * Testet das Modal-Bestätigungsdialog-System:
 * - Anzeige mit Titel, Nachricht, Buttons
 * - ESC schließt Dialog
 * - Backdrop-Klick schließt Dialog
 * - Confirm/Cancel Handler
 * - Danger-Variante
 */
describe('ConfirmDialog', () => {
  const defaultProps = {
    open: true,
    title: 'Test Titel',
    message: 'Test Nachricht',
    onConfirm: vi.fn(),
    onCancel: vi.fn(),
  };

  describe('Szenario 16: ConfirmDialog wird angezeigt', () => {
    it('Given Dialog ist open, When angezeigt, Then zeigt Titel und Nachricht', () => {
      render(<ConfirmDialog {...defaultProps} />);

      expect(screen.getByText('Test Titel')).toBeInTheDocument();
      expect(screen.getByText('Test Nachricht')).toBeInTheDocument();
    });

    it('Given Dialog ist open, When angezeigt, Then zeigt Abbrechen und Löschen Buttons', () => {
      render(<ConfirmDialog {...defaultProps} />);

      expect(screen.getByRole('button', { name: 'Abbrechen' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Löschen' })).toBeInTheDocument();
    });

    it('Given Dialog ist open, When angezeigt, Then hat role=dialog und aria-modal', () => {
      render(<ConfirmDialog {...defaultProps} />);

      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveAttribute('aria-modal', 'true');
    });

    it('Given Dialog ist closed, When gerendert, Then wird nichts angezeigt', () => {
      render(<ConfirmDialog {...defaultProps} open={false} />);

      expect(screen.queryByText('Test Titel')).not.toBeInTheDocument();
    });

    it('Given custom Button-Texte, When angezeigt, Then zeigt custom Texte', () => {
      render(
        <ConfirmDialog
          {...defaultProps}
          confirmText="Bestätigen"
          cancelText="Zurück"
        />
      );

      expect(screen.getByRole('button', { name: 'Bestätigen' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Zurück' })).toBeInTheDocument();
    });
  });

  describe('Szenario 17: ConfirmDialog Danger-Variante', () => {
    it('Given danger=true, When angezeigt, Then zeigt Warn-Icon', () => {
      render(<ConfirmDialog {...defaultProps} danger />);

      const icon = document.querySelector('.confirm-dialog-icon-danger');
      expect(icon).toBeInTheDocument();
    });

    it('Given danger=false, When angezeigt, Then zeigt kein Warn-Icon', () => {
      render(<ConfirmDialog {...defaultProps} danger={false} />);

      const icon = document.querySelector('.confirm-dialog-icon-danger');
      expect(icon).not.toBeInTheDocument();
    });

    it('Given danger=true, When angezeigt, Then hat Button danger-Klasse', () => {
      render(<ConfirmDialog {...defaultProps} danger />);

      const confirmBtn = screen.getByRole('button', { name: 'Löschen' });
      expect(confirmBtn).toHaveClass('confirm-dialog-btn-danger');
    });
  });

  describe('Szenario 18: ConfirmDialog schließen mit ESC', () => {
    it('Given Dialog ist open, When ESC gedrückt, Then onCancel aufgerufen', () => {
      const onCancel = vi.fn();
      render(<ConfirmDialog {...defaultProps} onCancel={onCancel} />);

      fireEvent.keyDown(document, { key: 'Escape' });

      expect(onCancel).toHaveBeenCalledTimes(1);
    });
  });

  describe('Szenario 19: ConfirmDialog schließen mit Backdrop-Klick', () => {
    it('Given Dialog ist open, When auf Backdrop geklickt, Then onCancel aufgerufen', () => {
      const onCancel = vi.fn();
      render(<ConfirmDialog {...defaultProps} onCancel={onCancel} />);

      const backdrop = document.querySelector('.confirm-dialog-backdrop');
      fireEvent.click(backdrop);

      expect(onCancel).toHaveBeenCalledTimes(1);
    });

    it('Given Dialog ist open, When auf Dialog geklickt, Then onCancel NICHT aufgerufen', () => {
      const onCancel = vi.fn();
      render(<ConfirmDialog {...defaultProps} onCancel={onCancel} />);

      const dialog = document.querySelector('.confirm-dialog');
      fireEvent.click(dialog);

      expect(onCancel).not.toHaveBeenCalled();
    });
  });

  describe('Szenario 20: ConfirmDialog Bestätigung', () => {
    it('Given Dialog ist open, When Löschen geklickt, Then onConfirm aufgerufen', () => {
      const onConfirm = vi.fn();
      render(<ConfirmDialog {...defaultProps} onConfirm={onConfirm} />);

      fireEvent.click(screen.getByRole('button', { name: 'Löschen' }));

      expect(onConfirm).toHaveBeenCalledTimes(1);
    });
  });

  describe('Szenario 21: ConfirmDialog Abbruch', () => {
    it('Given Dialog ist open, When Abbrechen geklickt, Then onCancel aufgerufen', () => {
      const onCancel = vi.fn();
      render(<ConfirmDialog {...defaultProps} onCancel={onCancel} />);

      fireEvent.click(screen.getByRole('button', { name: 'Abbrechen' }));

      expect(onCancel).toHaveBeenCalledTimes(1);
    });
  });

  describe('Mehrzeilige Nachricht', () => {
    it('Given mehrzeilige Nachricht, When angezeigt, Then jede Zeile in eigenem p', () => {
      render(
        <ConfirmDialog
          {...defaultProps}
          message={`Zeile 1
Zeile 2
Zeile 3`}
        />
      );

      expect(screen.getByText('Zeile 1')).toBeInTheDocument();
      expect(screen.getByText('Zeile 2')).toBeInTheDocument();
      expect(screen.getByText('Zeile 3')).toBeInTheDocument();
    });
  });
});
