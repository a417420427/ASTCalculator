// Dialog.tsx
import React, { ReactNode, CSSProperties } from 'react';
import { createPortal } from 'react-dom';

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  style?: {
    overlay?: CSSProperties;
    content?: CSSProperties;
  };
  closeOnOverlayClick?: boolean;
}

const DEFAULT_STYLES = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  } as CSSProperties,
  content: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '20px',
    minWidth: '300px',
    maxWidth: '80%',
    maxHeight: '80vh',
    overflow: 'auto',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
  } as CSSProperties,
};

export const Dialog: React.FC<DialogProps> = ({
  isOpen,
  onClose,
  children,
  style = {},
  closeOnOverlayClick = true,
}) => {
  if (!isOpen) return null;

  const mergedStyles = {
    overlay: { ...DEFAULT_STYLES.overlay, ...style.overlay },
    content: { ...DEFAULT_STYLES.content, ...style.content },
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && closeOnOverlayClick) {
      onClose();
    }
  };

  return createPortal(
    <div style={mergedStyles.overlay} onClick={handleOverlayClick}>
      <div style={mergedStyles.content}>
        {children}
      </div>
    </div>,
    document.body
  );
};