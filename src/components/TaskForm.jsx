import React, { useState, useEffect } from 'react';


function TaskForm({ task = {}, onSave, onClose }) {
  const [title, setTitle] = useState(task.title || '');
  const [description, setDescription] = useState(task.description || '');
  const [priority, setPriority] = useState(task.priority || 'low');
  const [deadline, setDeadline] = useState(task.deadline ? task.deadline.slice(0, 10) : '');
  const [status, setStatus] = useState(task.status || 'todo');

  // Обновляем локальный стейт при изменении task
  useEffect(() => {
    setTitle(task.title || '');
    setDescription(task.description || '');
    setPriority(task.priority || 'low');
    setDeadline(task.deadline ? task.deadline.slice(0, 10) : '');
    setStatus(task.status || 'todo');
  }, [task]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...task,
      title,
      description,
      priority,
      status,
      deadline: deadline ? new Date(deadline).toISOString() : null,
      createdAt: task.createdAt || new Date().toISOString(),
    });
  };

  return (
   <div className="modal-overlay" onClick={onClose}>
  <div className="modal" onClick={(e) => e.stopPropagation()}>
    <h2>{task.id ? 'Редактировать задачу' : 'Создать задачу'}</h2>
    <form onSubmit={handleSubmit} className="task-form">
      <input
        type="text"
        placeholder="Название"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        placeholder="Описание"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <select value={priority} onChange={(e) => setPriority(e.target.value)}>
        <option value="low">Низкий</option>
        <option value="medium">Средний</option>
        <option value="high">Высокий</option>
      </select>
      <input
        type="date"
        value={deadline}
        onChange={(e) => setDeadline(e.target.value)}
      />
      <select value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="todo">To Do</option>
        <option value="in-progress">In Progress</option>
        <option value="completed">Completed</option>
      </select>
      <div className="modal-buttons">
        <button type="submit">Сохранить</button>
        <button type="button" onClick={onClose}>Отмена</button>
      </div>
    </form>
  </div>
</div>

  );
}

export default TaskForm;
