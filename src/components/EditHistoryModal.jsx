// src/components/EditHistoryModal.jsx
import React from 'react';
import format from 'date-fns/format';

function EditHistoryModal({ task, onClose }) {
  const history = task.editHistory || [];
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>История редактирований: {task.title}</h3>
        {history.length === 0 ? (
          <p>Нет редактирований</p>
        ) : (
          <ul>
            {history.slice().reverse().map((edit, index) => (
              <li key={index}>
                {format(new Date(edit.date), 'dd.MM.yyyy HH:mm')}: {edit.changes}
              </li>
            ))}
          </ul>
        )}
        <button onClick={onClose}>Закрыть</button>
      </div>
    </div>
  );
}

export default EditHistoryModal;