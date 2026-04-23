"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { UserRole } from "@/types/auth";

export default function LoginPage() {
  const router = useRouter();
  const [isActive, setIsActive] = useState(false); // false = login, true = register

  // ── Login state ──────────────────────────────────────────
  const [loginRole, setLoginRole] = useState<UserRole>("student");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPwd, setShowLoginPwd] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [loginSuccess, setLoginSuccess] = useState("");
  const [googleLoading, setGoogleLoading] = useState(false);
  const [workHoursGoal, setWorkHoursGoal] = useState("8");

  // ── Register state ───────────────────────────────────────
  const [regRole, setRegRole] = useState<UserRole>("student");
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [showRegPwd, setShowRegPwd] = useState(false);
  const [regLoading, setRegLoading] = useState(false);
  const [regError, setRegError] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const queryEmail = params.get("email");
    const queryRole = params.get("role");
    const authError = params.get("error");
    const registered = params.get("registered") === "1";
    if (queryEmail) setLoginEmail(queryEmail);
    if (queryRole === "student" || queryRole === "professional") setLoginRole(queryRole);
    if (registered) setLoginSuccess("Account created! Please log in.");
    if (authError === "approval-pending") setLoginError("Your professional account is pending admin approval.");
    if (authError === "approval-rejected") setLoginError("Your professional account was rejected.");
    if (authError === "register-first") setLoginError("Please register first before using Google login.");
    // If coming from /signup redirect, open register panel
    if (params.get("register") === "1") setIsActive(true);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(""); setLoginLoading(true);
    const result = await signIn("credentials", { email: loginEmail, password: loginPassword, role: loginRole, redirect: false });
    setLoginLoading(false);
    if (!result || result.error) {
      if (result?.error === "approval-pending") setLoginError("Professional account pending approval.");
      else if (result?.error === "approval-rejected") setLoginError("Professional account rejected.");
      else setLoginError("Invalid email or password.");
      return;
    }
    const s = await fetch("/api/auth/session", { cache: "no-store" });
    const sp = await s.json().catch(() => null);
    const role = sp?.user?.role === "professional" ? "professional" : "student";
    // Save work hours goal for student
    if (role === "student" && sp?.user?.id) {
      const goal = Math.max(1, Math.min(24, Number(workHoursGoal) || 8));
      localStorage.setItem(`lookit-work-goal-${sp.user.id}`, String(goal));
    }
    window.location.href = role === "professional" ? "/dashboard/teachers" : "/dashboard/students";
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true); setLoginError("");
    // callbackUrl -> /api/auth/google-callback which will redirect based on actual DB role
    await signIn("google", { callbackUrl: "/api/auth/google-callback" });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(""); setRegLoading(true);
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: regName, email: regEmail, password: regPassword, role: regRole }),
    });
    const data = (await res.json()) as { message?: string };
    setRegLoading(false);
    if (!res.ok) { setRegError(data.message || "Registration failed."); return; }
    // Switch to login with success
    setLoginEmail(regEmail);
    setLoginRole(regRole);
    setLoginSuccess("Account created! Please log in.");
    setIsActive(false);
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background image with blur */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/learning-illustration.jpg')" }} />
        <div className="absolute inset-0 backdrop-blur-md bg-white/40" />
      </div>

      <style>{`
        .auth-container { position: relative; width: 850px; max-width: 100%; height: 560px; background: #fff; border-radius: 30px; box-shadow: 0 20px 60px rgba(0,0,0,0.15); overflow: hidden; }
        .form-box { position: absolute; right: 0; width: 50%; height: 100%; background: #fff; display: flex; align-items: center; color: #333; text-align: center; padding: 40px; z-index: 1; transition: 0.6s ease-in-out 1.2s, visibility 0s 1s; }
        .auth-container.active .form-box { right: 50%; }
        .form-box.register { visibility: hidden; }
        .auth-container.active .form-box.register { visibility: visible; }
        .toggle-box { position: absolute; width: 100%; height: 100%; pointer-events: none; }
        .toggle-box::before { content: ''; position: absolute; left: -250%; width: 300%; height: 100%; background: linear-gradient(135deg, #0d7a57 0%, #1ec28e 60%, #34d399 100%); border-radius: 150px; z-index: 2; transition: 1.8s ease-in-out; }
        .auth-container.active .toggle-box::before { left: 50%; }
        .toggle-panel { position: absolute; width: 50%; height: 100%; color: #fff; display: flex; flex-direction: column; justify-content: center; align-items: center; z-index: 3; transition: 0.6s ease-in-out; pointer-events: all; }
        .toggle-panel.toggle-left { left: 0; transition-delay: 1.2s; }
        .auth-container.active .toggle-panel.toggle-left { left: -50%; transition-delay: 0.6s; }
        .toggle-panel.toggle-right { right: -50%; transition-delay: 0.6s; }
        .auth-container.active .toggle-panel.toggle-right { right: 0; transition-delay: 1.2s; }
        @media (max-width: 650px) {
          .auth-container { height: calc(100vh - 40px); }
          .form-box { bottom: 0; width: 100%; height: 70%; }
          .auth-container.active .form-box { right: 0; bottom: 30%; }
          .toggle-box::before { left: 0; top: -270%; width: 100%; height: 300%; border-radius: 20vw; }
          .auth-container.active .toggle-box::before { left: 0; top: 70%; }
          .toggle-panel { width: 100%; height: 30%; }
          .toggle-panel.toggle-left { top: 0; }
          .auth-container.active .toggle-panel.toggle-left { left: 0; top: -30%; }
          .toggle-panel.toggle-right { right: 0; bottom: -30%; }
          .auth-container.active .toggle-panel.toggle-right { bottom: 0; }
        }
      `}</style>

      <div className={`auth-container ${isActive ? "active" : ""}`} style={{ position: "relative", zIndex: 1 }}>

        {/* ── LOGIN FORM ─────────────────────────────────── */}
        <div className="form-box login">
          <form onSubmit={handleLogin} className="w-full">
            <h1 className="text-3xl font-bold text-gray-800 mb-1">Login</h1>
            <p className="text-sm text-gray-500 mb-5">Welcome back! Sign in to continue.</p>

            {/* Role toggle */}
            <div className="flex gap-2 mb-5 p-1 bg-gray-100 rounded-xl">
              {(["student","professional"] as UserRole[]).map((r) => (
                <button key={r} type="button" onClick={() => setLoginRole(r)}
                  className={`flex-1 py-2 rounded-lg text-xs font-semibold capitalize transition-all flex items-center justify-center gap-1.5 ${loginRole === r ? "bg-white text-[#0d7a57] shadow" : "text-gray-500"}`}>
                  {r === "student" ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path d="M12 14l9-5-9-5-9 5 9 5z"/><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/>
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/>
                    </svg>
                  )}
                  {r === "student" ? "Student" : "Professional"}
                </button>
              ))}
            </div>

            {loginError && <p className="mb-3 text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2">{loginError}</p>}
            {loginSuccess && <p className="mb-3 text-xs text-emerald-700 bg-emerald-50 rounded-lg px-3 py-2">{loginSuccess}</p>}

            <div className="relative mb-4">
              <input type="email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="Email address" required
                className="w-full h-11 px-4 bg-gray-100 rounded-lg border-none outline-none text-sm text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-[#1ec28e]/30" />
            </div>
            <div className="relative mb-4">
              <input type={showLoginPwd ? "text" : "password"} value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="Password" required
                className="w-full h-11 px-4 pr-11 bg-gray-100 rounded-lg border-none outline-none text-sm text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-[#1ec28e]/30" />
              <button type="button" onClick={() => setShowLoginPwd(c => !c)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#1ec28e]">
                {showLoginPwd ? <EyeOff size={16}/> : <Eye size={16}/>}
              </button>
            </div>

            {/* Work hours goal — student only */}
            {loginRole === "student" && (
              <div className="mb-4 rounded-xl bg-[#f0faf7] border border-[#c8ede0] px-4 py-3 flex items-center gap-3">
                <span className="text-xl">🎯</span>
                <div className="flex-1">
                  <p className="text-xs font-bold text-[#0d7a57] mb-1.5">Today's Work Hours Goal</p>
                  <div className="flex items-center gap-2">
                    <input
                      type="number" min="1" max="24" value={workHoursGoal}
                      onChange={(e) => setWorkHoursGoal(e.target.value)}
                      className="w-14 h-8 px-2 bg-white rounded-lg border border-[#c8ede0] outline-none text-sm text-center font-bold text-[#0d7a57] focus:ring-2 focus:ring-[#1ec28e]/30"
                    />
                    <span className="text-xs text-gray-400">hrs — auto logout after goal</span>
                  </div>
                </div>
              </div>
            )}

            <button type="submit" disabled={loginLoading}
              className="w-full h-11 rounded-lg text-white font-semibold text-sm mb-4 disabled:opacity-60 flex items-center justify-center gap-2 transition hover:opacity-90"
              style={{ background: "linear-gradient(135deg, #0d7a57, #1ec28e)" }}>
              {loginLoading ? <Loader2 size={18} className="animate-spin"/> : "Login"}
            </button>

            <p className="text-xs text-gray-400 mb-3">or login with</p>
            <div className="flex justify-center gap-3">
              <button type="button" onClick={handleGoogleLogin} disabled={googleLoading}
                className="w-11 h-11 rounded-full border-2 border-gray-200 bg-white flex items-center justify-center hover:border-[#1ec28e] hover:shadow-md transition">
                {googleLoading ? <Loader2 size={16} className="animate-spin text-gray-400"/> : (
                  <svg width="20" height="20" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* ── REGISTER FORM ──────────────────────────────── */}
        <div className="form-box register">
          <form onSubmit={handleRegister} className="w-full">
            <h1 className="text-3xl font-bold text-gray-800 mb-1">Register</h1>
            <p className="text-sm text-gray-500 mb-5">Create your account to get started.</p>

            {/* Role toggle */}
            <div className="flex gap-2 mb-4 p-1 bg-gray-100 rounded-xl">
              {(["student","professional"] as UserRole[]).map((r) => (
                <button key={r} type="button" onClick={() => setRegRole(r)}
                  className={`flex-1 py-2 rounded-lg text-xs font-semibold capitalize transition-all flex items-center justify-center gap-1.5 ${regRole === r ? "bg-white text-[#0d7a57] shadow" : "text-gray-500"}`}>
                  {r === "student" ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path d="M12 14l9-5-9-5-9 5 9 5z"/><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/>
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/>
                    </svg>
                  )}
                  {r === "student" ? "Student" : "Professional"}
                </button>
              ))}
            </div>

            {regError && <p className="mb-3 text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2">{regError}</p>}

            <div className="relative mb-3">
              <input type="text" value={regName} onChange={(e) => setRegName(e.target.value)}
                placeholder="Full name" required
                className="w-full h-11 px-4 bg-gray-100 rounded-lg border-none outline-none text-sm text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-[#1ec28e]/30" />
            </div>
            <div className="relative mb-3">
              <input type="email" value={regEmail} onChange={(e) => setRegEmail(e.target.value)}
                placeholder="Email address" required
                className="w-full h-11 px-4 bg-gray-100 rounded-lg border-none outline-none text-sm text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-[#1ec28e]/30" />
            </div>
            <div className="relative mb-4">
              <input type={showRegPwd ? "text" : "password"} value={regPassword} onChange={(e) => setRegPassword(e.target.value)}
                placeholder="Password" required
                className="w-full h-11 px-4 pr-11 bg-gray-100 rounded-lg border-none outline-none text-sm text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-[#1ec28e]/30" />
              <button type="button" onClick={() => setShowRegPwd(c => !c)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#1ec28e]">
                {showRegPwd ? <EyeOff size={16}/> : <Eye size={16}/>}
              </button>
            </div>

            <button type="submit" disabled={regLoading}
              className="w-full h-11 rounded-lg text-white font-semibold text-sm disabled:opacity-60 flex items-center justify-center gap-2 transition hover:opacity-90"
              style={{ background: "linear-gradient(135deg, #0d7a57, #1ec28e)" }}>
              {regLoading ? <Loader2 size={18} className="animate-spin"/> : "Register"}
            </button>
          </form>
        </div>

        {/* ── TOGGLE BOX ─────────────────────────────────── */}
        <div className="toggle-box">
          {/* Left panel - shown when login is active */}
          <div className="toggle-panel toggle-left">
            <div className="mb-4">
              <svg className="w-12 h-12 mx-auto mb-2 opacity-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <h1 className="text-3xl font-bold">Hello, Welcome!</h1>
            </div>
            <p className="text-white/80 text-sm mb-6 text-center px-6">Don&apos;t have an account?<br/>Register now and start learning!</p>
            <button type="button" onClick={() => setIsActive(true)}
              className="w-40 h-11 rounded-lg border-2 border-white text-white font-semibold text-sm bg-transparent hover:bg-white/10 transition">
              Register
            </button>
          </div>

          {/* Right panel - shown when register is active */}
          <div className="toggle-panel toggle-right">
            <div className="mb-4">
              <svg className="w-12 h-12 mx-auto mb-2 opacity-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <h1 className="text-3xl font-bold">Welcome Back!</h1>
            </div>
            <p className="text-white/80 text-sm mb-6 text-center px-6">Already have an account?<br/>Login to continue your journey!</p>
            <button type="button" onClick={() => setIsActive(false)}
              className="w-40 h-11 rounded-lg border-2 border-white text-white font-semibold text-sm bg-transparent hover:bg-white/10 transition">
              Login
            </button>
          </div>
        </div>

      </div>
    </main>
  );
}
