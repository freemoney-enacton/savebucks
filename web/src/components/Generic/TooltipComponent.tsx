'use client';
import React, { useEffect, useState } from 'react';
import { Tooltip } from '@nextui-org/react';

type placement =
  | 'bottom'
  | 'bottom-end'
  | 'bottom-start'
  | 'left'
  | 'left-end'
  | 'left-start'
  | 'right'
  | 'right-end'
  | 'right-start'
  | 'top'
  | 'top-end'
  | 'top-start';
const TooltipComponent = ({
  content,
  placement = 'bottom',
  contentData,
  className,
}: {
  contentData: any;
  content: any;
  placement?: placement;
  className?: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    } else {
      document.body.style.overflow = 'auto';
      document.body.style.paddingRight = '0';
    }

    return () => {
      document.body.style.overflow = 'auto';
      document.body.style.paddingRight = '0';
    };
  }, [isOpen]);

  return (
    <Tooltip
      isOpen={isOpen}
      placement={placement}
      showArrow={true}
      shouldCloseOnBlur={true}
      content={content}
      classNames={{
        content: ['p-2 !bg-white-gr max-w-[155px] !rounded-lg text-white text-xs text-center'],
        base: ['before:!bg-white-gr'],
      }}
      onClick={(isOpen) => {
        isOpen;
      }}
    >
      <span
        role="button"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        onClick={() => setIsOpen(!isOpen)}
      >
        {contentData}
      </span>
    </Tooltip>
  );
};

export default TooltipComponent;
