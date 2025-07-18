import React from 'react';

const SkeletonComponent = ({ count, ref, className = '', variant = 'primary' }: any) => {
  const variants = {
    primary: 'bg-black-600',
    secondary: 'bg-black-250',
    white: 'bg-black',
  };
  return [...Array(count)].map((_, index) => (
    <div ref={ref} key={index} className={`skeleton ${variants[variant]} animate-pulse rounded-lg ${className}`} />
  ));
};

export default SkeletonComponent;
