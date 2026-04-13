import { NextResponse } from "next/server";
import { resolveBookTargetUrl } from "@/lib/book-link-resolver";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title") ?? "";

  const targetUrl = resolveBookTargetUrl({ title });
  return NextResponse.redirect(targetUrl, { status: 307 });
}
