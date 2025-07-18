'use client';
import React from 'react';

const IFrameSection = ({ SurveyURL }) => {
  return (
    <div className="iframe-parent">
      <iframe src={SurveyURL} className="w-full min-h-[calc(100vh-56px)] sm:min-h-[calc(100vh-88px)]"></iframe>
    </div>
  );
};

export default IFrameSection;
