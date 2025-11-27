// src/components/ThemeToggle.jsx
import React from 'react';

function ThemeToggle({ theme, onChange }) {
  return (
    <button onClick={() => onChange(theme === 'light' ? 'dark' : 'light')}>
      {theme === 'light' ? 'Тёмная тема' : 'Светлая тема'}
    </button>
  );
}

export default ThemeToggle;