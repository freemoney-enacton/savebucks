import React, { useEffect } from 'react';
import { Modal, ModalContent } from '@nextui-org/react';
import { XCircle } from 'lucide-react';

export default function ModalComponent({
  isOpen,
  onOpenChange,
  customClass,
  children,
  onCloseClick,
  fullMobileModal = false,
  ...rest
}: any) {
  const isServer = typeof window === 'undefined';

  useEffect(() => {
    if (!isServer) {
      // Calculate the scrollbar width
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      const body = document.querySelector('body');

      if (body) {
        if (isOpen) {
          body.style.overflow = 'hidden';
          body.style.paddingRight = `${scrollbarWidth}px`;
        } else {
          body.style.overflow = 'auto';
          body.style.paddingRight = '0';
        }
      }

      return () => {
        if (body) {
          // Check again in cleanup
          body.style.overflow = 'auto';
          body.style.paddingRight = '0';
        }
      };
    }
  }, [isOpen, isServer]);
  return (
    isOpen && (
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        hideCloseButton={true}
        className={`modal !relative sm:!min-h-60 !w-full !min-w-0 !shadow-none !rounded-lg overflow-y-auto p-6 mx-auto !bg-black-600 sm:!my-6 ${
          fullMobileModal
            ? '!min-h-full max-sm:!my-0 max-sm:!rounded-none max-h-full'
            : '!min-h-60 max-sm:!mb-0 max-sm:!rounded-b-none max-h-[80dvh] sm:max-h-full'
        } ${customClass ? customClass : ''}`}
        classNames={{
          wrapper: `!overflow-x-clip sm:py-6 ${fullMobileModal ? 'py-0' : 'pt-4'}`,
          backdrop: '!bg-overlay/15 filter backdrop-blur-sm backdrop-opacity-100',
        }}
        {...rest}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <button
                className="absolute top-0 right-0 p-3 sm:p-4"
                onClick={() => {
                  onClose(), onCloseClick && onCloseClick();
                }}
              >
                <XCircle size={20} className="text-white" />
              </button>
              {children}
            </>
          )}
        </ModalContent>
      </Modal>
    )
  );
}
