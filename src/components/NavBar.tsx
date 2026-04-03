"use client";

interface NavBarProps {
  onMoodClick: () => void;
  onSettingsClick: () => void;
  remaining: number;
}

export default function NavBar({ onMoodClick, onSettingsClick, remaining }: NavBarProps) {
  return (
    <header
      className="flex items-center justify-between px-4 py-3 border-b"
      style={{ borderColor: "var(--border)", backgroundColor: "var(--background)" }}
    >
      <div className="flex items-center gap-2">
        <span className="text-xl">🌙</span>
        <h1 className="text-base font-semibold" style={{ color: "var(--foreground)" }}>
          Moonly
        </h1>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", color: "var(--foreground)" }}>
          💬 {remaining} left
        </span>
        <button
          onClick={onMoodClick}
          className="text-xs px-3 py-1.5 rounded-full transition-colors"
          style={{ backgroundColor: "#7C3AED", color: "white" }}
        >
          😊 Mood
        </button>
        <button
          onClick={onSettingsClick}
          className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
          style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", color: "var(--foreground)" }}
        >
          ⚙️
        </button>
      </div>
    </header>
  );
}
