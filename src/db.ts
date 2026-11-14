import Database from "better-sqlite3";

export type Db = Database.Database;

export function createDb(file: string = ":memory:"): Db {
  const db = new Database(file);
  db.exec(`
    CREATE TABLE IF NOT EXISTS tarefas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      titulo TEXT NOT NULL,
      descricao TEXT NOT NULL DEFAULT '',
      concluida INTEGER NOT NULL DEFAULT 0,
      criada_em TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);
  return db;
}
