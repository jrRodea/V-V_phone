import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { isAdmin } from "@/lib/clerk";

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId || !(await isAdmin())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const body = await req.json();
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase.from("phones").insert(body).select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
