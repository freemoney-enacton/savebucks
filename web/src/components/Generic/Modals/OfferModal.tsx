import { useUtils } from '@/Hook/use-utils';
import ModalComponent from './ModalComponent';
import SingleOfferCommonComponent from '../SingleOfferCommonComponent';

const OfferModal = ({ isOpen, onOpenChange, OfferModalData, loading, data }) => {
  const { previousUrl } = useUtils();

  return (
    <ModalComponent
      isOpen={isOpen}
      onCloseClick={() => {
        window.history.replaceState({}, '', previousUrl);
      }}
      onClose={() => {
        window.history.replaceState({}, '', previousUrl);
      }}
      onOpenChange={onOpenChange}
      customClass={`!p-0 max-w-[570px] ${
        OfferModalData?.banner_image ? 'sm:max-h-[800px]' : 'sm:max-h-[645px]'
      } !bg-black-250 relative h-full flex flex-col gap-4 sm:gap-6`}
      fullMobileModal={true}
    >
      <SingleOfferCommonComponent OfferModalData={OfferModalData} loading={loading} />
    </ModalComponent>
  );
};

export default OfferModal;
