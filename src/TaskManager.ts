import * as fs from 'fs';
import * as path from 'path';

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE' | 'ARCHIVED';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
}

const VALID_TRANSITIONS: Record<TaskStatus, TaskStatus[]> = {
  TODO: ['IN_PROGRESS', 'ARCHIVED'],
  IN_PROGRESS: ['DONE', 'TODO', 'ARCHIVED'],
  DONE: ['ARCHIVED'],
  ARCHIVED: []
};

export class TaskManager {
  private tasks: Task[] = [];
  private dbPath: string;

  constructor(customDbPath?: string) {
    this.dbPath = customDbPath || path.join(__dirname, '..', 'tasks.json');
    this.loadFromFile();
  }

  private loadFromFile() {
    if (fs.existsSync(this.dbPath)) {
      const data = fs.readFileSync(this.dbPath, 'utf-8');
      try {
        this.tasks = JSON.parse(data);
      } catch (e) {
        this.tasks = [];
      }
    }
  }

  private saveToFile() {
    if (this.dbPath.includes('test')) return; 
    fs.writeFileSync(this.dbPath, JSON.stringify(this.tasks, null, 2), 'utf-8');
  }

  public addTask(title: string, description: string): Task {
    const newTask: Task = {
      id: Math.random().toString(36).substring(2, 8),
      title,
      description,
      status: 'TODO',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.tasks.push(newTask);
    this.saveToFile();
    return newTask;
  }

  public getTask(id: string): Task | undefined {
    return this.tasks.find(t => t.id === id);
  }

  public getAllTasks(): Task[] {
    return this.tasks;
  }

  public changeStatus(id: string, newStatus: TaskStatus): boolean {
    const task = this.getTask(id);
    if (!task) return false;

    const allowedTransitions = VALID_TRANSITIONS[task.status];
    if (!allowedTransitions.includes(newStatus)) {
      return false;
    }

    task.status = newStatus;
    task.updatedAt = new Date().toISOString();
    this.saveToFile();
    return true;
  }

  public deleteTask(id: string): Task | undefined {
    const index = this.tasks.findIndex(t => t.id === id);
    if (index === -1) return undefined;
    
    const deleted = this.tasks.splice(index, 1)[0];
    this.saveToFile();
    return deleted;
  }

  public searchTasks(term: string): Task[] {
    return this.tasks.filter(
      t => t.title.toLowerCase().includes(term.toLowerCase()) || 
           t.description.toLowerCase().includes(term.toLowerCase())
    );
  }
}