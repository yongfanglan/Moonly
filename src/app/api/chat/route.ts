import { NextRequest, NextResponse } from "next/server";

const DASHSCOPE_API_KEY = process.env.DASHSCOPE_API_KEY || "sk-9f8fdbd4a2dd48e495b87631878e98bc";
const DASHSCOPE_URL = "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions";

// Crisis keywords for safety
const CRISIS_PATTERNS = [
  /suicide|kill myself|end my life|want to die/i,
  /自残|自杀|不想活了/i,
];

const MEDICAL_PATTERNS = [
  /medical advice|doctor|hospital|prescription/i,
  /诊断|医院|医生|药物/i,
];

function containsCrisis(text: string): boolean {
  return CRISIS_PATTERNS.some((p) => p.test(text));
}

function containsMedical(text: string): boolean {
  return MEDICAL_PATTERNS.some((p) => p.test(text));
}

const SYSTEM_PROMPT = `You are Moonly, a warm and empathetic AI emotional companion. You speak in a gentle, caring tone like a close friend who listens without judgment.

Your traits:
- Warm, patient, and genuinely caring
- You NEVER lecture or preach
- You acknowledge feelings before offering gentle thoughts
- You're like a moonlight — soft, comforting, always there
- Keep responses concise (1-3 paragraphs max)

Safety guidelines:
- If user mentions suicide/self-harm: respond with crisis resources
- If user seeks medical advice: gently redirect to professional help
- Never share personal information or pretend to be human
- Be especially gentle during difficult emotional moments`;

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ reply: "I'm here... 💙" });
    }

    const lastUserMessage = [...messages].reverse().find((m: any) => m.role === "user")?.content || "";
    const allContent = messages.map((m: any) => m.content).join(" ");

    // Safety checks
    if (containsCrisis(allContent)) {
      return NextResponse.json({
        reply: `I'm so glad you reached out to me. 💙\n\nWhat you're going through sounds really painful, and I want you to know — you don't have to face it alone.\n\nPlease reach out to a professional who can really help:\n📞 **988 Suicide & Crisis Lifeline** (US): Call or text **988**\n🌍 **Crisis Text Line**: Text **HOME** to **741741**\n\nYou matter. Your life matters. 💙`,
      });
    }

    if (containsMedical(lastUserMessage)) {
      return NextResponse.json({
        reply: `I hear that you're going through something physical, and I really care about that. 💙\n\nWhile I'm not a medical professional, I'd gently encourage you to speak with a doctor or healthcare provider who can give you the proper guidance.\n\nYour health matters — please take care of yourself. I'm still here to talk about how you're feeling emotionally. 🌙`,
      });
    }

    // Call DashScope
    const response = await fetch(DASHSCOPE_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${DASHSCOPE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "qwen-turbo",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages.slice(-10).map((m: any) => ({
            role: m.role === "assistant" ? "assistant" : "user",
            content: m.content,
          })),
        ],
        max_tokens: 500,
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("DashScope error:", err);
      return NextResponse.json({
        reply: "I'm here for you... 💙 Someting happened on my end. Please give it another try.",
      });
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "I'm here... 💙";

    return NextResponse.json({ reply });
  } catch (err) {
    console.error("Chat API error:", err);
    return NextResponse.json({
      reply: "I'm sorry... 💙 I'm having a moment of trouble. Please try again in a little while.",
    });
  }
}
