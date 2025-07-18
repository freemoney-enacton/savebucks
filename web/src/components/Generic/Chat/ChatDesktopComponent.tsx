'use client';
import React, { useEffect } from 'react';
import dynamic from 'next/dynamic';

const ChatComponent = dynamic(() => import('./ChatComponent'), { ssr: false });

const ChatDesktopComponent = ({ isOpen, setIsOpen }: { isOpen?: boolean; setIsOpen?: any }) => {
  useEffect(() => {
    if (isOpen) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    } else {
      document.body.style.overflow = 'auto';
      document.body.style.paddingRight = '0px';
    }
  }, [isOpen]);

  return (
    <>
      {/* {isOpen && (
        <div
          onClick={() => setIsOpen(!isOpen)}
          className={`max-xl:hidden fixed inset-0 z-20 bg-black/25 transition-ease ${
            isOpen ? 'opacity-100 backdrop-blur-sm' : 'opacity-0 backdrop-blur-0'
          }`}
        ></div>
      )} */}
      <div
        className={`fixed inset-y-0 right-0 z-20 bg-black ${
          isOpen ? 'translate-x-0 shadow-chat-box' : 'translate-x-full'
        } max-w-[420px] w-full transition-ease`}
      >
        <div className="relative">
          <ChatComponent variant="sidebar" setIsOpen={setIsOpen} isOpen={isOpen} />
        </div>
      </div>
    </>
  );
};

export default ChatDesktopComponent;
