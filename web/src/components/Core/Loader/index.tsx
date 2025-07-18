import { Spinner } from '@nextui-org/react';
import React from 'react';

export default function Loader() {
  return (
    <div className="py-16 text-center">
      <Spinner classNames={{ wrapper: 'w-7 sm:w-10 h-7 sm:h-10' }} color="white" size="lg" />
    </div>
  );
}
