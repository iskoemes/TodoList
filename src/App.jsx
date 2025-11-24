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

function App() {
  const [tasks, setTasks] = useState([]);
  const [theme, setTheme] = useState('light');
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ status: '', priority: '', hasDeadline: false, overdue: false });
  const [sort, setSort] = useState({ by: 'createdAt', dir: 'DESC' });
  const [selectedIds, setSelectedIds] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    const data = LocalStorageService.getData();
    setTasks(data.tasks);
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
    setTasks(tasks.filter(t => !selectedIds.includes(t.id)));
    setSelectedIds([]);
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
      </header>
      <TaskList
        tasks={filteredTasks}
        onUpdate={(updated) => {
          LocalStorageService.updateTask(updated);
          setTasks(tasks.map(t => t.id === updated.id ? updated : t));
        }}
        onDelete={(id) => {
          LocalStorageService.deleteTask(id);
          setTasks(tasks.filter(t => t.id !== id));
        }}
        onEdit={openModal}
        selectedIds={selectedIds}
        onSelectChange={setSelectedIds}
      />
      {modalOpen && (
        <TaskForm task={editingTask || {}} onSave={handleSave} onClose={closeModal} />
      )}
      <Footer />
    </div>
  );
}

export default App;