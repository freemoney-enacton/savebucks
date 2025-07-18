import React from 'react';

export default function TableTitle({ title }: { title?: string }) {
  return <h3 className="bg-white-heading-gr text-gradient text-sm sm:text-2xl font-semibold sm:font-medium">{title}</h3>;
}
