import React, { useState } from 'react';
import format from 'date-fns/format';
import isAfter from 'date-fns/isAfter';

function TaskCard({ task, onUpdate, onDelete, onEdit, isSelected, onSelect }) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const isOverdue = task.deadline && isAfter(new Date(), new Date(task.deadline)) && task.status !== 'completed';
  const priorityColors = { low: 'green', medium: 'yellow', high: 'red' };

  const handleDelete = () => {
    onDelete(task.id);
    setConfirmOpen(false);
  };

  return (
    <div className={`card ${isOverdue ? 'overdue' : ''}`} style={{ borderColor: priorityColors[task.priority] }}>
      <input type="checkbox" checked={isSelected} onChange={e => onSelect(e.target.checked)} />
      <h3>{task.title}</h3>
      <p>{task.description?.substring(0, 100) || ''}{task.description?.length > 100 ? '…' : ''}</p>
      <span>Приоритет: {task.priority}</span>
      {task.deadline && <span>Дедлайн: {format(new Date(task.deadline), 'dd.MM.yyyy')}</span>}
      {isOverdue && <span>⚠️ Просрочено</span>}

      <button onClick={onEdit}>Редактировать</button>
      <button onClick={() => setConfirmOpen(true)}>Удалить</button>

      {confirmOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <p>Вы уверены, что хотите удалить задачу "{task.title}"?</p>
            <button onClick={handleDelete}>Да</button>
            <button onClick={() => setConfirmOpen(false)}>Нет</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default TaskCard;
