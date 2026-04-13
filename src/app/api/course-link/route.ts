import { NextResponse } from "next/server";
import { resolveCourseTargetUrl } from "@/lib/course-link-resolver";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title") ?? "";
  const category = searchParams.get("category") ?? "";

  const targetUrl = resolveCourseTargetUrl({ title, category });

  return NextResponse.redirect(targetUrl, { status: 307 });
}
