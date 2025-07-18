'use client';
import SectionTitle from '@/components/Core/SectionTitle';
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';

const PartnerSection = ({ data }: { data: any }) => {
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const containerRef = useRef<any>(null);
  const contentRef = useRef<any>(null);
  const animationKey = `partner-section-${Math.random().toString(36).substring(7)}`;

  // Function to check if animation should occur
  const checkIfShouldAnimate = () => {
    if (containerRef.current && contentRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      const contentWidth = contentRef.current.scrollWidth;
      setShouldAnimate(contentWidth > containerWidth);
    }
  };

  useEffect(() => {
    // Handle image load events
    const handleImageLoad = () => {
      checkIfShouldAnimate();
    };

    // Add 'onLoad' listener for each image inside contentRef
    const images = contentRef.current ? contentRef.current.getElementsByTagName('img') : [];
    for (let image of images) {
      image.addEventListener('load', handleImageLoad);
    }

    // Initial check
    checkIfShouldAnimate();

    // Recheck when the window is resized
    const handleResize = () => {
      checkIfShouldAnimate();
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      // Remove event listeners for images
      for (let image of images) {
        image.removeEventListener('load', handleImageLoad);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [data?.myitems]);

  // Number of times to repeat items to ensure continuous scroll
  const repeatCount = 4;
  const loopedData = Array(repeatCount)
    .fill(data?.items || [])
    .flat();

  return (
    <section className="section text-center">
      <div className="space-y-4 sm:space-y-10">
        <div className="container">
          <SectionTitle title={data?.title} />
        </div>
        <div className="bg-black-600 py-6 sm:py-16">
          <div className="container">
            <div ref={containerRef} className="relative w-full overflow-hidden">
              <div
                ref={contentRef}
                style={{
                  // @ts-ignore
                  '--scroll-items': loopedData.length,
                }}
                className={`flex gap-y-4 sm:gap-y-8 gap-x-8 sm:gap-x-16 ${shouldAnimate ? 'animate-scroll' : ''}`}
              >
                {data?.items?.length > 0 &&
                  loopedData.map((data, index) => (
                    <div className="flex-shrink-0 h-7 sm:h-[72px] flex items-center justify-center" key={index}>
                      {data?.image ? (
                        <div className="w-full max-h-7 sm:max-h-[72px] flex flex-col justify-center items-center">
                          <Image
                            src={data?.image}
                            alt="partner"
                            width={100}
                            height={100}
                            className="max-h-7 sm:max-h-[72px] w-auto h-auto"
                          />
                        </div>
                      ) : null}
                    </div>
                  ))}
              </div>

              {/* gradient decoration blending in smooth transition */}
              <div
                className="absolute inset-y-0 left-0 w-12 sm:w-24"
                style={{
                  background: 'var(--partner-gr-left)',
                }}
              ></div>
              <div
                className="absolute inset-y-0 right-0 w-12 sm:w-24"
                style={{
                  background: 'var(--partner-gr-right)',
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Scoped styles for each instance */}
      <style jsx global>{`
        @keyframes ${animationKey} {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-200px * (var(--scroll-items) / ${repeatCount})));
          }
        }

        .animate-scroll {
          animation: ${animationKey} 30s linear infinite;
        }
      `}</style>
    </section>
  );
};

export default PartnerSection;
