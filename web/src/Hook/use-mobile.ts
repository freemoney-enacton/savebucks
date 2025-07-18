import { config } from '@/config';
import { useState, useEffect } from 'react';

const useMobileBreakpoint = () => {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < config.USE_MOBILE_HOOK_BREAKPOINT) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }
    };

    window.addEventListener('resize', handleResize);

    handleResize(); // initial check

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < config.USE_TABLET_HOOK_BREAKPOINT) {
        setIsTablet(true);
      } else {
        setIsTablet(false);
      }
    };

    window.addEventListener('resize', handleResize);

    handleResize(); // initial check

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return { isMobile, isTablet };
};

export default useMobileBreakpoint;
