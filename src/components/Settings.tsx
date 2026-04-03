"use client";

import { useState, useEffect } from "react";

interface SettingsProps {
  onClose: () => void;
}

export default function Settings({ onClose }: SettingsProps) {
  const [isDark, setIsDark] = useState(true);
  const [user, setUser] = useState<{ email: string; name: string } | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [mode, setMode] = useState<"login" | "register">("login");

  useEffect(() => {
    const saved = localStorage.getItem("moonly_user");
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch {}
    }
    const theme = localStorage.getItem("moonly_theme");
    setIsDark(theme !== "light");
  }, []);

  const toggleTheme = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    document.body.classList.toggle("dark", newDark);
    localStorage.setItem("moonly_theme", newDark ? "dark" : "light");
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: mode, email, password, name }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong");
        return;
      }
      localStorage.setItem("moonly_user", JSON.stringify(data.user));
      localStorage.setItem("moonly_token", data.token);
      setUser(data.user);
      // Update daily limit for logged-in users
      localStorage.setItem("moonly_remaining", "10");
      setShowLogin(false);
    } catch {
      setError("Connection error. Try again.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("moonly_user");
    localStorage.removeItem("moonly_token");
    localStorage.removeItem("moonly_messages");
    localStorage.removeItem("moonly_remaining");
    setUser(null);
    window.location.reload();
  };

  const handleClearChat = () => {
    localStorage.removeItem("moonly_messages");
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.6)" }}>
      <div className="w-full max-w-sm rounded-2xl p-6" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold" style={{ color: "var(--foreground)" }}>⚙️ Settings</h2>
          <button onClick={onClose} style={{ color: "var(--foreground)" }}>✕</button>
        </div>

        {showLogin ? (
          <form onSubmit={handleAuth} className="space-y-3">
            <h3 className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
              {mode === "login" ? "Sign In" : "Create Account"}
            </h3>
            {mode === "register" && (
              <input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg px-3 py-2 text-sm outline-none"
                style={{ backgroundColor: "var(--background)", border: "1px solid var(--border)", color: "var(--foreground)" }}
              />
            )}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg px-3 py-2 text-sm outline-none"
              style={{ backgroundColor: "var(--background)", border: "1px solid var(--border)", color: "var(--foreground)" }}
            />
            <input
              type="password"
              placeholder="Password (8+ chars, letter + number)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg px-3 py-2 text-sm outline-none"
              style={{ backgroundColor: "var(--background)", border: "1px solid var(--border)", color: "var(--foreground)" }}
            />
            {error && <p className="text-xs text-red-400">{error}</p>}
            <button
              type="submit"
              className="w-full py-2 rounded-lg text-sm font-medium text-white"
              style={{ backgroundColor: "#7C3AED" }}
            >
              {mode === "login" ? "Sign In" : "Create Account"}
            </button>
            <p className="text-center text-xs" style={{ color: "var(--foreground)", opacity: 0.6 }}>
              {mode === "login" ? "Don't have an account? " : "Already have an account? "}
              <button
                type="button"
                onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); }}
                className="underline"
                style={{ color: "#7C3AED" }}
              >
                {mode === "login" ? "Sign up" : "Sign in"}
              </button>
            </p>
          </form>
        ) : (
          <div className="space-y-4">
            {/* Theme */}
            <div className="flex items-center justify-between">
              <span className="text-sm" style={{ color: "var(--foreground)" }}>🌙 Dark Mode</span>
              <button
                onClick={toggleTheme}
                className="w-12 h-6 rounded-full relative transition-colors"
                style={{ backgroundColor: isDark ? "#7C3AED" : "#ccc" }}
              >
                <span
                  className="absolute top-1 w-4 h-4 rounded-full bg-white transition-transform"
                  style={{ transform: isDark ? "translateX(26px)" : "translateX(4px)" }}
                />
              </button>
            </div>

            {/* User info */}
            {user ? (
              <div className="p-3 rounded-lg" style={{ backgroundColor: "var(--background)", border: "1px solid var(--border)" }}>
                <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>👤 {user.name || user.email}</p>
                <p className="text-xs opacity-60" style={{ color: "var(--foreground)" }}>{user.email}</p>
              </div>
            ) : (
              <button
                onClick={() => setShowLogin(true)}
                className="w-full py-2 rounded-lg text-sm font-medium text-white"
                style={{ backgroundColor: "#7C3AED" }}
              >
                Sign In / Sign Up
              </button>
            )}

            {/* Actions */}
            {user && (
              <button
                onClick={handleLogout}
                className="w-full py-2 rounded-lg text-sm"
                style={{ backgroundColor: "var(--background)", border: "1px solid var(--border)", color: "var(--foreground)" }}
              >
                Sign Out
              </button>
            )}

            <button
              onClick={handleClearChat}
              className="w-full py-2 rounded-lg text-sm text-red-400"
              style={{ backgroundColor: "var(--background)", border: "1px solid var(--border)" }}
            >
              🗑️ Clear Chat History
            </button>

            <p className="text-center text-xs opacity-40" style={{ color: "var(--foreground)" }}>
              Moonly v0.1 MVP · All data stored locally
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
