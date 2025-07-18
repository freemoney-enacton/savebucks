'use client';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const BackButton = ({ role = 'button', url, onClick }: { role?: 'button' | 'link'; url?: any; onClick?: () => void }) => {
  const router = useRouter();

  const goBack = () => {
    if (router) {
      router.back();
    }
  };

  return (
    <>
      {role === 'button' ? (
        <button
          onClick={onClick ? onClick : goBack}
          className="bg-black-250 size-8 sm:size-12 rounded-lg grid place-content-center"
        >
          <ChevronLeftIcon className="size-5 sm:size-7 stroke-2 sm:stroke-[3px]" />
        </button>
      ) : (
        <Link prefetch={false} href={url} className="bg-black-250 size-8 sm:size-12 rounded-lg grid place-content-center">
          <ChevronLeftIcon className="size-5 sm:size-7 stroke-2 sm:stroke-[3px]" />
        </Link>
      )}
    </>
  );
};

export default BackButton;
