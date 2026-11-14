import { beforeEach, describe, expect, it } from "vitest";
import request from "supertest";
import { createApp } from "../../src/app";
import { createDb } from "../../src/db";

describe("API de tarefas (integração com banco SQL)", () => {
  let app: ReturnType<typeof createApp>;

  beforeEach(() => {
    app = createApp(createDb(":memory:"));
  });

  it("GET /health responde ok", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: "ok" });
  });

  it("cria e lista tarefas persistindo no banco", async () => {
    const created = await request(app)
      .post("/tarefas")
      .send({ titulo: "Configurar workflow", descricao: "GitHub Actions" });
    expect(created.status).toBe(201);
    expect(created.body).toMatchObject({
      id: 1,
      titulo: "Configurar workflow",
      concluida: false,
    });

    const list = await request(app).get("/tarefas");
    expect(list.status).toBe(200);
    expect(list.body).toHaveLength(1);
  });

  it("retorna 400 para dados inválidos", async () => {
    const res = await request(app).post("/tarefas").send({ titulo: "a" });
    expect(res.status).toBe(400);
  });

  it("busca, atualiza e remove uma tarefa", async () => {
    await request(app).post("/tarefas").send({ titulo: "Tarefa inicial" });

    const got = await request(app).get("/tarefas/1");
    expect(got.status).toBe(200);

    const upd = await request(app)
      .put("/tarefas/1")
      .send({ titulo: "Tarefa atualizada", concluida: true });
    expect(upd.status).toBe(200);
    expect(upd.body.concluida).toBe(true);

    const del = await request(app).delete("/tarefas/1");
    expect(del.status).toBe(204);

    const gone = await request(app).get("/tarefas/1");
    expect(gone.status).toBe(404);
  });

  it("retorna 404 ao atualizar ou remover tarefa inexistente", async () => {
    expect(
      (await request(app).put("/tarefas/99").send({ titulo: "Qualquer" })).status,
    ).toBe(404);
    expect((await request(app).delete("/tarefas/99")).status).toBe(404);
  });
});
