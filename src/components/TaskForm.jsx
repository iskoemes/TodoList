import React, { useState, useEffect } from 'react';

function TaskForm({ task, onSave, onClose }) {
  const [title, setTitle] = useState(task.title || '');
  const [description, setDescription] = useState(task.description || '');
  const [priority, setPriority] = useState(task.priority || 'low');
  const [deadline, setDeadline] = useState(task.deadline ? task.deadline.slice(0,10) : ''); // yyyy-mm-dd

  useEffect(() => {
    setTitle(task.title || '');
    setDescription(task.description || '');
    setPriority(task.priority || 'low');
    setDeadline(task.deadline ? task.deadline.slice(0,10) : '');
  }, [task]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...task,
      title,
      description,
      priority,
      deadline: deadline ? new Date(deadline).toISOString() : null
    });
  };

  return (
    <div className='modal-overlay'>
    <div className="modal">
      <form onSubmit={handleSubmit} className="task-form">
        <h2>{task.id ? "Редактировать" : "Создать"} задачу</h2>
        <input
          type="text"
          placeholder="Название"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Описание"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
        <select value={priority} onChange={e => setPriority(e.target.value)}>
          <option value="low">Низкий</option>
          <option value="medium">Средний</option>
          <option value="high">Высокий</option>
        </select>
        <input
          type="date"
          value={deadline}
          onChange={e => setDeadline(e.target.value)}
        />
        <button type="submit">Сохранить</button>
        <button type="button" onClick={onClose}>Отмена</button>
      </form>
    </div>
    </div>
  );
}

export default TaskForm;
