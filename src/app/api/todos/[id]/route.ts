import { NextResponse } from "next/server";
import { deleteTodo, updateTodo } from "@/lib/todos";

function parseId(idValue: string): number | null {
  const parsed = Number(idValue);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    return null;
  }

  return parsed;
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id: idValue } = await context.params;
    const id = parseId(idValue);

    if (!id) {
      return NextResponse.json({ error: "Invalid todo id" }, { status: 400 });
    }

    const body = (await request.json()) as { title?: string; completed?: boolean };

    const todo = await updateTodo(id, {
      title: typeof body.title === "string" ? body.title.trim() : undefined,
      completed: body.completed,
    });

    if (!todo) {
      return NextResponse.json({ error: "Todo not found or no updates supplied" }, { status: 404 });
    }

    return NextResponse.json({ data: todo });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id: idValue } = await context.params;
    const id = parseId(idValue);

    if (!id) {
      return NextResponse.json({ error: "Invalid todo id" }, { status: 400 });
    }

    const deleted = await deleteTodo(id);

    if (!deleted) {
      return NextResponse.json({ error: "Todo not found" }, { status: 404 });
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
