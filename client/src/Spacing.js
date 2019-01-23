import React from 'react';

export const Padding = (props) => <Spacing property="padding" {...props} />

export const Margin = (props) => <Spacing property="margin" {...props} />

const parseSpacing = (val) => typeof val === "number" ? `${val || 0}px` : val || '0';

const Spacing = ({
  children,
  property,
  all,
  sides,
  ends,
  top,
  right,
  bottom,
  left
}) => {
  const padding = `
    ${parseSpacing([top, ends, all].find(x => x))}
    ${parseSpacing([right, sides, all].find(x => x))}
    ${parseSpacing([bottom, ends, all].find(x => x))}
    ${parseSpacing([left, sides, all].find(x => x))}
  `;

  return (
    <div className="spacing" style={{[property]: padding}}>
      {children}
    </div>
  );
}
