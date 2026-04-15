import { NextResponse } from "next/server";
import type { ThemeSettings } from "@/lib/theme-store";
import { saveThemeSettingsForUser } from "@/lib/theme-persistence";
import { getSession } from "next-auth/react";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const themeMode = body.themeMode === "dark" ? "dark" : "light";
    const primaryColor = typeof body.primaryColor === "string" ? body.primaryColor : "#1ec28e";
    const backgroundColor = typeof body.backgroundColor === "string" ? body.backgroundColor : "#0f172a";
    const direction = body.direction === "rtl" ? "rtl" : "ltr";

    const settings: ThemeSettings = {
      themeMode,
      primaryColor,
      backgroundColor,
      direction,
    };

    let userId = body.userId;

    if (!userId) {
      const session = await getSession({ req: request as any });
      userId = session?.user?.id;
    }

    if (userId) {
      await saveThemeSettingsForUser(userId, settings);
    }

    return NextResponse.json(settings);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to save theme settings";
    return NextResponse.json({ message }, { status: 400 });
  }
}
