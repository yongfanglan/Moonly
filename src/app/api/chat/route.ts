import { NextRequest, NextResponse } from 'next/server';

const DASHSCOPE_KEY = process.env.DASHSCOPE_API_KEY || 'sk-9f8fdbd4a2dd48e495b87631878e98bc';
const MODEL = 'qwen-turbo';

const FALLBACK: Record<string, string> = {
  hello: "Hey there! 💜 So good to hear from you. How's your night going?",
  sad: "I'm really sorry you're feeling this way. 💙 I'm here to listen. What's on your mind?",
  lonely: "You're not alone — I'm right here with you 🌙",
  tired: "Rest is so important. Take it easy tonight 💜",
  happy: "That makes me so happy! 🌞 What's made your day better?",
  default: "I'm here for you 🌙 Tell me more about what's on your mind?",
};

function getFallback(input: string) {
  const l = input.toLowerCase();
  for (const [k, v] of Object.entries(FALLBACK)) {
    if (l.includes(k) && k !== 'default') return v;
  }
  return FALLBACK.default;
}

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid messages' }, { status: 400 });
    }
    const last = messages[messages.length - 1]?.content || '';

    // Build DashScope messages
    const dashscopeMessages = messages.map((m: { role: string; content: string }) => {
      let role = 'user';
      if (m.role === 'system') role = 'system';
      else if (m.role === 'assistant') role = 'assistant';
      return { role, content: m.content };
    });

    const response = await fetch('https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${DASHSCOPE_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL,
        input: { messages: dashscopeMessages },
        parameters: { temperature: 0.8, max_tokens: 300, result_format: 'message' },
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('DashScope error:', errText);
      return NextResponse.json({ reply: getFallback(last) });
    }

    const data = await response.json();
    const reply = data.output?.choices?.[0]?.message?.content || getFallback(last);
    return NextResponse.json({ reply });

  } catch (err) {
    console.error('Chat API error:', err);
    return NextResponse.json(
      { reply: "I'm having trouble connecting right now. Please try again 🌙" },
      { status: 200 }
    );
  }
}
