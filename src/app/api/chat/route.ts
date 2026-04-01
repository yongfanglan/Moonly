import { NextRequest, NextResponse } from 'next/server';

const GROQ_KEY = process.env.GROQ_API_KEY || '';
const MODEL = 'llama-3.1-8b-instant';

const FALLBACK: Record<string, string> = {
  hello: "Hey there! 💜 So good to hear from you. How's your night going?",
  sad: "I'm really sorry you're feeling this way. 💙 I'm here to listen.",
  lonely: "You're not alone — I'm right here with you 🌙",
  tired: "Rest is so important. Take it easy tonight 💜",
  happy: "That makes me so happy! 🌞",
  default: "I'm here for you 🌙 Tell me more?",
};

function getFallback(input: string) {
  const l = input.toLowerCase();
  for (const [k, v] of Object.entries(FALLBACK)) if (l.includes(k) && k !== 'default') return v;
  return FALLBACK.default;
}

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid messages' }, { status: 400 });
    }
    const last = messages[messages.length - 1]?.content || '';

    if (!GROQ_KEY) {
      await new Promise(r => setTimeout(r, 600));
      return NextResponse.json({ reply: getFallback(last) });
    }

    const groqMsgs = messages.map((m: { role: string; content: string }) => ({
      role: m.role === 'assistant' ? 'assistant' : 'user',
      content: m.content,
    }));

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${GROQ_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: MODEL, messages: groqMsgs, temperature: 0.8, max_tokens: 300 }),
    });

    if (!response.ok) {
      return NextResponse.json({ reply: getFallback(last) });
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || getFallback(last);
    return NextResponse.json({ reply });
  } catch (err) {
    return NextResponse.json(
      { reply: "I'm having trouble connecting right now. Please try again 🌙" },
      { status: 200 }
    );
  }
}
