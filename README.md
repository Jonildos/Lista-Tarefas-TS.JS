# Task CLI Manager (TypeScript)

> Um gerenciador de tarefas de linha de comando (CLI) robusto, desenvolvido em TypeScript, estruturado com forte tipagem, separação de responsabilidades (Clean Architecture) e uma **Máquina de Estados Finita (FSM)** para blindagem de regras de negócio.

---

## Tecnologias Utilizadas

* **TypeScript** (Tipagem estrita, interfaces e *Discriminated Unions*)
* **Node.js** (Manipulação nativa de sistema de arquivos com `fs`)
* **TSX** (Execução rápida de TypeScript sem build manual)
* **Vitest** (Testes unitários automatizados)

---

## Arquitetura e Diferenciais

Diferente de listas de tarefas comuns (CRUDs básicos), este projeto implementa uma **Matriz de Transição de Estados** que impede inconsistências lógicas no domínio:

* **`TODO`** $\rightarrow$ Pode ir para `IN_PROGRESS` ou `ARCHIVED`
* **`IN_PROGRESS`** $\rightarrow$ Pode ir para `DONE`, voltar para `TODO` ou ser `ARCHIVED`
* **`DONE`** $\rightarrow$ Só pode ir para `ARCHIVED` (Histórico)
* **`ARCHIVED`** $\rightarrow$ Estado terminal (imutável)

---

## Como Executar o Projeto

1. **Clone o repositório:**
   ```bash
   git clone [https://github.com/Jonildos/Lista-Tarefas-TS.JS.git](https://github.com/Jonildos/Lista-Tarefas-TS.JS.git)
   cd Lista-Tarefas-TS.JS
2. **Instale as dependencias**
    ```bash
    npm install
3. **Execute os testes unitários**
    ```bash
    npm test

## Comandos CLI

- Criar tarefa
npx tsx src/index.ts post "Título da Tarefa" "Descrição detalhada"

- Listar Tarefas
npx tsx src/index.ts list 1

- Ver detalhes de uma tarefa
npx tsx src/index.ts get <id>

- Mudar Status de uma tarefa
npx tsx src/index.ts status <id> IN_PROGRESS

- Buscar tarefas por termo
npx tsx src/index.ts search "TypeScript"

- Deletar tarefa
npx tsx src/index.ts delete <id>


Desenvolvido por Jonas Soares como parte de portfólio de engenharia de software e arquitetura de sistemas.