import { describe, expect, it } from "vitest";
import { validateTarefa } from "../../src/validators";

describe("validateTarefa", () => {
  it("aceita uma tarefa válida e aplica valores padrão", () => {
    const r = validateTarefa({ titulo: "  Estudar CI  " });
    expect(r).toEqual({
      ok: true,
      value: { titulo: "Estudar CI", descricao: "", concluida: false },
    });
  });

  it("rejeita corpo que não é objeto", () => {
    expect(validateTarefa(null).ok).toBe(false);
    expect(validateTarefa("texto").ok).toBe(false);
  });

  it("rejeita título curto ou ausente", () => {
    expect(validateTarefa({ titulo: "ab" }).ok).toBe(false);
    expect(validateTarefa({}).ok).toBe(false);
  });

  it("rejeita título com mais de 100 caracteres", () => {
    expect(validateTarefa({ titulo: "a".repeat(101) }).ok).toBe(false);
  });

  it("rejeita tipos inválidos em descricao e concluida", () => {
    expect(validateTarefa({ titulo: "Tarefa", descricao: 5 }).ok).toBe(false);
    expect(validateTarefa({ titulo: "Tarefa", concluida: "sim" }).ok).toBe(false);
  });
});
