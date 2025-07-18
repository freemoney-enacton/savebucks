import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { AppRoutes } from '@/routes-config';
import { useRecoilValue } from 'recoil';
import { numberAtomFamily } from '@/recoil/atom';
import { atomKey } from '@/recoil/atom-key';
import Cookies from 'js-cookie';
import { useSession } from 'next-auth/react';
import { useDisclosure } from '@nextui-org/react';
import AuthModal from '../Core/AuthModal';

export default function StickyLinkCard({ icon, label, url, onClick }: any) {
  let navigate = usePathname();
  const chatMentionCounter: any = useRecoilValue(numberAtomFamily(atomKey.chatMentionCounter));
  const isMobileApp = Cookies.get('isMobileApp');
  const { data: session }: any = useSession();
  const userInfo = session?.user?.user;
  const { isOpen: authIsOpen, onOpen: authOnOpen, onOpenChange: authOnOpenChange, onClose: authOnClose } = useDisclosure();

  const handlePlaytimeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (userInfo?.id) {
      if (typeof window !== 'undefined' && window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
        window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'PLAYTIME_CLICK', userId: userInfo.id }));
      } else {
        window.location.href = AppRoutes.playtime;
      }
    } else {
      authOnOpen();
    }
  };

  if (url === AppRoutes.playtime && isMobileApp) {
    return (
      <>
        <button
          onClick={handlePlaytimeClick}
          className={`ripple group px-1 pt-2 flex flex-col items-center gap-1 sm:gap-2 ${
            navigate == url ? 'text-primary' : 'text-gray-450'
          } text-xxs sm:text-xs font-medium hover:opacity-85 transition-ease`}
        >
          <div className="relative">{icon}</div>
          <span className="text-white">{label}</span>
        </button>
        <AuthModal isOpen={authIsOpen} onOpenChange={authOnOpenChange} onClose={authOnClose} />
      </>
    );
  }
  return url === AppRoutes.offers ? (
    <Link href={url} className={`ripple group text-black text-xxs sm:text-xs font-medium`}>
      <span
        className={`w-fit min-w-[61px] mx-auto px-1 pt-2.5 pb-1.5 flex flex-col gap-2 ${
          navigate == url ? 'bg-primary-gr' : 'bg-gray-gr'
        } rounded-md transition-ease text-center [&>svg]:size-[22px] [&>svg]:mx-auto`}
      >
        {icon}
        <span>{label}</span>
      </span>
    </Link>
  ) : url === null ? (
    <button
      onClick={onClick}
      className={`ripple group px-1 pt-2 flex flex-col items-center gap-1 sm:gap-2 ${
        navigate == url ? 'text-primary' : 'text-gray-450'
      } text-xxs sm:text-xs font-medium hover:opacity-85 transition-ease`}
    >
      <div className="relative">
        {icon}
        {chatMentionCounter ? (
          <div className="h-3.5 sm:h-4 min-w-3.5 sm:min-w-4 px-1 flex items-center justify-center bg-red text-black text-[length:9px] sm:text-[10px] leading-3 font-semibold rounded-full absolute -top-1 -right-1 z-[1]">
            {chatMentionCounter}
          </div>
        ) : null}
      </div>
      <span className="text-white">{label}</span>
    </button>
  ) : (
    <Link
      href={url}
      className={`ripple group px-1 pt-2 flex flex-col items-center gap-1 sm:gap-2 ${
        navigate == url ? 'text-primary' : 'text-gray-450'
      } text-xxs sm:text-xs font-medium hover:opacity-85 transition-ease`}
    >
      {icon}
      <span className="text-white">{label}</span>
    </Link>
  );
}
