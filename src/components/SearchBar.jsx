// src/components/SearchBar.jsx
import React from 'react';

function SearchBar({ value, onChange }) {
  return <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder="Поиск по заголовку" />;
}

export default SearchBar;