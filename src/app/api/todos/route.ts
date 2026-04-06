import { NextResponse } from "next/server";
import { createTodo, listTodos } from "@/lib/todos";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const limitParam = url.searchParams.get("limit");
    const limit = limitParam ? Number(limitParam) : 20;

    const todos = await listTodos(limit);
    return NextResponse.json({ data: todos });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { title?: string };

    if (!body.title || body.title.trim().length < 2) {
      return NextResponse.json(
        { error: "title is required and must have at least 2 characters" },
        { status: 400 },
      );
    }

    const todo = await createTodo(body.title.trim());
    return NextResponse.json({ data: todo }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
