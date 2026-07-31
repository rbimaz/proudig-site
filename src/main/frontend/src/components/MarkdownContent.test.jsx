import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import MarkdownContent from './MarkdownContent';

/**
 * Unit Tests für MarkdownContent
 *
 * Testet die CTA-Button-Konvention und die Link-Behandlung:
 * - `[Text](/ziel "button")` -> CTA-Button (btn btn-cta) via Router-Link
 * - normaler interner Link -> Router-Link ohne btn-cta
 * - externer Link -> <a target="_blank">
 * - externer Button -> <a> mit btn-cta
 */
function renderMd(md) {
  return render(
    <MemoryRouter>
      <MarkdownContent>{md}</MarkdownContent>
    </MemoryRouter>
  );
}

describe('MarkdownContent', () => {
  it('Given interner Link mit Title "button", When gerendert, Then CTA-Button auf internes Ziel', () => {
    renderMd('[Jetzt anfragen](/kontakt "button")');

    const link = screen.getByRole('link', { name: 'Jetzt anfragen' });

    expect(link).toHaveClass('btn', 'btn-cta');
    expect(link).toHaveAttribute('href', '/kontakt');
    // interner Router-Link öffnet nicht in neuem Tab
    expect(link).not.toHaveAttribute('target');
    // der Title "button" ist nur Konvention, kein Tooltip
    expect(link).not.toHaveAttribute('title');
  });

  it('Given normaler interner Link, When gerendert, Then Router-Link ohne btn-cta', () => {
    renderMd('[Mehr erfahren](/blog)');

    const link = screen.getByRole('link', { name: 'Mehr erfahren' });

    expect(link).not.toHaveClass('btn-cta');
    expect(link).toHaveAttribute('href', '/blog');
    expect(link).not.toHaveAttribute('target');
  });

  it('Given externer Link, When gerendert, Then <a> mit target=_blank und rel', () => {
    renderMd('[Website](https://example.com)');

    const link = screen.getByRole('link', { name: 'Website' });

    expect(link).toHaveAttribute('href', 'https://example.com');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    expect(link).not.toHaveClass('btn-cta');
  });

  it('Given externer Link mit Title "button", When gerendert, Then behält btn-cta-Optik', () => {
    renderMd('[Extern öffnen](https://example.com "button")');

    const link = screen.getByRole('link', { name: 'Extern öffnen' });

    expect(link).toHaveClass('btn', 'btn-cta');
    expect(link).toHaveAttribute('href', 'https://example.com');
    expect(link).toHaveAttribute('target', '_blank');
  });
});
