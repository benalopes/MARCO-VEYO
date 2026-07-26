import { NextResponse } from "next/server";
import { clearAdminSession } from "@/lib/auth";

/**
 * Encerra a sessão administrativa.
 * @returns Confirmação de logout
 */
export async function POST() {
  await clearAdminSession();
  return NextResponse.json({ ok: true });
}
