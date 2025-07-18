'use client';
import { useUtils } from '@/Hook/use-utils';
import Image from 'next/image';
import { FC, useRef } from 'react';
import ExternalUserDetails from '../Modals/ExternalUserDetails';

interface ChatMessageProps {
  username: string;
  MessageComponent: any;
  level: number;
  levelIcon: string;
  timestamp: string;
  user: any;
  handleMentionClick: (user: any) => void;
}

const ChatMessageCard: FC<ChatMessageProps> = ({
  username,
  MessageComponent,
  level,
  levelIcon,
  timestamp,
  user,
  handleMentionClick,
}) => {
  const { updatePreviousUrl, formattedDateWithTime } = useUtils();
  const externalUserDetailsRef = useRef<any>(null);

  const triggerUserProfileClick = () => {
    if (externalUserDetailsRef.current) {
      externalUserDetailsRef.current.handleUserProfileClick();
    }
  };
  return (
    <>
      <div className="group w-full p-2 sm:px-4 py-3 bg-black-250 rounded-lg text-gray-600 space-y-2 font-medium">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <div
              onClick={() => {
                updatePreviousUrl();
                triggerUserProfileClick();
              }}
              className="cursor-pointer overflow-hidden flex-shrink-0 size-6  grid place-content-center rounded-full"
            >
              {user?.user_avatar ? (
                <Image
                  className="w-full h-full object-contain rounded-full"
                  src={user?.user_avatar}
                  alt="user"
                  width={50}
                  height={50}
                />
              ) : (
                <p className="text-xs text-black font-semibold leading-[14px] bg-blue-700">
                  {username ? username?.charAt(0)?.toUpperCase() : ''}
                </p>
              )}
            </div>
            <span className="font-medium text-sm sm:text-base max-w-[100px] sm:max-w-[140px] truncate">{username}</span>
            <div className="flex items-center gap-1">
              {levelIcon && level && (
                <Image className="w-auto h-auto max-h-3 sm:max-h-3.5" src={levelIcon} alt="level icon" width={30} height={24} />
              )}
              <span>{level}</span>
            </div>
          </div>
          <span className="group-hover:hidden text-gray-600 text-xxs sm:text-xs">{formattedDateWithTime(timestamp)}</span>
          <span
            className="group-hover:block hidden text-gray-600 text-xxs sm:text-xs cursor-pointer"
            onClick={() => {
              handleMentionClick?.(user);
            }}
          >
            @
          </span>
        </div>
        <div className="text-xs sm:text-sm break-words">{MessageComponent}</div>
      </div>
      <ExternalUserDetails ref={externalUserDetailsRef} user={user} />
    </>
  );
};

export default ChatMessageCard;
