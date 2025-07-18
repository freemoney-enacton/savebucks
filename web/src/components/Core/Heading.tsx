import React from 'react';

export default function Heading({ title, customClass }: { title: string; customClass?: string }) {
  const handleTextFormate = (title) => {
    return title.split(/(\|.*?\|)/);
  };
  return (
    <h1
      className={`text-2xl sm:text-3xl font-bold !leading-[1.3] bg-white-heading-gr text-gradient ${
        customClass ? customClass : ''
      }`}
    >
      {handleTextFormate(title).map((part, index) =>
        part.startsWith('|') && part.endsWith('|') ? (
          <span key={index} className="bg-primary-gr text-gradient">
            {part.slice(1, -1)}
          </span>
        ) : (
          <span key={index}>{part}</span>
        )
      )}
    </h1>
  );
}
