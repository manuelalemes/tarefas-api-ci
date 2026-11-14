import express, { Request, Response } from "express";
import type { Db } from "./db";
import { validateTarefa } from "./validators";

interface TarefaRow {
  id: number;
  titulo: string;
  descricao: string;
  concluida: number;
  criada_em: string;
}

const toApi = (row: TarefaRow) => ({ ...row, concluida: row.concluida === 1 });

export function createApp(db: Db) {
  const app = express();
  app.use(express.json());

  app.get("/health", (_req: Request, res: Response) => {
    res.json({ status: "ok" });
  });

  app.get("/tarefas", (_req: Request, res: Response) => {
    const rows = db.prepare("SELECT * FROM tarefas ORDER BY id").all() as TarefaRow[];
    res.json(rows.map(toApi));
  });

  app.get("/tarefas/:id", (req: Request, res: Response) => {
    const row = db
      .prepare("SELECT * FROM tarefas WHERE id = ?")
      .get(Number(req.params.id)) as TarefaRow | undefined;
    if (!row) return res.status(404).json({ erro: "Tarefa não encontrada" });
    res.json(toApi(row));
  });

  app.post("/tarefas", (req: Request, res: Response) => {
    const result = validateTarefa(req.body);
    if (!result.ok) return res.status(400).json({ erro: result.error });
    const { titulo, descricao, concluida } = result.value;
    const info = db
      .prepare("INSERT INTO tarefas (titulo, descricao, concluida) VALUES (?, ?, ?)")
      .run(titulo, descricao, concluida ? 1 : 0);
    const row = db
      .prepare("SELECT * FROM tarefas WHERE id = ?")
      .get(info.lastInsertRowid) as TarefaRow;
    res.status(201).json(toApi(row));
  });

  app.put("/tarefas/:id", (req: Request, res: Response) => {
    const result = validateTarefa(req.body);
    if (!result.ok) return res.status(400).json({ erro: result.error });
    const { titulo, descricao, concluida } = result.value;
    const id = Number(req.params.id);
    const info = db
      .prepare("UPDATE tarefas SET titulo = ?, descricao = ?, concluida = ? WHERE id = ?")
      .run(titulo, descricao, concluida ? 1 : 0, id);
    if (info.changes === 0)
      return res.status(404).json({ erro: "Tarefa não encontrada" });
    const row = db.prepare("SELECT * FROM tarefas WHERE id = ?").get(id) as TarefaRow;
    res.json(toApi(row));
  });

  app.delete("/tarefas/:id", (req: Request, res: Response) => {
    const info = db
      .prepare("DELETE FROM tarefas WHERE id = ?")
      .run(Number(req.params.id));
    if (info.changes === 0)
      return res.status(404).json({ erro: "Tarefa não encontrada" });
    res.status(204).send();
  });

  return app;
}
