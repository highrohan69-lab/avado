import { supabase } from "@/lib/supabase";

export async function signUp(email, password) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  if (error) throw error;
  return data;
}

export async function login(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
}

export async function logout() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

// Guest user creation or retrieval
export async function getOrCreateGuest() {
  let guestId = localStorage.getItem("guest_user_id");

  if (guestId) {
    // Check if guest exists
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", guestId)
      .maybeSingle();

    if (data) return data;
  }

  // Create new guest
  const { data, error } = await supabase.from("users").insert({
    email: null,
    phone: null,
    is_guest: true,
  }).select().maybeSingle();

  if (error) throw error;

  localStorage.setItem("guest_user_id", data.id);
  return data;
}
