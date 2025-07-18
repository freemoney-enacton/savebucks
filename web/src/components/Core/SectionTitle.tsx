import React from 'react';

export default function SectionTitle({ sub_title, title, customClass, subTitleClass, spanClass, as }: any) {
  const Tag = as || 'h2';
  const handleTextFormate = (title) => {
    return title?.split(/(\|.*?\|)/);
  };

  return (
    <div>
      <Tag
        className={`text-xl sm:text-3xl xl:text-4xl font-bold bg-white-heading-gr text-gradient text-center ${
          customClass ? customClass : ''
        }`}
      >
        {handleTextFormate(title)?.map((part, index) =>
          part.startsWith('|') && part.endsWith('|') ? (
            <span key={index} className={`bg-primary-gr text-gradient ${spanClass ? spanClass : ''}`}>
              {part.slice(1, -1)}
            </span>
          ) : (
            <span key={index}>{part}</span>
          )
        )}
      </Tag>
      {sub_title && (
        <div className={`text-xl font-semibold bg-white-heading-gr text-gradient text-center ${subTitleClass ? subTitleClass : ''}`}>
          {handleTextFormate(sub_title)?.map((part, index) =>
            part.startsWith('|') && part.endsWith('|') ? (
              <span key={index} className="bg-primary-gr text-gradient">
                {part.slice(1, -1)}
              </span>
            ) : (
              <span key={index}>
                {part}
              </span>
            )
          )}
        </div>
      )}
    </div>
  );
}
