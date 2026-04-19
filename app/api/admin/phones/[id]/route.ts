import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { isAdmin } from "@/lib/clerk";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { userId } = await auth();
  if (!userId || !(await isAdmin())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const body = await req.json();
  const supabase = getSupabaseAdmin();

  const { error } = await supabase
    .from("phones")
    .update(body)
    .eq("id", params.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const { userId } = await auth();
  if (!userId || !(await isAdmin())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("phones").delete().eq("id", params.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
