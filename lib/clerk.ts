import { auth, currentUser } from "@clerk/nextjs/server";
import { getSupabaseAdmin } from "./supabase";

export async function getUserRole(): Promise<"admin" | "customer" | null> {
  const { userId } = await auth();
  if (!userId) return null;

  const supabase = getSupabaseAdmin();
  const { data } = await supabase
    .from("profiles")
    .select("role")
    .eq("clerk_id", userId)
    .single();

  return (data?.role as "admin" | "customer") ?? "customer";
}

export async function isAdmin(): Promise<boolean> {
  const role = await getUserRole();
  return role === "admin";
}

export async function ensureProfile() {
  const { userId } = await auth();
  if (!userId) return;

  const user = await currentUser();
  const supabase = getSupabaseAdmin();

  const { data } = await supabase
    .from("profiles")
    .select("id")
    .eq("clerk_id", userId)
    .single();

  if (!data) {
    await supabase.from("profiles").insert({
      clerk_id: userId,
      role: "customer",
    });
  }
}
