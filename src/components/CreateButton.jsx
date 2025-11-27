// src/components/CreateButton.jsx
import React from 'react';

function CreateButton({ onClick }) {
  return <button onClick={onClick}>Создать задачу</button>;
}

export default CreateButton;