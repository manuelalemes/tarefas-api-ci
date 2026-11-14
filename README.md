# Tarefas API

API REST de tarefas (Express + TypeScript + SQLite) usada para demonstrar um pipeline de
Integração Contínua com GitHub Actions.

## Endpoints

| Método | Rota         | Descrição           |
| ------ | ------------ | ------------------- |
| GET    | /health      | Verifica a API      |
| GET    | /tarefas     | Lista tarefas       |
| GET    | /tarefas/:id | Busca uma tarefa    |
| POST   | /tarefas     | Cria uma tarefa     |
| PUT    | /tarefas/:id | Atualiza uma tarefa |
| DELETE | /tarefas/:id | Remove uma tarefa   |

## Scripts

`npm run lint` · `npm run format:check` · `npm run typecheck` · `npm run build` ·
`npm run test:unit` · `npm run test:integration` · `npm run audit:security`

## Pipeline (.github/workflows/ci.yml)

Gatilho: Pull Request para `main`. Jobs: `lint` → `security` → `build` → `test` → `docker`.

## Executar com Docker

```bash
docker build -t tarefas-api .
docker run -p 3000:3000 tarefas-api
```

Pipeline de CI validado via Pull Request.
