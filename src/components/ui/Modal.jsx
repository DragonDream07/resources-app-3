import React, { useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import closeIcon from '@/assets/icons/close.svg';

const FOCUSABLE_SELECTORS = [
  'a[href]',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

const Modal = ({ isOpen, onClose, title, children, size = 'md', className = '' }) => {
  const overlayRef = useRef(null);
  const dialogRef = useRef(null);
  const previousFocusRef = useRef(null);

  const trapFocus = useCallback((e) => {
    if (!dialogRef.current) return;
    const focusable = Array.from(dialogRef.current.querySelectorAll(FOCUSABLE_SELECTORS));
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.key === 'Tab') {
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
    if (e.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement;
      document.body.style.overflow = 'hidden';
      const focusable = dialogRef.current?.querySelectorAll(FOCUSABLE_SELECTORS);
      if (focusable && focusable.length) {
        focusable[0].focus();
      } else {
        dialogRef.current?.focus();
      }
      document.addEventListener('keydown', trapFocus);
    } else {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', trapFocus);
      if (previousFocusRef.current) {
        previousFocusRef.current.focus();
        previousFocusRef.current = null;
      }
    }
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', trapFocus);
    };
  }, [isOpen, trapFocus]);

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full mx-4',
  };

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={handleOverlayClick}
      aria-modal="true"
      role="dialog"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      <div
        ref={dialogRef}
        tabIndex={-1}
        className={[
          'relative w-full rounded-xl bg-white',
          'shadow-[0_20px_60px_-10px_rgba(0,0,0,0.3),0_8px_24px_-4px_rgba(0,0,0,0.15)]',
          'focus:outline-none',
          sizeClasses[size] ?? sizeClasses.md,
          className,
        ]
          .join(' ')
          .trim()}
      >
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
            <h2 id="modal-title" className="text-lg font-semibold text-gray-900">
              {title}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              aria-label="Close dialog"
            >
              <img src={closeIcon} alt="" aria-hidden="true" className="h-5 w-5" />
            </button>
          </div>
        )}
        {!title && (
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            aria-label="Close dialog"
          >
            <img src={closeIcon} alt="" aria-hidden="true" className="h-5 w-5" />
          </button>
        )}
        {/* Body */}
        <div className="px-6 py-4">{children}</div>
      </div>
    </div>,
    document.body
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string,
  children: PropTypes.node,
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl', 'full']),
  className: PropTypes.string,
};

export default Modal;
