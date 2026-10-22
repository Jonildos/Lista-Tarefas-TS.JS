import * as fs from 'fs';
import * as path from 'path';

// 1. Definição estrita dos estados possíveis
export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE' | 'ARCHIVED';

export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
}

// 2. Matriz de transição de estados (Regra de Negócio Blindada)
const VALID_TRANSITIONS: Record<TaskStatus, TaskStatus[]> = {
  TODO: ['IN_PROGRESS', 'ARCHIVED'],
  IN_PROGRESS: ['DONE', 'TODO', 'ARCHIVED'],
  DONE: ['ARCHIVED'],
  ARCHIVED: [] // Estado final, sem saídas
};

const DB_PATH = path.join(__dirname, '..', 'tasks.json');

export class TaskManager {
  private tasks: Task[] = [];

  constructor() {
    this.loadFromFile();
  }

  private loadFromFile() {
    if (fs.existsSync(DB_PATH)) {
      const data = fs.readFileSync(DB_PATH, 'utf-8');
      try {
        this.tasks = JSON.parse(data);
      } catch (e) {
        this.tasks = [];
      }
    }
  }

  private saveToFile() {
    fs.writeFileSync(DB_PATH, JSON.stringify(this.tasks, null, 2), 'utf-8');
  }

  public addTask(title: string): void {
    const newTask: Task = {
      id: Math.random().toString(36).substring(2, 9),
      title,
      status: 'TODO',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.tasks.push(newTask);
    this.saveToFile();
    console.log(`[SUCESSO] Tarefa criada com ID [${newTask.id}]: "${title}"`);
  }

  public changeStatus(id: string, newStatus: TaskStatus): void {
    const task = this.tasks.find(t => t.id === id);
    if (!task) {
      console.error(`[ERRO] Tarefa com ID ${id} não encontrada.`);
      return;
    }

    const allowedTransitions = VALID_TRANSITIONS[task.status];
    
    if (!allowedTransitions.includes(newStatus)) {
      console.error(`[ERRO DE TRANSIÇÃO] Transição negada: de [${task.status}] para [${newStatus}] é inválida.`);
      return;
    }

    const oldStatus = task.status;
    task.status = newStatus;
    task.updatedAt = new Date().toISOString();
    this.saveToFile();
    console.log(`[SUCESSO] Tarefa ${id} movida de ${oldStatus} para ${newStatus}`);
  }

  public listTasks(): void {
    console.table(this.tasks);
  }
}

const manager = new TaskManager();

 manager.addTask("Estudar TypeScript Avançado");
 manager.addTask("Enviar currículos no LinkedIn");
 manager.listTasks();