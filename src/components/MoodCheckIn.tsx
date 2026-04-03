"use client";

import { useState, useEffect } from "react";

interface MoodCheckInProps {
  onClose: () => void;
  onSelect: (mood: string) => void;
}

const moods = [
  { id: "happy", emoji: "😊", label: "Happy", desc: "Feeling joyful" },
  { id: "calm", emoji: "😐", label: "Calm", desc: "Feeling peaceful" },
  { id: "sad", emoji: "😢", label: "Sad", desc: "Feeling down" },
  { id: "anxious", emoji: "😰", label: "Anxious", desc: "Feeling uneasy" },
  { id: "angry", emoji: "😤", label: "Angry", desc: "Feeling frustrated" },
  { id: "tired", emoji: "🥱", label: "Tired", desc: "Feeling exhausted" },
];

export default function MoodCheckIn({ onClose, onSelect }: MoodCheckInProps) {
  const [todayChecked, setTodayChecked] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    const key = "moonly_mood_" + new Date().toDateString();
    setTodayChecked(!!localStorage.getItem(key));
  }, []);

  const handleSelect = (moodId: string) => {
    if (todayChecked) return;
    setSelected(moodId);
    localStorage.setItem("moonly_mood_" + new Date().toDateString(), moodId);
    onSelect(moodId);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.6)" }}>
      <div className="w-full max-w-sm rounded-2xl p-6" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold" style={{ color: "var(--foreground)" }}>
            🌙 How are you feeling?
          </h2>
          <button onClick={onClose} className="text-lg" style={{ color: "var(--foreground)" }}>✕</button>
        </div>

        {todayChecked && !selected ? (
          <div className="text-center py-4">
            <p className="text-3xl mb-3">✨</p>
            <p className="text-sm" style={{ color: "var(--foreground)" }}>
              You already checked in today! 🌙<br />
              <span className="text-xs opacity-60">Come back tomorrow</span>
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-3">
            {moods.map((mood) => (
              <button
                key={mood.id}
                onClick={() => handleSelect(mood.id)}
                className="flex flex-col items-center p-3 rounded-xl transition-all hover:scale-105"
                style={{
                  backgroundColor: "var(--background)",
                  border: "1px solid var(--border)",
                }}
              >
                <span className="text-2xl mb-1">{mood.emoji}</span>
                <span className="text-xs font-medium" style={{ color: "var(--foreground)" }}>
                  {mood.label}
                </span>
              </button>
            ))}
          </div>
        )}

        <p className="text-center text-xs mt-4 opacity-50" style={{ color: "var(--foreground)" }}>
          Check in daily for bonus messages ✨
        </p>
      </div>
    </div>
  );
}
