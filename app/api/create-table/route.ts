import { ensureDatabase } from "@/utils/data";

export async function GET(request: Request) {
  await ensureDatabase();
}
