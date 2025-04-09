import React, { createContext, useContext, useState } from 'react';
import RouteGuardDialog from '../components/Dialogs/RouteGuardDialog';

const DialogContext = createContext();

export function DialogProvider({ children }) {
  const [dialogProps, setDialogProps] = useState({
    isOpen: false,
    title: '',
    content: '',
    onConfirm: () => {},
    onCancel: () => {},
    confirmText: '',
    cancelText: '',
  });

  const requestDialog = (title, content, confirmText, onConfirm, cancelText, onCancel) => {
    setDialogProps({ isOpen: true, title, content, confirmText, onConfirm, cancelText, onCancel });
  };

  const handleClose = () => {
    setDialogProps((prevProps) => ({ ...prevProps, isOpen: false }));
  };

  return (
    <DialogContext.Provider value={{ requestDialog }}>
      {children}
      <RouteGuardDialog
        isOpen={dialogProps.isOpen}
        title={dialogProps.title}
        content={dialogProps.content}
        confirmText={dialogProps.confirmText}
        onConfirm={() => {
          dialogProps.onConfirm();
          handleClose();
        }}
        cancelText={dialogProps.cancelText}
        onCancel={() => {
          dialogProps.onCancel();
          handleClose();
        }}
        onClose={handleClose}
      />
    </DialogContext.Provider>
  );
}

export function useDialog() {
  const context = useContext(DialogContext);
  if (context === undefined) {
    throw new Error('useDialog must be used within a DialogProvider');
  }
  return context;
}