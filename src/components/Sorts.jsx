import React from 'react';

function Sorts({ sort, onChange }) {
  return (
    <div>
      <select value={sort.by} onChange={e => onChange({ ...sort, by: e.target.value })}>
        <option value="createdAt">По дате создания</option>
        <option value="deadline">По дедлайну</option>
        <option value="priority">По приоритету</option>
      </select>
      <select value={sort.dir} onChange={e => onChange({ ...sort, dir: e.target.value })}>
        <option value="DESC">По убыванию</option>
        <option value="ASC">По возрастанию</option>
      </select>
    </div>
  );
}

export default Sorts;