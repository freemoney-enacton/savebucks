import { ChevronRightIcon } from '@heroicons/react/24/outline';
import React from 'react';

export default function PaginationNextButton({ onClick, disabled }: any) {
  return (
    <button
      className="bg-white-gr size-[26px] border border-gray-400 rounded-lg grid place-content-center disabled:opacity-50"
      onClick={onClick}
      disabled={disabled}
    >
      <ChevronRightIcon className="w-4 h-4 stroke-2" />
    </button>
  );
}
