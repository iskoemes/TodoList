// src/storage/LocalStorageService.js
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'todoAppData';

class LocalStorageService {
  getData() {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : { tasks: [], deletedTasks: [], settings: { theme: 'light' } };
  }

  saveData(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  addTask(task) {
    const data = this.getData();
    task.id = uuidv4();
    task.createdAt = new Date().toISOString();
    task.editHistory = [];
    data.tasks.push(task);
    this.saveData(data);
    return task;
  }

  updateTask(updatedTask) {
    const data = this.getData();
    data.tasks = data.tasks.map(t => t.id === updatedTask.id ? updatedTask : t);
    this.saveData(data);
  }

  deleteTask(id) {
    const data = this.getData();
    const taskToDelete = data.tasks.find(t => t.id === id);
    if (taskToDelete) {
      taskToDelete.deletionDate = new Date().toISOString();
      data.deletedTasks = data.deletedTasks || [];
      data.deletedTasks.push(taskToDelete);
      data.tasks = data.tasks.filter(t => t.id !== id);
      this.saveData(data);
    }
  }

  deleteTasks(ids) {
    const data = this.getData();
    const tasksToDelete = data.tasks.filter(t => ids.includes(t.id));
    tasksToDelete.forEach(task => {
      task.deletionDate = new Date().toISOString();
    });
    data.deletedTasks = [...(data.deletedTasks || []), ...tasksToDelete];
    data.tasks = data.tasks.filter(t => !ids.includes(t.id));
    this.saveData(data);
  }

  restoreTask(id) {
    const data = this.getData();
    const taskToRestore = data.deletedTasks.find(t => t.id === id);
    if (taskToRestore) {
      delete taskToRestore.deletionDate;
      data.tasks.push(taskToRestore);
      data.deletedTasks = data.deletedTasks.filter(t => t.id !== id);
      this.saveData(data);
    }
    return data.tasks;
  }

  clearDeletedTasks() {
    const data = this.getData();
    data.deletedTasks = [];
    this.saveData(data);
  }

  updateSettings(settings) {
    const data = this.getData();
    data.settings = { ...data.settings, ...settings };
    this.saveData(data);
  }
}

export default new LocalStorageService();