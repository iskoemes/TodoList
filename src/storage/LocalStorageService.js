import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'todoAppData';

class LocalStorageService {
  getData() {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : { tasks: [], settings: { theme: 'light' } };
  }

  saveData(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  addTask(task) {
    const data = this.getData();
    task.id = uuidv4();
    task.createdAt = new Date().toISOString();
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
    data.tasks = data.tasks.filter(t => t.id !== id);
    this.saveData(data);
  }

  deleteTasks(ids) {
    const data = this.getData();
    data.tasks = data.tasks.filter(t => !ids.includes(t.id));
    this.saveData(data);
  }

  updateSettings(settings) {
    const data = this.getData();
    data.settings = { ...data.settings, ...settings };
    this.saveData(data);
  }
}

export default new LocalStorageService();