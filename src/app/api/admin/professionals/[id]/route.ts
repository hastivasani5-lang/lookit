import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { deleteProfessionalById } from "@/lib/user-store";

export const runtime = "nodejs";

export async function DELETE(_: Request, context: { params: Promise<{ id: string }> }) {
  const cookieStore = await cookies();

  if (cookieStore.get("admin_session")?.value !== "authorized") {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const { id } = await context.params;

  try {
    await deleteProfessionalById(id);

    return NextResponse.json({
      message: "Professional deleted.",
      professionalId: id,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to delete professional.";
    return NextResponse.json({ message }, { status: 400 });
  }
}