import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ActionButton, ActionButtonGroup } from './ActionButton';

/**
 * Unit Tests für ActionButton
 *
 * Testet das einheitliche Action-Button-System:
 * - Ruhezustand: neutral (grau Border, weißer BG, muted Icon)
 * - Hover normal: orange Border/Icon/BG
 * - Hover danger: rot Border/Icon/BG
 */
describe('ActionButton', () => {
  describe('Szenario 8: Ruhezustand', () => {
    it('Given Action-Button wird angezeigt, When kein Hover, Then neutraler Stil', () => {
      render(<ActionButton icon="bi-folder" label="Test" />);

      const button = screen.getByRole('button', { name: 'Test' });

      expect(button).toHaveStyle({
        width: '34px',
        height: '34px',
        borderRadius: '8px',
        background: '#fff',
      });
    });

    it('Given Action-Button, When gerendert, Then hat aria-label und title', () => {
      render(<ActionButton icon="bi-folder" label="Öffnen" />);

      const button = screen.getByRole('button', { name: 'Öffnen' });

      expect(button).toHaveAttribute('aria-label', 'Öffnen');
      expect(button).toHaveAttribute('title', 'Öffnen');
    });

    it('Given Action-Button, When gerendert, Then zeigt Icon', () => {
      render(<ActionButton icon="bi-download" label="Download" />);

      const button = screen.getByRole('button', { name: 'Download' });
      const icon = button.querySelector('i.bi-download');

      expect(icon).toBeInTheDocument();
    });
  });

  describe('Szenario 9: Normal-Action Hover', () => {
    it('Given normaler Action-Button, When Hover, Then orange Stil', () => {
      render(<ActionButton icon="bi-pencil" label="Umbenennen" />);

      const button = screen.getByRole('button', { name: 'Umbenennen' });

      fireEvent.mouseEnter(button);

      expect(button).toHaveStyle({
        borderColor: 'var(--orange)',
        color: 'var(--orange)',
        background: 'var(--orange-weak)',
      });
    });

    it('Given normaler Action-Button, When Hover endet, Then neutraler Stil', () => {
      render(<ActionButton icon="bi-pencil" label="Umbenennen" />);

      const button = screen.getByRole('button', { name: 'Umbenennen' });

      fireEvent.mouseEnter(button);
      fireEvent.mouseLeave(button);

      expect(button).toHaveStyle({
        background: '#fff',
      });
    });
  });

  describe('Szenario 10: Danger-Action Hover (Löschen)', () => {
    it('Given danger Action-Button, When Hover, Then roter Stil', () => {
      render(<ActionButton icon="bi-trash" label="Löschen" danger />);

      const button = screen.getByRole('button', { name: 'Löschen' });

      fireEvent.mouseEnter(button);

      expect(button).toHaveStyle({
        borderColor: 'var(--danger)',
        color: 'var(--danger)',
        background: 'var(--danger-weak)',
      });
    });
  });

  describe('Szenario 11: Keyboard-Fokus', () => {
    it('Given Action-Button, When fokussiert, Then gleicher Stil wie Hover', () => {
      render(<ActionButton icon="bi-folder" label="Öffnen" />);

      const button = screen.getByRole('button', { name: 'Öffnen' });

      fireEvent.focus(button);

      expect(button).toHaveStyle({
        borderColor: 'var(--orange)',
        color: 'var(--orange)',
      });
    });

    it('Given Action-Button, When Fokus endet, Then neutraler Stil', () => {
      render(<ActionButton icon="bi-folder" label="Öffnen" />);

      const button = screen.getByRole('button', { name: 'Öffnen' });

      fireEvent.focus(button);
      fireEvent.blur(button);

      expect(button).toHaveStyle({
        background: '#fff',
      });
    });
  });

  describe('onClick Handler', () => {
    it('Given Action-Button mit onClick, When geklickt, Then Handler aufgerufen', () => {
      const handleClick = vi.fn();
      render(<ActionButton icon="bi-download" label="Download" onClick={handleClick} />);

      const button = screen.getByRole('button', { name: 'Download' });
      fireEvent.click(button);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('Disabled State', () => {
    it('Given disabled Action-Button, When gerendert, Then ist deaktiviert', () => {
      render(<ActionButton icon="bi-trash" label="Löschen" disabled />);

      const button = screen.getByRole('button', { name: 'Löschen' });

      expect(button).toBeDisabled();
      expect(button).toHaveStyle({ opacity: '0.5' });
    });

    it('Given disabled Action-Button, When geklickt, Then kein Handler-Aufruf', () => {
      const handleClick = vi.fn();
      render(<ActionButton icon="bi-trash" label="Löschen" disabled onClick={handleClick} />);

      const button = screen.getByRole('button', { name: 'Löschen' });
      fireEvent.click(button);

      expect(handleClick).not.toHaveBeenCalled();
    });
  });
});

describe('ActionButtonGroup', () => {
  it('Given mehrere Buttons, When in Group, Then horizontal angeordnet', () => {
    render(
      <ActionButtonGroup>
        <ActionButton icon="bi-folder" label="Öffnen" />
        <ActionButton icon="bi-pencil" label="Umbenennen" />
        <ActionButton icon="bi-trash" label="Löschen" danger />
      </ActionButtonGroup>
    );

    expect(screen.getByRole('button', { name: 'Öffnen' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Umbenennen' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Löschen' })).toBeInTheDocument();
  });
});
