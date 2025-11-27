// src/App.jsx
import React, { useState, useEffect } from 'react';
import LocalStorageService from './storage/LocalStorageService';
import TaskList from './components/TaskList';
import CreateButton from './components/CreateButton';
import ThemeToggle from './components/ThemeToggle';
import SearchBar from './components/SearchBar';
import Filters from './components/Filters';
import Sorts from './components/Sorts';
import Footer from './components/Footer';
import TaskForm from './components/TaskForm'; 
import TrashBin from './components/TrashBin';
import EditHistoryModal from './components/EditHistoryModal';

function App() {
  const [tasks, setTasks] = useState([]);
  const [deletedTasks, setDeletedTasks] = useState([]);
  const [theme, setTheme] = useState('light');
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ status: '', priority: '', hasDeadline: false, overdue: false });
  const [sort, setSort] = useState({ by: 'createdAt', dir: 'DESC' });
  const [selectedIds, setSelectedIds] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [showTrash, setShowTrash] = useState(false);
  const [showHistoryForTask, setShowHistoryForTask] = useState(null);

  useEffect(() => {
    const data = LocalStorageService.getData();
    setTasks(data.tasks);
    setDeletedTasks(data.deletedTasks || []);
    setTheme(data.settings.theme);
    document.body.className = data.settings.theme;
  }, []);

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    LocalStorageService.updateSettings({ theme: newTheme });
    document.body.className = newTheme;
  };

  const getFilteredTasks = () => {
    let filtered = tasks.filter(task => {
      if (search && !task.title.toLowerCase().includes(search.toLowerCase())) return false;
      if (filters.status && task.status !== filters.status) return false;
      if (filters.priority && task.priority !== filters.priority) return false;
      if (filters.hasDeadline && !task.deadline) return false;
      if (filters.overdue && (!task.deadline || new Date(task.deadline) >= new Date() || task.status === 'completed')) return false;
      return true;
    });

    filtered.sort((a, b) => {
      let compare = 0;
      if (sort.by === 'createdAt') compare = new Date(a.createdAt) - new Date(b.createdAt);
      else if (sort.by === 'deadline') compare = (a.deadline ? new Date(a.deadline) : Infinity) - (b.deadline ? new Date(b.deadline) : Infinity);
      else if (sort.by === 'priority') {
        const prioMap = { low: 1, medium: 2, high: 3 };
        compare = prioMap[a.priority] - prioMap[b.priority];
      } else if (sort.by === 'status') compare = a.status.localeCompare(b.status);
      return sort.dir === 'DESC' ? -compare : compare;
    });

    return filtered;
  };

  const filteredTasks = getFilteredTasks();

  const handleDeleteSelected = () => {
    LocalStorageService.deleteTasks(selectedIds);
    const updatedData = LocalStorageService.getData();
    setTasks(updatedData.tasks);
    setDeletedTasks(updatedData.deletedTasks || []);
    setSelectedIds([]);
  };

  const handleRestore = (id) => {
    LocalStorageService.restoreTask(id);
    const updatedData = LocalStorageService.getData();
    setTasks(updatedData.tasks);
    setDeletedTasks(updatedData.deletedTasks || []);
  };

  const handleClearTrash = () => {
    LocalStorageService.clearDeletedTasks();
    setDeletedTasks([]);
  };

  const openModal = (task = null) => {
    setEditingTask(task);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingTask(null);
  };

  const handleSave = (savedTask) => {
    if (editingTask) {
      const oldTask = tasks.find(t => t.id === savedTask.id);
      const changes = [];
      if (savedTask.title !== oldTask.title) changes.push(`Название на "${savedTask.title}"`);
      if (savedTask.description !== oldTask.description) changes.push(`Описание`);
      if (savedTask.priority !== oldTask.priority) changes.push(`Приоритет на ${savedTask.priority}`);
      if (savedTask.deadline !== oldTask.deadline) changes.push(`Дедлайн`);
      if (savedTask.status !== oldTask.status) changes.push(`Статус на ${savedTask.status}`);
      if (changes.length > 0) {
        const changeStr = changes.join(', ');
        savedTask.editHistory = [...(oldTask.editHistory || []), { date: new Date().toISOString(), changes: changeStr }];
      }
      LocalStorageService.updateTask(savedTask);
      setTasks(tasks.map(t => t.id === savedTask.id ? savedTask : t));
    } else {
      const added = LocalStorageService.addTask(savedTask);
      setTasks([...tasks, added]);
    }
    closeModal();
  };

  return (
    <div className="app">
      <header>
        <CreateButton onClick={() => openModal()} />
        <ThemeToggle theme={theme} onChange={handleThemeChange} />
        <SearchBar value={search} onChange={setSearch} />
        <Filters filters={filters} onChange={setFilters} />
        <Sorts sort={sort} onChange={setSort} />
        {selectedIds.length > 0 && <button onClick={handleDeleteSelected}>Удалить выбранные</button>}
        <button onClick={() => setShowTrash(true)}>Корзина</button>
      </header>
      <TaskList
        tasks={filteredTasks}
        onUpdate={(updated) => {
          LocalStorageService.updateTask(updated);
          setTasks(tasks.map(t => t.id === updated.id ? updated : t));
        }}
        onDelete={(id) => {
          LocalStorageService.deleteTask(id);
          const updatedData = LocalStorageService.getData();
          setTasks(updatedData.tasks);
          setDeletedTasks(updatedData.deletedTasks || []);
        }}
        onEdit={openModal}
        selectedIds={selectedIds}
        onSelectChange={setSelectedIds}
        onShowHistory={(task) => setShowHistoryForTask(task)}
      />
      {modalOpen && (
        <TaskForm task={editingTask || {}} onSave={handleSave} onClose={closeModal} />
      )}
      {showTrash && (
        <TrashBin 
          deletedTasks={deletedTasks} 
          onRestore={handleRestore} 
          onClose={() => setShowTrash(false)} 
          onClear={handleClearTrash}
        />
      )}
      {showHistoryForTask && (
        <EditHistoryModal 
          task={showHistoryForTask} 
          onClose={() => setShowHistoryForTask(null)} 
        />
      )}
      <Footer />
    </div>
  );
}

export default App;