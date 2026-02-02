import React from 'react';
/**
 * Componente Modal reutilizable
 * Soporta overlay, cerrar con ESC y click fuera
 */

import { useEffect } from 'react';
import './Modal.css';

function Modal({
  isOpen,
  onClose,
  title = '',
  children,
  footer = null,
  size = 'medium',
  closeOnOverlay = true,
  closeOnEsc = true,
  showCloseButton = true,
}) {
  useEffect(() => {
    if (!isOpen || !closeOnEsc) return;

    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, closeOnEsc, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (closeOnOverlay && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className={`modal-container modal-${size}`}>
        {(title || showCloseButton) && (
          <div className="modal-header">
            {title && <h3 className="modal-title">{title}</h3>}
            {showCloseButton && (
              <button
                type="button"
                className="modal-close-button"
                onClick={onClose}
                aria-label="Cerrar modal"
              >
                <i className="bi bi-x-lg"></i>
              </button>
            )}
          </div>
        )}

        <div className="modal-body">{children}</div>

        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  );
}

export default Modal;