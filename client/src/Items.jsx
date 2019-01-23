import React from 'react';

export const Items = ({ items }) =>
  items.map((item, i) => <div key={i}>{item}</div>)