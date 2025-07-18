import React from 'react';

export default function FormTitle({ title, customClass }: any) {
  return (
    <h3 className={`text-lg font-bold bg-white-heading-gr text-gradient w-fit ${customClass ? customClass : ''}`}>{title}</h3>
  );
}
