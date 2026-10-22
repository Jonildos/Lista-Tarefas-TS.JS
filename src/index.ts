import { TaskManager, TaskStatus } from './TaskManager';

const manager = new TaskManager();
const args = process.argv.slice(2);
const command = args[0];
const subArg1 = args[1];
const subArg2 = args[2];

switch (command) {
  case 'list': {
    const page = subArg1 ? parseInt(subArg1, 10) : 1;
    const validPage = isNaN(page) ? 1 : page;
    const pageSize = 10;
    const tasks = manager.getAllTasks();
    
    const startIndex = (validPage - 1) * pageSize;
    const paginatedTasks = tasks.slice(startIndex, startIndex + pageSize);
    
    console.log(`\n--- Página ${validPage} (Mostrando ${paginatedTasks.length} de ${tasks.length} tarefas totais) ---`);
    if (paginatedTasks.length === 0) {
      console.log("Nenhuma tarefa encontrada nesta página.");
      break;
    }
    console.table(paginatedTasks.map(t => ({ ID: t.id, Título: t.title, Status: t.status })));
    break;
  }
  
  case 'get':
    if (!subArg1) {
      console.log('Uso correto: npx tsx src/index.ts get <id>');
    } else {
      const task = manager.getTask(subArg1);
      if (!task) {
        console.error(`[ERRO] Tarefa com ID [${subArg1}] não encontrada.`);
      } else {
        console.log('\n--- Detalhes da Tarefa ---');
        console.log(task);
      }
    }
    break;
  
  case 'post':
    if (!subArg1) {
      console.log('Uso correto: npx tsx src/index.ts post "Título" "Descrição opcional"');
    } else {
      const newTask = manager.addTask(subArg1, subArg2 || '');
      console.log(`[SUCESSO] Tarefa criada com ID [${newTask.id}]: "${newTask.title}" (Status: TODO)`);
    }
    break;
  
  case 'status':
    if (!subArg1 || !subArg2) {
      console.log('Uso correto: npx tsx src/index.ts status <id> <TODO|IN_PROGRESS|DONE|ARCHIVED>');
    } else {
      const success = manager.changeStatus(subArg1, subArg2.toUpperCase() as TaskStatus);
      if (!success) {
        console.error(`[ERRO DE TRANSIÇÃO] Transição negada ou tarefa não encontrada.`);
      } else {
        console.log(`[SUCESSO] Tarefa ${subArg1} movida para ${subArg2.toUpperCase()}`);
      }
    }
    break;
  
  case 'delete':
    if (!subArg1) {
      console.log('Uso correto: npx tsx src/index.ts delete <id>');
    } else {
      const deleted = manager.deleteTask(subArg1);
      if (!deleted) {
        console.error(`[ERRO] Tarefa com ID [${subArg1}] não encontrada.`);
      } else {
        console.log(`[SUCESSO] Tarefa [${subArg1}] ("${deleted.title}") deletada com sucesso.`);
      }
    }
    break;

  case 'search': {
    if (!subArg1) {
      console.log('Uso correto: npx tsx src/index.ts search <termo>');
    } else {
      const results = manager.searchTasks(subArg1);
      console.log(`\n--- Resultados da busca por: "${subArg1}" (${results.length} encontrados) ---`);
      if (results.length > 0) {
        console.table(results.map(t => ({ ID: t.id, Título: t.title, Status: t.status })));
      }
    }
    break;
  }

  default:
    console.log(`
========================================
  GERENCIADOR DE TAREFAS - CLI (TS)
========================================
Comandos disponíveis:
  - Listar:    npx tsx src/index.ts list [pagina]
  - Detalhes:  npx tsx src/index.ts get <id>
  - Criar:     npx tsx src/index.ts post "Título" "Descrição"
  - Status:    npx tsx src/index.ts status <id> <novo_estado>
  - Deletar:   npx tsx src/index.ts delete <id>
  - Buscar:    npx tsx src/index.ts search <termo>
    `);
}