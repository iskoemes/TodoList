import React from 'react';
import format from 'date-fns/format';
import isAfter from 'date-fns/isAfter';

function TaskCard({ task, onUpdate, onDelete, onEdit, isSelected, onSelect }) {
  const isOverdue = task.deadline && isAfter(new Date(), new Date(task.deadline)) && task.status !== 'completed';
  const priorityColors = { low: 'green', medium: 'yellow', high: 'red' };

  return (
    <div className={`card ${isOverdue ? 'overdue' : ''}`} style={{ borderColor: priorityColors[task.priority] }}>
      <input type="checkbox" checked={isSelected} onChange={e => onSelect(e.target.checked)} />
      <h3>{task.title}</h3>
      <p>{task.description?.substring(0, 100) || ''}{task.description?.length > 100 ? '…' : ''}</p>
      <span>Приоритет: {task.priority}</span>
      {task.deadline && <span>Дедлайн: {format(new Date(task.deadline), 'dd.MM.yyyy')}</span>}
      {isOverdue && <span>⚠️ Просрочено</span>}
      <select value={task.status} onChange={e => onUpdate({ ...task, status: e.target.value })}>
        <option value="todo">To Do</option>
        <option value="in-progress">In Progress</option>
        <option value="completed">Completed</option>
      </select>
      <button onClick={onEdit}>Редактировать</button>
      <button onClick={() => onDelete(task.id)}>Удалить</button>
    </div>
  );
}

export default TaskCard;