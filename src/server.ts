import { createApp } from "./app";
import { createDb } from "./db";

const port = Number(process.env.PORT ?? 3000);
const db = createDb(process.env.DB_FILE ?? "tarefas.db");

createApp(db).listen(port, () => {
  console.log(`API de tarefas ouvindo na porta ${port}`);
});
