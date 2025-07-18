'use client';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

const FacebookPixelEvents = ({ fbPixelId }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    import('react-facebook-pixel')
      .then((x) => x.default)
      .then((ReactPixel) => {
        ReactPixel.init(fbPixelId);
        ReactPixel.pageView();
      });
  }, [pathname, searchParams]);

  return null;
};

export default FacebookPixelEvents;
