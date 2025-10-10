import supabaseClient, { supabaseUrl } from "@/utils/supabase";

// Fetch Companies
export async function getClubs(token) {
  const supabase = await supabaseClient(token);
  const { data, error } = await supabase.from("clubs").select("*");

  if (error) {
    console.error("Error fetching Clubs:", error);
    return null;
  }

  return data;
}