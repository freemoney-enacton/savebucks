import { booleanDefaultFalseAtomFamily } from '@/recoil/atom';
import { atomKey } from '@/recoil/atom-key';
import { useRecoilState } from 'recoil';

const useGlobalState = () => {
  const [toggleChatSidebarValue, setToggleChatSidebarValue] = useRecoilState(
    booleanDefaultFalseAtomFamily(atomKey.toggleChatSidebar)
  );
  return {
    // chat sidebar
    toggleChatSidebarValue,
    setToggleChatSidebarValue,
  };
};

export default useGlobalState;
