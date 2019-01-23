import React from 'react';

export const TextInput = ({ value, onChange, onFocus, onBlur, spellCheck }) =>
  <input
    className="text-input"
    type="text"
    value={value}
    onChange={onChange}
    onFocus={onFocus}
    onBlur={onBlur}
    spellcheck={spellCheck}
  />
