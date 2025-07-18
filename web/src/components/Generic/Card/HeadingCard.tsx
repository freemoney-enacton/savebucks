import React from 'react';

const HeadingCard = ({ title, sub_title }) => {
  const handleTextFormate = (title) => {
    return title.split(/(\|.*?\|)/);
  };

  return (
    <div className="container">
      <h1 className="text-2xl sm:text-3xl lg:text-5xl font-bold bg-white-heading-gr text-gradient text-center !leading-[1.2]">
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
      {sub_title && (
        <h1 className="text-2xl sm:text-3xl lg:text-5xl font-bold bg-white-heading-gr text-gradient text-center !leading-[1.2]">
          {handleTextFormate(sub_title).map((part, index) =>
            part.startsWith('|') && part.endsWith('|') ? (
              <span key={index} className="bg-primary-gr text-gradient">
                {part.slice(1, -1)}
              </span>
            ) : (
              <span key={index}>{part}</span>
            )
          )}
        </h1>
      )}
    </div>
  );
};

export default HeadingCard;
