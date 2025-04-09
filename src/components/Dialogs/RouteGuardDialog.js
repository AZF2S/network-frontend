import React, { useEffect, useRef } from 'react';
import './RouteGuardDialog.css';

function RouteGuardDialog({ isOpen, title, content, confirmText, onConfirm, cancelText, onCancel, onClose }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    const handleOutsideClick = (event) => {
      if (dialogRef.current && !dialogRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('mousedown', handleOutsideClick);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="dialog-overlay">
      <div className="dialog" ref={dialogRef}>
        <div className="dialog-header">
          <div className="dialog-title">{title}</div>
          <button className="dialog-close" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="dialog-content">{content}</div>
        <div className="dialog-actions">
          <button className="dialog-button" onClick={onConfirm}>
            {confirmText}
          </button>
          {cancelText && (
            <button className="dialog-button" onClick={onCancel}>
              {cancelText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default RouteGuardDialog;