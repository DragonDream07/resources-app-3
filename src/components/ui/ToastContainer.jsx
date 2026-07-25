import React from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import Toast from './Toast';

const positionClasses = {
  'top-right': 'top-4 right-4 items-end',
  'top-left': 'top-4 left-4 items-start',
  'bottom-right': 'bottom-4 right-4 items-end',
  'bottom-left': 'bottom-4 left-4 items-start',
  'top-center': 'top-4 left-1/2 -translate-x-1/2 items-center',
  'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2 items-center',
};

const ToastContainer = ({ toasts = [], onDismiss, position = 'top-right' }) => {
  if (!toasts.length) return null;

  const posClass = positionClasses[position] ?? positionClasses['top-right'];

  return createPortal(
    <div
      aria-label="Notifications"
      className={[
        'fixed z-[9999] flex flex-col gap-2 pointer-events-none',
        posClass,
      ].join(' ')}
    >
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <Toast
            id={toast.id}
            message={toast.message}
            variant={toast.variant}
            duration={toast.duration}
            onDismiss={onDismiss}
          />
        </div>
      ))}
    </div>,
    document.body
  );
};

ToastContainer.propTypes = {
  toasts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      message: PropTypes.string.isRequired,
      variant: PropTypes.oneOf(['success', 'error', 'info', 'warning']),
      duration: PropTypes.number,
    })
  ),
  onDismiss: PropTypes.func.isRequired,
  position: PropTypes.oneOf([
    'top-right',
    'top-left',
    'bottom-right',
    'bottom-left',
    'top-center',
    'bottom-center',
  ]),
};

export default ToastContainer;
