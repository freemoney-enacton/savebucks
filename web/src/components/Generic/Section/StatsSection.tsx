import React from 'react';
export default function StatsSection({ children }) {
  return (
    <section className="section overflow-x-clip">
      <div className="container">
        <div className="relative grid md:grid-cols-3 gap-6 max-w-[270px] sm:max-w-[400px] md:max-w-full  mx-auto">{children}</div>
      </div>
    </section>
  );
}
