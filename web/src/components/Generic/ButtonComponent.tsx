'use client';
import Link from 'next/link';
import { Button, Spinner } from '@nextui-org/react';

export default function ButtonComponent({ label, variant, icon, role, url, customClass, isLoading, ...rest }: any) {
  const baseStyle = `inline-flex justify-center items-center gap-1.5 px-3 sm:px-5 py-2 sm:py-2.5 text-white font-medium sm:font-semibold rounded-md sm:rounded-lg transition-linear relative z-[1] h-auto data-[focus-visible=true]:z-0 disabled:opacity-60 disabled:cursor-not-allowed btn`;
  const style: any = {
    primary:
      'bg-primary-btn-gr !text-btn-primary-text hover:-translate-y-0.5 disabled:bg-gray-gr primary-btn',
    outline: 'bg-black !text-btn-outline-text outline-btn disabled:bg-gray-gr',
    secondary: 'bg-secondary-btn-gr !text-btn-primary-text !py-1.5 !px-2 !h-fit !w-fit text-xs disabled:bg-gray-gr',
    danger: 'bg-red-400 !text-black hover:-translate-y-1 !py-3 danger-btn disabled:bg-gray-gr',
    gray: '!min-w-fit !w-fit bg-gray-450 !text-black !px-3.5 !py-1 !text-xs hover:-translate-y-0.5',
    small: 'small-icon-btn',
  };
  return (
    <>
      {role === 'button' ? (
        variant === 'outline' ? (
          <div className="outline-button-wrapper bg-outline-btn-border-gr p-[1px] rounded-md sm:rounded-lg hover:-translate-y-1 transition-linear">
            <Button className={`${style[variant]} ${baseStyle} ${customClass || ''}`} {...rest}>
              {isLoading ? <Spinner classNames={{ wrapper: 'w-5 sm:w-5 h-6 sm:h-5' }} color="white" size="md" /> : label}
              {!isLoading && (icon ? icon : null)}
            </Button>
          </div>
        ) : (
          <Button className={`${style[variant]} ${baseStyle} ${customClass || ''}`} {...rest}>
            {isLoading ? <Spinner classNames={{ wrapper: 'w-5 sm:w-5 h-6 sm:h-5' }} color="white" size="md" /> : label}
            {!isLoading && (icon ? icon : null)}
          </Button>
        )
      ) : (
        <Link prefetch={false} href={url ? url : ''} className={`${style[variant]} ${baseStyle} ${customClass || ''}`} {...rest}>
          {isLoading ? <Spinner classNames={{ wrapper: 'w-5 sm:w-5 h-5 sm:h-5' }} color="white" size="md" /> : label}
          {!isLoading && (icon ? icon : null)}
        </Link>
      )}
    </>
  );
}
