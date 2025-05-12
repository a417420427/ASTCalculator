// dialogService.ts
import React, { ReactNode, useState } from 'react';
import { Dialog } from './Dialog';

interface DialogOptions {
  content: ReactNode;
  style?: {
    overlay?: React.CSSProperties;
    content?: React.CSSProperties;
  };
  closeOnOverlayClick?: boolean;
}

interface DialogContextType {
  openDialog: (options: DialogOptions) => void;
  closeDialog: () => void;
}

const DialogContext = React.createContext<DialogContextType | undefined>(undefined);

export const DialogProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dialogOptions, setDialogOptions] = useState<DialogOptions>({
    content: null,
  });

  const openDialog = (options: DialogOptions) => {
    setDialogOptions(options);
    setIsOpen(true);
  };

  const closeDialog = () => {
    setIsOpen(false);
  };

  return (
    <DialogContext.Provider value={{ openDialog, closeDialog }}>
      {children}
      <Dialog
        isOpen={isOpen}
        onClose={closeDialog}
        style={dialogOptions.style}
        closeOnOverlayClick={dialogOptions.closeOnOverlayClick}
      >
        {dialogOptions.content}
      </Dialog>
    </DialogContext.Provider>
  );
};

export const useDialog = (): DialogContextType => {
  const context = React.useContext(DialogContext);
  if (!context) {
    throw new Error('useDialog must be used within a DialogProvider');
  }
  return context;
};