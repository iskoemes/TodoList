// src/components/TrashBin.jsx
import React from 'react';
import format from 'date-fns/format';

function TrashBin({ deletedTasks, onRestore, onClose, onClear }) {
  const handleClear = () => {
    if (window.confirm('Вы уверены, что хотите очистить корзину? Задачи удалятся навсегда.')) {
      onClear();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>Корзина</h2>
        {deletedTasks.length === 0 ? (
          <p>Корзина пуста</p>
        ) : (
          <>
            {deletedTasks.map(task => (
              <div key={task.id} style={{ marginBottom: '10px', padding: '10px', border: '1px solid #ccc' }}>
                <p>{task.title} - Удалено: {format(new Date(task.deletionDate), 'dd.MM.yyyy HH:mm')}</p>
                <button onClick={() => onRestore(task.id)}>Восстановить</button>
              </div>
            ))}
            <button onClick={handleClear} style={{ marginTop: '20px', background: 'red', color: 'white' }}>Очистить корзину</button>
          </>
        )}
        <button onClick={onClose}>Закрыть</button>
      </div>
    </div>
  );
}

export default TrashBin;