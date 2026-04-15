"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { ChevronLeft, Palette, RefreshCcw, Settings, SunMoon, Type, X } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";

const demoLinks = [
  { label: "View Demo", href: "/" },
  { label: "Buy Now", href: "/signup" },
  { label: "Our Portfolio", href: "/pages" },
];

const colorPresets = ["#1ec28e", "#6c63ff", "#f97316", "#ec4899"];

export default function FloatingSettingsButton() {
  const { settings, setThemeMode, setPrimaryColor, setBackgroundColor, setDirection, resetToDefaults, isLoaded } =
    useTheme();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        aria-label={isOpen ? "Close settings" : "Open settings"}
        title="Settings"
        className="fixed right-[-8px] top-[220px] z-[70] rounded-lg bg-[#0b111a] p-2 shadow-[0_12px_24px_rgba(15,23,42,0.26)] transition-transform duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#1ec28e] focus:ring-offset-2 md:top-[240px]"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-md text-white transition-colors duration-200 hover:bg-[#121a25]">
          <Settings className="h-4 w-4" strokeWidth={2.5} />
        </span>
      </button>

      <div
        className={`fixed inset-0 z-[60] transition-opacity duration-300 ${isOpen ? "opacity-100" : "pointer-events-none opacity-0"}`}
        aria-hidden={!isOpen}
      >
        <button
          type="button"
          aria-label="Close settings overlay"
          className="absolute inset-0 cursor-default bg-black/10"
          onClick={() => setIsOpen(false)}
        />

        <aside
          role="dialog"
          aria-modal="true"
          aria-label="Theme settings"
          className={`absolute right-0 top-0 h-full w-[min(390px,calc(100vw-56px))] overflow-y-auto border-l border-white/10 bg-white text-slate-900 shadow-[0_20px_60px_rgba(15,23,42,0.2)] transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"}`}
        >
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1ec28e]">Lookit</p>
              <h2 className="text-lg font-semibold text-slate-900">Theme Settings</h2>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
              aria-label="Close settings"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-5 px-5 py-5">
            <div className="grid gap-3">
              {demoLinks.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`rounded-2xl px-5 py-4 text-center text-[15px] font-medium text-white shadow-sm transition hover:opacity-95 ${
                    item.label === "View Demo"
                      ? "bg-[#f43f5e]"
                      : item.label === "Buy Now"
                        ? "bg-[#0ea5e9]"
                        : "bg-[#f59e0b]"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <section className="rounded-3xl border border-slate-200 bg-slate-50">
              <div className="border-b border-slate-200 px-5 py-4 text-center text-sm font-semibold uppercase tracking-[0.18em] text-slate-700">
                LTR and RTL Versions
              </div>
              <div className="space-y-4 px-5 py-4">
                <ToggleRow
                  label="LTR Version"
                  active={settings.direction === "ltr"}
                  onToggle={() => setDirection("ltr")}
                  accentColor="#6c63ff"
                  icon={<Type className="h-4 w-4" />}
                />
                <ToggleRow
                  label="RTL Version"
                  active={settings.direction === "rtl"}
                  onToggle={() => setDirection("rtl")}
                  accentColor="#6c63ff"
                  icon={<ChevronLeft className="h-4 w-4" />}
                />
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-slate-50">
              <div className="border-b border-slate-200 px-5 py-4 text-center text-sm font-semibold uppercase tracking-[0.18em] text-slate-700">
                Theme Style
              </div>
              <div className="space-y-4 px-5 py-4">
                <ToggleRow
                  label="Light Theme"
                  active={settings.themeMode === "light"}
                  onToggle={() => setThemeMode("light")}
                  accentColor="#6c63ff"
                  icon={<SunMoon className="h-4 w-4" />}
                />
                <ToggleRow
                  label="Dark Theme"
                  active={settings.themeMode === "dark"}
                  onToggle={() => setThemeMode("dark")}
                  accentColor="#6c63ff"
                  icon={<Palette className="h-4 w-4" />}
                />
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-slate-50">
              <div className="border-b border-slate-200 px-5 py-4 text-center text-sm font-semibold uppercase tracking-[0.18em] text-slate-700">
                Theme Primary Color
              </div>
              <div className="space-y-4 px-5 py-4">
                <ColorRow
                  label="Primary Color"
                  value={settings.primaryColor}
                  onChange={setPrimaryColor}
                  presets={colorPresets}
                />
                <ColorRow
                  label="Background Color"
                  value={settings.backgroundColor}
                  onChange={setBackgroundColor}
                  presets={["#0f172a", "#111827", "#1f2937", "#334155"]}
                />
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-slate-50">
              <div className="border-b border-slate-200 px-5 py-4 text-center text-sm font-semibold uppercase tracking-[0.18em] text-slate-700">
                Reset All Styles
              </div>
              <div className="px-5 py-5">
                <button
                  type="button"
                  onClick={resetToDefaults}
                  className="flex h-14 w-full items-center justify-center rounded-2xl bg-[#f43f5e] text-base font-semibold text-white transition hover:bg-[#e11d48]"
                >
                  <RefreshCcw className="mr-2 h-4 w-4" />
                  Reset All
                </button>
              </div>
            </section>
          </div>
        </aside>
      </div>
    </>
  );
}

function ToggleRow({
  label,
  active,
  onToggle,
  accentColor,
  icon,
}: {
  label: string;
  active: boolean;
  onToggle: () => void;
  accentColor: string;
  icon: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="flex w-full items-center justify-between gap-4 text-left"
      aria-pressed={active}
    >
      <span className="flex items-center gap-3 text-base text-slate-800">
        <span className="grid h-8 w-8 place-items-center rounded-full bg-white text-slate-700 shadow-sm">
          {icon}
        </span>
        {label}
      </span>

      <span
        className="relative h-8 w-14 rounded-full border border-slate-300 bg-white transition"
        style={{ backgroundColor: active ? `${accentColor}22` : undefined }}
      >
        <span
          className="absolute top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-white shadow transition-all"
          style={{ left: active ? "1.6rem" : "0.2rem", backgroundColor: active ? accentColor : "#ffffff" }}
        />
      </span>
    </button>
  );
}

function ColorRow({
  label,
  value,
  onChange,
  presets,
}: {
  label: string;
  value: string;
  onChange: (nextValue: string) => void;
  presets: string[];
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-base text-slate-800">{label}</span>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          aria-label={label}
          className="h-12 w-16 cursor-pointer rounded-lg border-2 border-slate-900 bg-white p-1"
        />
        <div className="flex gap-2">
          {presets.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => onChange(preset)}
              className="h-6 w-6 rounded-full border border-white shadow-sm ring-1 ring-slate-300"
              style={{ backgroundColor: preset }}
              aria-label={`${label} ${preset}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}