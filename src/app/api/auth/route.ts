import { NextRequest, NextResponse } from "next/server";

// Simple JWT-like encode (NOT for production - just for MVP demo)
function base64Encode(obj: object): string {
  return Buffer.from(JSON.stringify(obj)).toString("base64");
}

function base64Decode(str: string): object | null {
  try {
    return JSON.parse(Buffer.from(str, "base64").toString("utf-8"));
  } catch {
    return null;
  }
}

// In-memory user store (MVP - use a real DB in production)
const users = new Map<string, { password: string; name: string; createdAt: number }>();

export async function POST(req: NextRequest) {
  try {
    const { action, email, password, name } = await req.json();

    if (action === "register") {
      if (!email || !password) {
        return NextResponse.json({ error: "Email and password required" }, { status: 400 });
      }
      if (password.length < 8 || !/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
        return NextResponse.json({ error: "Password must be 8+ chars with letters and numbers" }, { status: 400 });
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
      }
      if (users.has(email)) {
        return NextResponse.json({ error: "User already exists" }, { status: 409 });
      }

      users.set(email, { password, name: name || email.split("@")[0], createdAt: Date.now() });
      const token = base64Encode({ email, createdAt: Date.now() });
      return NextResponse.json({ token, user: { email, name: name || email.split("@")[0] } });
    }

    if (action === "login") {
      if (!email || !password) {
        return NextResponse.json({ error: "Email and password required" }, { status: 400 });
      }
      const user = users.get(email);
      if (!user || user.password !== password) {
        return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
      }
      const token = base64Encode({ email, createdAt: Date.now() });
      return NextResponse.json({ token, user: { email, name: user.name } });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
