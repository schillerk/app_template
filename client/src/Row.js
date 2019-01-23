import React from 'react';

export const Row = ({ children }) => <div className="row">{children}</div>

export const SpacedRow = ({ children }) =>
  <div className="row row--spaced">{children}</div>

export const RowRight = ({ children }) =>
  <div className="row__right">{children}</div>
