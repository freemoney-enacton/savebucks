'use client';
import Input from '@/components/Core/Input';
import { useTranslation } from '@/i18n/client';
import { useEffect, useRef, useState } from 'react';
import ChatDropdown from '../dropdowns/ChatDropdown';
import ChatMessageCard from './ChatMessageCard';
import useChat from '@/Hook/use-chat';
import ChatSkeleton from '../Skeleton/ChatSkeleton';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';
import { HeadphonesIcon, SmileIcon, XCircle } from 'lucide-react';
import { useIntercom } from 'react-use-intercom';
import { atomKey } from '@/recoil/atom-key';
import { objectAtomFamily } from '@/recoil/atom';
import { useRecoilValue } from 'recoil';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import EmojiPicker from 'emoji-picker-react';
import { Spinner } from '@nextui-org/react';

const ChatComponent = ({
  variant = 'sidebar',
  setIsOpen,
  isOpen: open,
}: {
  variant: 'sidebar' | 'page';
  setIsOpen?: any;
  isOpen?: boolean;
}) => {
  const { t } = useTranslation();
  const [openEmoji, setOpenEmoji] = useState(false);
  const settings: any = useRecoilValue(objectAtomFamily(atomKey.settings));
  const [chatText, setChatText] = useState('');
  const {
    messages,
    handleSendMessage,
    messagesEndRef,
    chatRooms,
    setSelectedRoom,
    loading,
    roomCounts,
    isValidSelectedRoom,
    resetMentionCounter,
    handleScroll,
    isPaginating, // <-- add this
  } = useChat();
  const { show, hide, isOpen } = useIntercom();
  const inputRef = useRef<any>(null);

  useEffect(() => {
    if (open) {
      resetMentionCounter();
    }
  }, [open]);

  return (
    <div
      className={`chat-wrapper flex flex-col relative ${
        variant === 'sidebar'
          ? 'h-[100dvh]'
          : 'h-[calc(100dvh-66px)] sm:h-[calc(100dvh-78px)] lg:h-[calc(100dvh-82px)] xl:h-[100dvh]'
      }`}
    >
      {/* header */}
      <div className="mb-4 px-4 py-3 sm:py-4 flex justify-between items-center gap-3 border-b border-gray-400">
        <div className="flex items-center gap-3">
          {variant === 'sidebar' && (
            <button onClick={() => setIsOpen(false)} className="size-8 bg-black-250 rounded-xl flex items-center justify-center">
              <ChevronRightIcon className="size-4 text-white hover:opacity-85 transition-ease" />
            </button>
          )}
          <div className="flex items-center justify-center gap-2">
            <div className="bg-notification-unread size-2 rounded-full"></div>
            <p className="text-gray-600 text-sm font-semibold">
              {roomCounts?.[isValidSelectedRoom] ? roomCounts?.[isValidSelectedRoom] : 0} {t('online')}
            </p>
          </div>
        </div>
        {chatRooms.length > 0 && (
          <ChatDropdown chatRooms={chatRooms} setSelectedRoom={setSelectedRoom} selectedRoom={isValidSelectedRoom} />
        )}
        {settings?.services?.intercom_enabled ? (
          <HeadphonesIcon
            className="w-5 h-5 text-gray-600"
            onClick={() => {
              isOpen ? hide() : show();
            }}
          />
        ) : null}
      </div>
      {/* messages */}
      <div
        ref={messagesEndRef}
        onScroll={handleScroll}
        className="h-full mr-2 pl-4 pr-2 pb-0 space-y-2.5 overflow-y-auto no-scrollbar relative"
      >
        {/* Loader at the top when paginating */}
        {isPaginating && (
          <div className="flex justify-center py-2">
            <Spinner color="primary" size="sm" />
          </div>
        )}
        {messages.map((data, index) => {
          return (
            <ChatMessageCard
              key={index}
              username={data.user_name}
              MessageComponent={data.MessageComponent}
              level={data.current_user_level}
              levelIcon={data.tier_icon}
              timestamp={data.sent_at}
              user={data}
              handleMentionClick={(user) => {
                inputRef.current?.handleUserSelect(user, true);
              }}
            />
          );
        })}
        {/* Emoji Picker absolute over messages */}
      </div>
      {/* input */}
      <form onSubmit={(e) => handleSendMessage(e, setChatText, inputRef.current?.setInputValue)}>
        {openEmoji && (
          <div className="absolute bottom-16 right-3 z-50 w-64 sm:w-72" style={{ maxWidth: 320 }}>
            <button
              type="button"
              className="absolute top-2 right-2 z-10 text-gray-500 hover:text-gray-800 cursor-pointer"
              onClick={() => setOpenEmoji(false)}
            >
              <XCircle size={20} className="text-white" />
            </button>
            <EmojiPicker
              open={openEmoji}
              onEmojiClick={(emoji) => {
                setChatText(inputRef.current?.inputValue + emoji.emoji);
                inputRef.current?.setInputValue(inputRef.current?.inputValue + emoji.emoji);
                setOpenEmoji(false);
              }}
              searchDisabled
              className="shadow-lg"
              width="100%"
              height={300}
              allowExpandReactions={false}
              style={{ paddingTop: 20 }}
              previewConfig={{ showPreview: false }}
            />
          </div>
        )}
        <div className="p-4 flex items-center gap-2 sm:gap-4 [&>div]:w-full">
          <Input
            ref={inputRef}
            autoFocus={true}
            name="chatInput"
            type="text"
            id="chatInput"
            placeholder={t('chat_input_placeholder')}
            customClass="w-full !py-2.5 sm:!py-4 !px-3 sm:!px-5 !bg-none !bg-black-250 !text-sm"
            onChange={(e) => setChatText(e.target.value)}
            value={chatText}
            isTag={true}
            onFocus={() => setOpenEmoji(false)}
          />
          <SmileIcon
            className="w-6 h-6 text-gray-600 cursor-pointer"
            onClick={() => {
              setOpenEmoji(!openEmoji);
            }}
          />
          <button
            disabled={!chatText}
            className="group flex-shrink-0 hover:opacity-85 transition-ease disabled:cursor-not-allowed"
            type="submit"
          >
            <PaperAirplaneIcon className="size-6 sm:size-7 text-primary group-disabled:text-gray-400 transition-ease" />
          </button>
        </div>
      </form>
      {loading && <ChatSkeleton />}
    </div>
  );
};

export default ChatComponent;
