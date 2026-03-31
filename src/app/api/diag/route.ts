import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function GET() {
  const diag = {
    env: {
      BETTER_AUTH_URL: process.env.BETTER_AUTH_URL || "MISSING",
      DATABASE_URL_SET: !!process.env.DATABASE_URL,
      NODE_ENV: process.env.NODE_ENV,
      PORT: process.env.PORT || "NOT SET (Defaulting to 3000/8080)",
    },
    db: "Checking...",
  };

  try {
    const res = await pool.query("SELECT 1 as connection_test");
    diag.db = res.rows[0].connection_test === 1 ? "OK" : "ERROR";
  } catch (e: unknown) {
    diag.db = `FAILED: ${e instanceof Error ? e.message : String(e)}`;
  }

  return NextResponse.json(diag);
}
