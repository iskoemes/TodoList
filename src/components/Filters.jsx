// src/components/Filters.jsx
import React from 'react';

function Filters({ filters, onChange }) {
  return (
    <div>
      <select value={filters.status} onChange={e => onChange({ ...filters, status: e.target.value })}>
        <option value="">Все статусы</option>
        <option value="todo">To Do</option>
        <option value="in-progress">In Progress</option>
        <option value="completed">Completed</option>
      </select>
      <select value={filters.priority} onChange={e => onChange({ ...filters, priority: e.target.value })}>
        <option value="">Все приоритеты</option>
        <option value="low">Низкий</option>
        <option value="medium">Средний</option>
        <option value="high">Высокий</option>
      </select>
      <label>
        <input type="checkbox" checked={filters.hasDeadline} onChange={e => onChange({ ...filters, hasDeadline: e.target.checked })} />
        С дедлайном
      </label>
      <label>
        <input type="checkbox" checked={filters.overdue} onChange={e => onChange({ ...filters, overdue: e.target.checked })} />
        Просроченные
      </label>
    </div>
  );
}

export default Filters;