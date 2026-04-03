"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "register", email, password, name }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Something went wrong"); return; }
      localStorage.setItem("moonly_user", JSON.stringify(data.user));
      localStorage.setItem("moonly_token", data.token);
      localStorage.setItem("moonly_remaining", "10");
      router.push("/");
    } catch { setError("Connection error. Try again."); }
  };
  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: "var(--background)" }}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <span className="text-4xl">🌙</span>
          <h1 className="text-2xl font-bold mt-2" style={{ color: "var(--foreground)" }}>Join Moonly</h1>
          <p className="text-sm opacity-60 mt-1" style={{ color: "var(--foreground)" }}>Create your account</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl px-4 py-3 text-sm outline-none"
            style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", color: "var(--foreground)" }} />
          <input type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl px-4 py-3 text-sm outline-none"
            style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", color: "var(--foreground)" }} />
          <input type="password" placeholder="Password (min 8 chars, letter + number)" value={password} onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl px-4 py-3 text-sm outline-none"
            style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", color: "var(--foreground)" }} />
          {error && <p className="text-xs text-red-400 text-center">{error}</p>}
          <button type="submit" className="w-full py-3 rounded-xl text-sm font-medium text-white" style={{ backgroundColor: "#7C3AED" }}>
            Create Account
          </button>
        </form>
        <p className="text-center text-sm mt-4" style={{ color: "var(--foreground)", opacity: 0.6 }}>
          Already have an account? <button onClick={() => router.push("/login")} className="underline" style={{ color: "#7C3AED" }}>Sign in</button>
        </p>
      </div>
    </div>
  );
}
