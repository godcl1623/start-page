import React from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
  children: React.ReactNode;
  closeModal: (value: boolean) => void;
}

interface WindowSize {
  width: number;
  height: number;
}

export default function Modal({ children, closeModal }: ModalProps) {
  const modalRoot = document.querySelector('#modal_root');

  const handleModal = () => {
    closeModal(false);
  };

  if (!modalRoot) return <></>;
  return createPortal(
    <div className='absolute top-0 w-full h-full'>
      <div className='w-full h-full bg-neutral-900 opacity-50' onClick={handleModal} />
      <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>{children}</div>
    </div>,
    modalRoot
  );
}
