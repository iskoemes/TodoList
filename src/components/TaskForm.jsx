import React, { useState } from 'react';

function TaskForm({ task = {}, onSave, onClose }) {
  const [form, setForm] = useState({
    title: task.title || '',
    description: task.description || '',
    deadline: task.deadline ? task.deadline.split('T')[0] : '',
    priority: task.priority || 'medium',
    status: task.status || 'todo',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (e.target.name === 'title' && !e.target.value.trim()) setError('Заголовок обязателен');
    else setError('');
  };

  const handleSubmit = () => {
    if (!form.title.trim()) return setError('Заголовок обязателен');
    const saved = { ...form, deadline: form.deadline ? new Date(form.deadline).toISOString() : null };
    onSave(saved);
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <input name="title" value={form.title} onChange={handleChange} placeholder="Заголовок" />
        <textarea name="description" value={form.description} onChange={handleChange} placeholder="Описание" />
        <input type="date" name="deadline" value={form.deadline} onChange={handleChange} />
        <select name="priority" value={form.priority} onChange={handleChange}>
          <option value="low">Низкий</option>
          <option value="medium">Средний</option>
          <option value="high">Высокий</option>
        </select>
        {task.id && (
          <select name="status" value={form.status} onChange={handleChange}>
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        )}
        {error && <p className="error">{error}</p>}
        <button disabled={!!error || !form.title.trim()} onClick={handleSubmit}>Сохранить</button>
        <button onClick={onClose}>Закрыть</button>
      </div>
    </div>
  );
}

export default TaskForm;