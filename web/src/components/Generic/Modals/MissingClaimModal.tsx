import React from 'react';
import ModalComponent from './ModalComponent';
import MissingClaimForm from '../Forms/MissingClaimForm';

const MissingClaimModal = ({
  isOpen,
  onOpenChange,
  onClose,
  onSuccess,
}: {
  isOpen: any;
  onOpenChange?: any;
  onClose?: any;
  onSuccess?: () => void;
}) => {
  return (
    <ModalComponent onClose={onClose} isOpen={isOpen} onOpenChange={onOpenChange} customClass="!max-w-[668px]">
      <MissingClaimForm onClose={onClose} onSuccess={onSuccess} />
    </ModalComponent>
  );
};

export default MissingClaimModal;
