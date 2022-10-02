import React from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
  children: React.ReactNode;
}

export default function Modal({ children }: ModalProps) {
  const modalRoot = document.querySelector('#modal_root');
  if (!modalRoot) return <></>;
  return createPortal(<div>{children}</div>, modalRoot);
}
