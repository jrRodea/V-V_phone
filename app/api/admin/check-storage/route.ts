import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { isAdmin } from "@/lib/clerk";

export async function GET() {
  const { userId } = await auth();
  if (!userId || !(await isAdmin())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const supabase = getSupabaseAdmin();
  const { data: buckets, error } = await supabase.storage.listBuckets();

  if (error) {
    return NextResponse.json({ error: error.message, hint: "Error conectando con Supabase Storage" }, { status: 500 });
  }

  const bucket = buckets.find((b) => b.name === "phone-images");

  return NextResponse.json({
    buckets: buckets.map((b) => b.name),
    phoneImagesBucketExists: !!bucket,
    hint: bucket
      ? "✅ El bucket phone-images existe correctamente"
      : "❌ El bucket phone-images NO existe. Créalo en Supabase Dashboard → Storage → New Bucket → name: phone-images → Public: ON",
  });
}
