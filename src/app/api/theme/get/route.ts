import { NextResponse } from "next/server";
import type { ThemeSettings } from "@/lib/theme-store";
import { getDefaultThemeSettings, parseThemeSettingsFromStorage } from "@/lib/theme-store";
import { deleteThemeSettingsForUser, getThemeSettingsForUser, saveThemeSettingsForUser } from "@/lib/theme-persistence";
import { getSession } from "next-auth/react";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(getDefaultThemeSettings());
    }

    const settings = await getThemeSettingsForUser(userId);

    if (!settings) {
      return NextResponse.json(getDefaultThemeSettings());
    }

    return NextResponse.json(settings);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to get theme settings";
    return NextResponse.json({ message }, { status: 500 });
  }
}

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

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ message: "User ID is required" }, { status: 400 });
    }

    await deleteThemeSettingsForUser(userId);

    return NextResponse.json({ message: "Theme settings deleted" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete theme settings";
    return NextResponse.json({ message }, { status: 500 });
  }
}
