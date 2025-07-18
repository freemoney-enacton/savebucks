import { useRouter } from 'next/router';
import { useEffect, useCallback } from 'react';

const useScrollToTop = () => {
  const router = useRouter();

  const scrollTo = useCallback((scrollToTop = 0) => {
    if (typeof window === 'undefined') {
      return;
    }
    window.scrollTo({ top: scrollToTop, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const handleRouteChange = () => {
      scrollTo(0); // Default scroll to top on route change
    };

    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router, scrollTo]);

  return scrollTo;
};

export default useScrollToTop;