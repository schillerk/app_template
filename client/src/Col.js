import React from 'react';
import { Padding } from './Spacing';

export const Col = ({ children, size, ...spacingProps }) => {
  const width = `${100 * size / 12}%`;
  return (
    <div style={{ width: width }}>
  		<Padding {...spacingProps}>
	      {children}
		  </Padding>
    </div>
  );
}
