import React from 'react';
import { twMerge } from 'tailwind-merge';

const Card = ({
  children,
  className = '',
  as = 'div',
  variant = 'default',
  size = 'md',
}: {
  children: any;
  className?: any;
  as?: 'div' | 'section';
  variant?: 'default' | 'outline' | 'white';
  size?: 'lg' | 'md' | 'sm';
}) => {
  const Tag = as;
  const sizes = {
    lg: 'p-4 sm:p-7 rounded-lg',
    md: 'p-5 rounded-lg',
    sm: 'p-3 rounded-lg',
  };
  const variants = {
    default: 'bg-black-250 border border-gray-400',
    outline: 'bg-transparent border border-gray-400',
    white: 'bg-black',
  };

  return <Tag className={twMerge(variants[variant], sizes[size], className, 'animate-fade-in')}>{children}</Tag>;
};

export default Card;
