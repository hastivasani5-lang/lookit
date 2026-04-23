import { NextResponse } from "next/server";
import { getFollowsByProfessional } from "@/lib/follows-store";

export async function GET() {
  try {
    // This endpoint is not scoped to a professional — return empty for now
    // Use /api/follows?professionalId=xxx for scoped queries
    return NextResponse.json({ data: [] });
  } catch {
    return NextResponse.json({ data: [] });
  }
}
