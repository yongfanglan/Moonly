"use client";

import { useState, useEffect, useRef } from "react";
import NavBar from "@/components/NavBar";
import MoodCheckIn from "@/components/MoodCheckIn";
import Settings from "@/components/Settings";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

const DAILY_LIMIT_GUEST = 3;
const DAILY_LIMIT_FREE = 10;
const REWARD_MESSAGES = 3;

function getDailyReset() {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  return tomorrow.getTime();
}

function getTodayKey(prefix: string) {
  const d = new Date();
  return `${prefix}_${d.getFullYear()}_${d.getMonth()}_${d.getDate()}`;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showMood, setShowMood] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [remaining, setRemaining] = useState(DAILY_LIMIT_GUEST);
  const [usedBonus, setUsedBonus] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Load session
  useEffect(() => {
    const saved = localStorage.getItem("moonly_messages");
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
      } catch {}
    }
    const savedRemaining = localStorage.getItem("moonly_remaining");
    const savedReset = localStorage.getItem("moonly_reset");
    const todayKey = getTodayKey("remaining");
    const resetTime = getDailyReset();

    if (savedReset && Date.now() < parseInt(savedReset)) {
      setRemaining(savedRemaining ? parseInt(savedRemaining) : DAILY_LIMIT_GUEST);
    } else {
      // Reset daily
      const isLoggedIn = !!localStorage.getItem("moonly_user");
      localStorage.setItem("moonly_remaining", isLoggedIn ? String(DAILY_LIMIT_FREE) : String(DAILY_LIMIT_GUEST));
      localStorage.setItem("moonly_reset", String(resetTime));
      setRemaining(isLoggedIn ? DAILY_LIMIT_FREE : DAILY_LIMIT_GUEST);
    }

    const bonus = localStorage.getItem("moonly_bonus_used_" + new Date().toDateString());
    setUsedBonus(!!bonus);

    // Welcome message
    if (!saved) {
      setMessages([
        {
          id: "welcome",
          role: "assistant",
          content: "🌙 Hey there... I'm Moonly. I'm here for you, whenever you need someone to talk to. How are you feeling tonight?",
          timestamp: Date.now(),
        },
      ]);
    }
  }, []);

  // Save messages
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("moonly_messages", JSON.stringify(messages));
    }
  }, [messages]);

  // Auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    if (remaining <= 0) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text.trim(),
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Decrement remaining
    const newRemaining = remaining - 1;
    setRemaining(newRemaining);
    localStorage.setItem("moonly_remaining", String(newRemaining));

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const data = await res.json();
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.reply || "I'm here... 💙 It seems I couldn't respond just now. Try again?",
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I'm sorry... I'm having trouble responding right now. 💙 Please try again in a moment.",
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleMoodSelect = (mood: string) => {
    const responses: Record<string, string> = {
      happy: "That's wonderful to hear! 😊 Your joy brightens the night. Tell me more about what's making you happy?",
      calm: "Peace is a beautiful thing. 😐 Sometimes just sitting with that calm feeling is enough. I'm glad you have this moment.",
      sad: "I'm here with you. 😢 It's okay to feel sad — tears are how our hearts speak. What's on your mind?",
      anxious: "Take a breath with me... 😰 You're safe here. Anxiety can feel overwhelming, but it passes. What triggered it?",
      angry: "I hear you, and your feelings are valid. 😤 Anger is honest. What happened that's stirring this up?",
      tired: "Rest is not weakness. 🥱 Even the moon rests between nights. What drains you? I'm listening.",
    };

    const response = responses[mood] || "🌙 I hear you. Thank you for sharing how you feel.";

    const aiMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: response,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, aiMsg]);
    setShowMood(false);

    // Award bonus messages if not used today
    if (!usedBonus) {
      const isLoggedIn = !!localStorage.getItem("moonly_user");
      const bonus = isLoggedIn ? 0 : REWARD_MESSAGES;
      if (bonus > 0) {
        setRemaining((r) => r + bonus);
        localStorage.setItem("moonly_remaining", String(remaining + bonus));
        localStorage.setItem("moonly_bonus_used_" + new Date().toDateString(), "1");
        setUsedBonus(true);
        const bonusMsg: Message = {
          id: (Date.now() + 2).toString(),
          role: "assistant",
          content: `✨ Bonus! You checked in with ${mood}. Here are ${bonus} extra messages — enjoy! 🌙`,
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, bonusMsg]);
      }
    }
  };

  return (
    <div className="flex flex-col h-screen" style={{ backgroundColor: "var(--background)" }}>
      <NavBar
        onMoodClick={() => setShowMood(true)}
        onSettingsClick={() => setShowSettings(true)}
        remaining={remaining}
      />

      <main className="flex-1 overflow-y-auto px-4 py-6 max-w-2xl mx-auto w-full">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`message-appear flex mb-4 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.role === "assistant" && (
              <div className="w-8 h-8 rounded-full flex items-center justify-center mr-2 text-lg flex-shrink-0" style={{ backgroundColor: "#7C3AED" }}>
                🌙
              </div>
            )}
            <div
              className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                msg.role === "user"
                  ? "text-white rounded-br-sm"
                  : "rounded-bl-sm"
              }`}
              style={
                msg.role === "user"
                  ? { backgroundColor: "#7C3AED" }
                  : { backgroundColor: "var(--card)", border: "1px solid var(--border)" }
              }
            >
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="message-appear flex mb-4 justify-start">
            <div className="w-8 h-8 rounded-full flex items-center justify-center mr-2 text-lg flex-shrink-0" style={{ backgroundColor: "#7C3AED" }}>
              🌙
            </div>
            <div className="rounded-2xl rounded-bl-sm px-4 py-3" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
              <div className="flex gap-1">
                <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </main>

      {/* Input area */}
      <div className="border-t px-4 py-4" style={{ borderColor: "var(--border)", backgroundColor: "var(--background)" }}>
        <form onSubmit={handleSubmit} className="flex items-end gap-2 max-w-2xl mx-auto">
          <button
            type="button"
            onClick={() => setShowMood(true)}
            className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-lg"
            style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}
            title="Mood Check-in"
          >
            😊
          </button>
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            placeholder={remaining > 0 ? "Say something... 🌙" : "No messages left today 💔"}
            disabled={remaining <= 0}
            rows={1}
            className="flex-1 rounded-xl px-4 py-3 resize-none outline-none text-sm"
            style={{
              backgroundColor: "var(--card)",
              border: "1px solid var(--border)",
              color: "var(--foreground)",
            }}
          />
          <button
            type="submit"
            disabled={!input.trim() || remaining <= 0}
            className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-white disabled:opacity-40"
            style={{ backgroundColor: "#7C3AED" }}
          >
            ➤
          </button>
        </form>
        {remaining <= 0 && (
          <p className="text-center text-xs mt-2" style={{ color: "#7C3AED" }}>
            💌 Daily limit reached. Check in your mood for bonus messages!
          </p>
        )}
      </div>

      {/* Mood modal */}
      {showMood && (
        <MoodCheckIn onClose={() => setShowMood(false)} onSelect={handleMoodSelect} />
      )}

      {/* Settings modal */}
      {showSettings && (
        <Settings onClose={() => setShowSettings(false)} />
      )}
    </div>
  );
}
