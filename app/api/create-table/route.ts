import { ensureDatabase } from "@/utils/data";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  await ensureDatabase();

  return NextResponse.json({}, { status: 200 });
}
