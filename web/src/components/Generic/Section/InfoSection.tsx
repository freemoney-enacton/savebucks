import React from 'react';
import Image from 'next/image';

export default function InfoSection({ title, children }: any) {
  const gridCols =
    children.length === 1
      ? 'grid-cols-1 max-w-sm mx-auto'
      : children.length === 2
      ? 'md:grid-cols-2 max-w-3xl mx-auto'
      : 'md:grid-cols-3';
  return (
    <section className="section max-md:max-w-[400px] mx-auto">
      <div className="container">
        <div className="space-y-10">
          <h3 className="text-base sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold xl:font-[800] bg-tertiary-gr text-gradient text-center">
            <span className="mr-2 sm:mr-4">
              <Image
                className="inline max-h-6 sm:max-h-9 lg:max-h-[55px] w-auto"
                src="/images/title-crown.png"
                alt="icon"
                width={55}
                height={55}
              />
            </span>
            <span>{title}</span>
          </h3>
          <div className={`grid gap-6 ${gridCols}`}>{children}</div>
        </div>
      </div>
    </section>
  );
}
