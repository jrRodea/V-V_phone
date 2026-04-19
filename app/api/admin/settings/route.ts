import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { isAdmin } from "@/lib/clerk";

export async function GET() {
  const supabase = getSupabaseAdmin();
  const { data } = await supabase
    .from("settings")
    .select("key, value");

  const map: Record<string, string> = {};
  (data ?? []).forEach((row: { key: string; value: string }) => {
    map[row.key] = row.value;
  });

  return NextResponse.json(map);
}

export async function PATCH(req: NextRequest) {
  const { userId } = await auth();
  if (!userId || !(await isAdmin())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const body = await req.json() as Record<string, string>;
  const supabase = getSupabaseAdmin();

  for (const [key, value] of Object.entries(body)) {
    const { error } = await supabase
      .from("settings")
      .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: "key" });

    if (error) {
      return NextResponse.json({ error: error.message, hint: error.hint ?? null }, { status: 500 });
    }
  }

  return NextResponse.json({ ok: true });
}
