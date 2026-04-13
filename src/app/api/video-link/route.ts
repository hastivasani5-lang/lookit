import { NextResponse } from "next/server";
import { resolveVideoTargetUrl } from "@/lib/video-link-resolver";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title") ?? "";

  const targetUrl = resolveVideoTargetUrl({ title });
  return NextResponse.redirect(targetUrl, { status: 307 });
}
