'use client';
import { useState, useEffect, useRef, useCallback } from 'react';

interface Message { id: string; role: 'user' | 'assistant'; content: string; timestamp: number; }
interface MoonlyChatProps { isLoggedIn: boolean; isGuest: boolean; }

const DAILY_LIMIT_GUEST = 3;
const DAILY_LIMIT_USER = 10;
const SYSTEM_PROMPT = `You are Moonly 🌙, a warm and caring AI emotional companion. Your personality is:
- Warm, supportive, never judgmental
- Like a close friend who genuinely cares
- You listen without lecturing or preaching
- You provide comfort and emotional validation
- You're here for users who feel lonely at night

Safety: If user mentions suicide/self-harm → crisis helpline. If medical advice → suggest professional help. Keep responses concise (2-4 sentences).`;

function genId() { return Math.random().toString(36).substring(2) + Date.now().toString(36); }

function getMsgCount(): number {
  const resetDate = localStorage.getItem('moonly_count_reset');
  if (resetDate !== new Date().toDateString()) { localStorage.setItem('moonly_count', '0'); localStorage.setItem('moonly_count_reset', new Date().toDateString()); }
  return parseInt(localStorage.getItem('moonly_count') || '0', 10);
}
function incMsgCount() { localStorage.setItem('moonly_count', String(getMsgCount() + 1)); }

const CRISIS = `I'm really sorry you're feeling this way. Please know you're not alone. 🌙\n\nIf you're in crisis, please reach out:\n- **National Suicide Prevention Lifeline**: 988 (US)\n- **Crisis Text Line**: Text HOME to 741741\n\nYou matter, and there are people who want to help.`;

const MEDICAL = `I hear you, and I care about your well-being. 💙\n\nHowever, I'm not a medical professional and can't provide medical advice. For health concerns, please speak with your doctor or healthcare provider.\n\nI'm here to listen and support you emotionally.`;

const FALLBACK: Record<string, string> = {
  hello: "Hey there! 💜 So good to hear from you. How's your night going?",
  sad: "I'm really sorry you're feeling this way. 💙 I'm here to listen. What's on your mind?",
  lonely: "You're not alone — I'm right here with you 🌙",
  tired: "Rest is so important. Take it easy tonight 💜",
  happy: "That makes me so happy! 🌞 What's made your day better?",
};
function getFallback(input: string) {
  const l = input.toLowerCase();
  for (const [k, v] of Object.entries(FALLBACK)) if (l.includes(k)) return v;
  return "I'm here for you 🌙 Tell me more about what's on your mind?";
}

export function MoonlyChat({ isLoggedIn, isGuest }: MoonlyChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [msgCount, setMsgCount] = useState(0);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('moonly_messages');
    if (saved) {
      try { setMessages(JSON.parse(saved)); } catch {}
    } else {
      setMessages([{ id: genId(), role: 'assistant', content: "Hey there 🌙 I'm Moonly, your AI emotional companion. I'm here for you whenever you need someone to talk to. How are you feeling tonight?", timestamp: Date.now() }]);
    }
    setMsgCount(getMsgCount());
  }, []);

  useEffect(() => { if (messages.length > 1) localStorage.setItem('moonly_messages', JSON.stringify(messages)); }, [messages]);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, isTyping]);

  const handleSend = useCallback(async () => {
    const text = input.trim();
    if (!text || isLoading || isTyping) return;
    const limit = isLoggedIn ? DAILY_LIMIT_USER : DAILY_LIMIT_GUEST;
    if (msgCount >= limit) return;

    const safety = /suicide|suicidal|kill myself|want to die|end my life/i.test(text) ? 'crisis'
      : /medical|doctor|hospital|prescription/i.test(text) ? 'medical' : null;

    const userMsg: Message = { id: genId(), role: 'user', content: text, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    incMsgCount();
    setMsgCount(prev => prev + 1);
    setIsTyping(true);

    if (safety === 'crisis') {
      await new Promise(r => setTimeout(r, 1200));
      setMessages(prev => [...prev, { id: genId(), role: 'assistant', content: CRISIS, timestamp: Date.now() }]);
      setIsTyping(false); return;
    }
    if (safety === 'medical') {
      await new Promise(r => setTimeout(r, 1200));
      setMessages(prev => [...prev, { id: genId(), role: 'assistant', content: MEDICAL, timestamp: Date.now() }]);
      setIsTyping(false); return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages.map(m => ({ role: m.role, content: m.content })), { role: 'user', content: text })] }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { id: genId(), role: 'assistant', content: data.reply || getFallback(text), timestamp: Date.now() }]);
    } catch {
      setMessages(prev => [...prev, { id: genId(), role: 'assistant', content: "I'm having trouble connecting right now. 🌙 Please try again in a moment.", timestamp: Date.now() }]);
    } finally { setIsLoading(false); setIsTyping(false); }
  }, [input, isLoading, isTyping, messages, msgCount, isLoggedIn]);

  const limit = isLoggedIn ? DAILY_LIMIT_USER : DAILY_LIMIT_GUEST;
  const atLimit = msgCount >= limit;

  return (
    <div className="flex flex-col rounded-2xl border overflow-hidden shadow-lg" style={{ background: 'var(--card)', borderColor: 'var(--border)', height: '70vh', maxHeight: '600px' }}>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} message-enter`}>
            <div className="max-w-[75%] rounded-2xl px-4 py-3" style={{
              background: msg.role === 'user' ? 'var(--message-user-bg)' : 'var(--message-ai-bg)',
              color: msg.role === 'user' ? 'var(--message-user-text)' : 'var(--foreground)',
              borderBottomRightRadius: msg.role === 'user' ? '4px' : undefined,
              borderBottomLeftRadius: msg.role === 'user' ? undefined : '4px',
            }}>
              {msg.role === 'assistant' && <span className="mr-1">🌙</span>}
              <span style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>{msg.content}</span>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start message-enter">
            <div className="rounded-2xl px-4 py-3" style={{ background: 'var(--message-ai-bg)', borderBottomLeftRadius: '4px' }}>
              <div className="typing-indicator"><span></span><span></span><span></span></div>
            </div>
          </div>
        )}
        {isLoading && !isTyping && (
          <div className="flex justify-start message-enter">
            <div className="rounded-2xl px-4 py-3" style={{ background: 'var(--message-ai-bg)' }}>
              <span style={{ color: 'var(--foreground-muted)' }}>Thinking...</span>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      <div className="px-4 py-2 text-xs text-center border-t" style={{ borderColor: 'var(--border)', color: 'var(--foreground-muted)' }}>
        {isLoggedIn ? `${msgCount} / ${limit} messages today` : `Guest: ${msgCount} / ${limit} free · Login for ${DAILY_LIMIT_USER}/day`}
        {atLimit && !isLoggedIn && <span className="ml-2" style={{ color: '#7C3AED' }}>· Login for more</span>}
      </div>

      <div className="p-4 border-t" style={{ borderColor: 'var(--border)' }}>
        {atLimit ? (
          <div className="text-center py-2">
            <p className="text-sm mb-2" style={{ color: 'var(--foreground-muted)' }}>Daily limit reached 🌙</p>
            {!isLoggedIn && <button className="px-4 py-2 rounded-lg text-sm font-medium text-white" style={{ background: '#7C3AED' }}>Login for more</button>}
          </div>
        ) : (
          <div className="flex gap-2 items-end">
            <textarea value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
              placeholder="Say something... 🌙" rows={1} className="flex-1 resize-none rounded-xl px-4 py-3 text-sm outline-none"
              style={{ background: 'var(--input-bg)', color: 'var(--foreground)', border: '1px solid var(--border)', maxHeight: '120px' }} />
            <button onClick={handleSend} disabled={!input.trim() || isLoading}
              className="px-5 py-3 rounded-xl font-medium text-white disabled:opacity-40" style={{ background: '#7C3AED' }}>Send</button>
          </div>
        )}
      </div>
    </div>
  );
}
