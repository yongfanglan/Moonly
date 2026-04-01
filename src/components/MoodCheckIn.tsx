'use client';
import { useState } from 'react';

const MOODS = [
  { emoji: '😊', label: 'Happy', color: '#10B981' },
  { emoji: '😐', label: 'Calm', color: '#6B7280' },
  { emoji: '😢', label: 'Sad', color: '#3B82F6' },
  { emoji: '😰', label: 'Anxious', color: '#F59E0B' },
  { emoji: '😤', label: 'Angry', color: '#EF4444' },
  { emoji: '🥱', label: 'Tired', color: '#8B5CF6' },
];

const RESPONSES: Record<string, string[]> = {
  Happy: ["That's wonderful to hear! 🌞 Your happiness brightens my day too.", "Wonderful! There's so much power in a genuine smile."],
  Calm: ["Sometimes calm is exactly what we need. It's the quiet moments that bring peace. 🌿", "Peaceful vibes. I appreciate that you took a moment to check in."],
  Sad: ["I'm here with you. 💙 Sadness is part of being human, and it's okay to feel it.", "Sending you a gentle hug through the screen. 🌙"],
  Anxious: ["Take a deep breath with me. 🧘 Anxiety is tough, but you're tougher. I'm here.", "I understand. Let's take it one moment at a time."],
  Angry: ["Anger is valid. It tells us something matters. 💜 Take your time, I'm here when you're ready.", "I hear you. It's okay to feel frustrated."],
  Tired: ["Rest is not lazy — it's necessary. 🌙 Be gentle with yourself today.", "I get it, tired happens. Make sure to take care of yourself."],
};

function todayStr() { return new Date().toISOString().split('T')[0]; }

interface MoodCheckInProps { onComplete: () => void; onExtraMessages: () => void; }

export function MoodCheckIn({ onComplete }: MoodCheckInProps) {
  const [selected, setSelected] = useState<typeof MOODS[0] | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [response, setResponse] = useState('');
  const alreadyDone = localStorage.getItem('moonly_mood_date') === todayStr();

  if (alreadyDone && !submitted) {
    return (
      <div className="rounded-2xl border p-8 text-center" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
        <p className="text-4xl mb-4">🌙</p>
        <h2 className="text-xl font-semibold mb-2">Already checked in today!</h2>
        <p className="text-sm mb-6" style={{ color: 'var(--foreground-muted)' }}>You already did your mood check-in today. See you tomorrow! 💜</p>
        <button className="px-6 py-3 rounded-xl font-medium text-white" style={{ background: '#7C3AED' }} onClick={onComplete}>Back to Chat</button>
      </div>
    );
  }

  const handleSubmit = () => {
    if (!selected) return;
    const opts = RESPONSES[selected.label] || RESPONSES.Calm;
    const r = opts[Math.floor(Math.random() * opts.length)];
    setResponse(r);
    setSubmitted(true);
    localStorage.setItem('moonly_mood', selected.label);
    localStorage.setItem('moonly_mood_date', todayStr());
    localStorage.setItem('moonly_extra_msgs', '3');
  };

  if (submitted) {
    return (
      <div className="rounded-2xl border p-8 text-center" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
        <p className="text-5xl mb-4">{selected?.emoji}</p>
        <h2 className="text-xl font-semibold mb-2" style={{ color: selected?.color }}>{selected?.label}</h2>
        <p className="text-sm mt-4 mb-2" style={{ color: 'var(--foreground-muted)' }}>💜 {response}</p>
        <p className="text-xs mt-4 mb-6" style={{ color: '#7C3AED' }}>🎁 +3 bonus messages unlocked!</p>
        <button className="px-6 py-3 rounded-xl font-medium text-white" style={{ background: '#7C3AED' }} onClick={onComplete}>Start Chatting 🌙</button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border p-8" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
      <div className="text-center mb-8">
        <p className="text-4xl mb-2">🌙</p>
        <h2 className="text-xl font-semibold">How are you feeling?</h2>
        <p className="text-sm mt-1" style={{ color: 'var(--foreground-muted)' }}>Check in with yourself — it's the first step</p>
      </div>
      <div className="grid grid-cols-3 gap-3 mb-6">
        {MOODS.map(mood => (
          <button key={mood.label} onClick={() => setSelected(mood)}
            className="flex flex-col items-center gap-1 p-4 rounded-xl border-2 transition-all"
            style={{
              background: selected?.label === mood.label ? mood.color + '20' : 'var(--background)',
              borderColor: selected?.label === mood.label ? mood.color : 'var(--border)',
              color: 'var(--foreground)',
            }}>
            <span className="text-3xl">{mood.emoji}</span>
            <span className="text-xs font-medium">{mood.label}</span>
          </button>
        ))}
      </div>
      <button onClick={handleSubmit} disabled={!selected}
        className="w-full py-3 rounded-xl font-medium text-white disabled:opacity-40" style={{ background: '#7C3AED' }}>
        Check In
      </button>
    </div>
  );
}
