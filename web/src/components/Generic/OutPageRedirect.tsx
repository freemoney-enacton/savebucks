'use client';
import { config } from '@/config';
import { useEffect } from 'react';

const OutPageRedirect = ({ redirectUrl }) => {
  useEffect(() => {
    setTimeout(() => {
      window.location.href = redirectUrl;
    }, config.OUT_PAGE_REDIRECTION_TIME_IN_MS);
    return () => {};
  }, []);

  return null;
};

export default OutPageRedirect;
