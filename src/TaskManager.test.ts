import { describe, it, expect, beforeEach } from 'vitest';
import { TaskManager } from './TaskManager';

describe('TaskManager - Máquina de Estados e Regras de Negócio', () => {
  let manager: TaskManager;

  beforeEach(() => {
    // Instancia um gerenciador isolado para cada teste
    manager = new TaskManager('test-db.json');
  });

  it('deve criar uma nova tarefa com o status inicial TODO', () => {
    const task = manager.addTask('Aprender Testes Unitários', 'Estudar Vitest e Jest');
    
    expect(task).toBeDefined();
    expect(task.status).toBe('TODO');
    expect(task.title).toBe('Aprender Testes Unitários');
  });

  it('deve permitir a transição válida de TODO para IN_PROGRESS', () => {
    const task = manager.addTask('Tarefa de Teste', 'Descrição');
    
    const success = manager.changeStatus(task.id, 'IN_PROGRESS');
    
    expect(success).toBe(true);
    expect(manager.getTask(task.id)?.status).toBe('IN_PROGRESS');
  });

  it('deve BLOQUEAR uma transição inválida (ex: de TODO direto para DONE)', () => {
    const task = manager.addTask('Tarefa de Teste', 'Descrição');
    
    // Tenta pular o estado IN_PROGRESS direto para DONE (Proibido pela regra)
    const success = manager.changeStatus(task.id, 'DONE');
    
    expect(success).toBe(false); // A máquina de estados barrou
    expect(manager.getTask(task.id)?.status).toBe('TODO'); // O status continua intacto
  });
});