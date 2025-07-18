'use client';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';

export default function BadgeCard({ data, className = '' }: any) {
  const searchParams = useSearchParams();
  const catParams = searchParams.get('cat');
  const router = useRouter();

  return (
    <button
      className={`${data.slug === catParams || (!data.slug && !catParams) ? 'bg-tertiary-gr' : 'bg-black-250'} ${
        className ? className : ''
      } min-w-24 h-fit p-0.5 rounded-[10px] focus:bg-tertiary-gr focus:outline-none focus:ring-0 focus:ring-offset-0 transition-ease active:scale-95`}
      onClick={() => {
        let newSearchParams = new URL(window.location.href).searchParams;
        if (data.slug) {
          newSearchParams.set('cat', data.slug);
        } else {
          newSearchParams.delete('cat');
        }
        router.replace(`/offers?${newSearchParams.toString()}`);
      }}
    >
      <div className="p-2 bg-black-250 rounded-lg space-y-2">
        <div className="flex-shrink-0 size-6 sm:size-7 mx-auto bg-primary grid place-content-center rounded-full">
          {data.icon && (
            <Image className="max-h-3 sm:max-h-3.5 h-auto w-auto" src={data.icon} alt="logo" width={24} height={24} />
          )}
        </div>
        <p className="text-white text-xs sm:text-sm font-medium whitespace-nowrap">{data.name}</p>
      </div>
    </button>
  );
}
