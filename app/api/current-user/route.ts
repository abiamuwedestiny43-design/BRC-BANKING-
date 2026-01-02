// /app/api/current-user/route.ts
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser(); // server-side only
    return NextResponse.json({ user });
  } catch (err) {
    return NextResponse.json({ user: null });
  }
}
