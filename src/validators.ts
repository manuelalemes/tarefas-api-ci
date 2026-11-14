export interface TarefaInput {
  titulo: string;
  descricao: string;
  concluida: boolean;
}

export type ValidationResult =
  { ok: true; value: TarefaInput } | { ok: false; error: string };

export function validateTarefa(input: unknown): ValidationResult {
  if (typeof input !== "object" || input === null) {
    return { ok: false, error: "Corpo da requisição inválido" };
  }
  const { titulo, descricao, concluida } = input as Record<string, unknown>;

  if (typeof titulo !== "string" || titulo.trim().length < 3) {
    return { ok: false, error: "O título deve ter ao menos 3 caracteres" };
  }
  if (titulo.length > 100) {
    return { ok: false, error: "O título deve ter no máximo 100 caracteres" };
  }
  if (descricao !== undefined && typeof descricao !== "string") {
    return { ok: false, error: "A descrição deve ser um texto" };
  }
  if (concluida !== undefined && typeof concluida !== "boolean") {
    return { ok: false, error: "O campo concluida deve ser booleano" };
  }

  return {
    ok: true,
    value: {
      titulo: titulo.trim(),
      descricao: (descricao as string | undefined) ?? "",
      concluida: (concluida as boolean | undefined) ?? false,
    },
  };
}
