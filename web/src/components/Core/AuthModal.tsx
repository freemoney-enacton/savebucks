import React from 'react';
import AuthTab from '../Generic/AuthTab';
import ModalComponent from '../Generic/Modals/ModalComponent';

export default function AuthModal({ isOpen, onOpenChange, onClose, selectedKey,id="" }: any) {
  return (
    <>
      <ModalComponent onClose={onClose} isOpen={isOpen} onOpenChange={onOpenChange} customClass="!max-w-[480px]" >
        <AuthTab onClose={onClose} defaultSelectedKey={selectedKey} id={id} />
      </ModalComponent>
    </>
  );
}
