import supabaseClient from "@/utils/supabase";

export async function getOpenings(token, { location, club_id, searchQuery }) {
  const supabase = await supabaseClient(token);

  let query = supabase.from("openings").select("*, club: clubs(name, logo_url), saved: saved_openings(id)");

  if (location) {
    query = query.eq("location", location);
  }

  if (club_id) {
    query = query.eq("club_id", club_id);
  }

  if (searchQuery) {
    query = query.ilike("title", `%${searchQuery}%`);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Erorr Fetching Openings:", error);
    return null;
  }

  return data;
}


// - Add / Remove Saved opening
export async function saveOpening(token, { alreadySaved }, saveData) {
  const supabase = await supabaseClient(token);

  if (alreadySaved) {
    // If the opening is already saved, remove it
    const { data, error: deleteError } = await supabase
      .from("saved_openings")
      .delete()
      .eq("opening_id", saveData.opening_id);

    if (deleteError) {
      console.error("Error removing saved job:", deleteError);
      return data;
    }

    return data;
  } else {
    // If the opening is not saved, add it to saved jobs
    const { data, error: insertError } = await supabase
      .from("saved_openings")
      .insert([saveData])
      .select();

    if (insertError) {
      console.error("Error saving job:", insertError);
      return data;
    }

    return data;
  }
}

