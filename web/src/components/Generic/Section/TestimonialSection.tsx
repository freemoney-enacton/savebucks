import React from 'react';
import SectionTitle from '../../Core/SectionTitle';

export default function TestimonialSection({ sub_title, title, children }: any) {
  return (
    <section className="section overflow-clip">
      <div className="container">
        <div className="space-y-10">
          <SectionTitle title={title} sub_title={sub_title} />
          {children}
        </div>
      </div>
    </section>
  );
}
