import React, { useEffect, useRef } from 'react';

/**
 * ConfirmDialog - Modal-Bestätigungsdialog
 *
 * Ersetzt browser confirm() mit einer styled Komponente.
 *
 * @param {boolean} open - Dialog sichtbar
 * @param {string} title - Überschrift
 * @param {string|ReactNode} message - Nachricht (kann mehrzeilig sein)
 * @param {string} confirmText - Button-Text (Standard: "Löschen")
 * @param {string} cancelText - Button-Text (Standard: "Abbrechen")
 * @param {boolean} danger - Roter Confirm-Button und Warn-Icon
 * @param {function} onConfirm - Bestätigung Handler
 * @param {function} onCancel - Abbruch Handler
 */
export const ConfirmDialog = ({
  open,
  title,
  message,
  confirmText = 'Löschen',
  cancelText = 'Abbrechen',
  danger = false,
  onConfirm,
  onCancel,
}) => {
  const dialogRef = useRef(null);
  const confirmButtonRef = useRef(null);

  // Focus trap and ESC handling
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onCancel?.();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    // Focus confirm button when dialog opens
    confirmButtonRef.current?.focus();

    // Prevent body scroll
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [open, onCancel]);

  if (!open) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onCancel?.();
    }
  };

  return (
    <div className="confirm-dialog-backdrop" onClick={handleBackdropClick}>
      <div className="confirm-dialog" ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="confirm-dialog-title">
        {danger && (
          <div className="confirm-dialog-icon confirm-dialog-icon-danger">
            <i className="bi bi-exclamation-triangle-fill"></i>
          </div>
        )}

        <h2 id="confirm-dialog-title" className="confirm-dialog-title">{title}</h2>

        <div className="confirm-dialog-message">
          {typeof message === 'string' ? (
            message.split('\n').map((line, i) => (
              <p key={i}>{line}</p>
            ))
          ) : (
            message
          )}
        </div>

        <div className="confirm-dialog-actions">
          <button
            type="button"
            className="confirm-dialog-btn confirm-dialog-btn-cancel"
            onClick={onCancel}
          >
            {cancelText}
          </button>
          <button
            ref={confirmButtonRef}
            type="button"
            className={`confirm-dialog-btn ${danger ? 'confirm-dialog-btn-danger' : 'confirm-dialog-btn-primary'}`}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
