import React from 'react';

const MTWrapper = ({ component: Component, ...rest }) => {
  const { children, ...additionalProps } = rest;
  const commonProps = {
    placeholder: undefined,
    onPointerEnterCapture: undefined,
    onPointerLeaveCapture: undefined,
  };

  return (
    <Component {...commonProps} {...additionalProps}>
      {children}
    </Component>
  );
};

export default MTWrapper;
