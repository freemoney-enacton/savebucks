import { Spinner } from '@nextui-org/react';
import React from 'react';

const PageLoader = () => {
  return (
    <div className="min-h-[calc(100vh-68px-68px)] w-full grid place-content-center">
      <Spinner color="primary" size="lg" />
    </div>
  );
};

export default PageLoader;
