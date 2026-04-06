import { db, type TodoRow } from "@/lib/db";

export async function listTodos(limit = 20): Promise<TodoRow[]> {
  const safeLimit = Number.isFinite(limit) ? Math.max(1, Math.min(limit, 100)) : 20;

  const { rows } = await db.query<TodoRow>(
    `
      SELECT id, title, completed, created_at, updated_at
      FROM todos
      ORDER BY created_at DESC
      LIMIT $1
    `,
    [safeLimit],
  );

  return rows;
}

export async function createTodo(title: string): Promise<TodoRow> {
  const { rows } = await db.query<TodoRow>(
    `
      INSERT INTO todos (title)
      VALUES ($1)
      RETURNING id, title, completed, created_at, updated_at
    `,
    [title],
  );

  return rows[0];
}

export async function updateTodo(
  id: number,
  input: { title?: string; completed?: boolean },
): Promise<TodoRow | null> {
  const fields: string[] = [];
  const values: Array<string | boolean | number> = [];

  if (typeof input.title === "string") {
    fields.push(`title = $${fields.length + 2}`);
    values.push(input.title);
  }

  if (typeof input.completed === "boolean") {
    fields.push(`completed = $${fields.length + 2}`);
    values.push(input.completed);
  }

  if (fields.length === 0) {
    return null;
  }

  const query = `
    UPDATE todos
    SET ${fields.join(", ")}, updated_at = NOW()
    WHERE id = $1
    RETURNING id, title, completed, created_at, updated_at
  `;

  const { rows } = await db.query<TodoRow>(query, [id, ...values]);
  return rows[0] ?? null;
}

export async function deleteTodo(id: number): Promise<boolean> {
  const { rowCount } = await db.query(`DELETE FROM todos WHERE id = $1`, [id]);
  return (rowCount ?? 0) > 0;
}
