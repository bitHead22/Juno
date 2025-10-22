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
      console.error("Error removing saved Opening:", deleteError);
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
      console.error("Error saving Openings:", insertError);
      return data;
    }

    return data;
  }
}

// Read single Opening
export async function getSingleOpening(token, { opening_id }) {
  const supabase = await supabaseClient(token);
  let query = supabase
    .from("openings")
    .select(
      "*, club: clubs(name,logo_url), applications: applications(*)"
    )
    .eq("id", opening_id)
    .single();

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching Openings:", error);
    return null;
  }

  return data;
}

// - opening isOpen toggle - (recruiter_id = auth.uid())
export async function updateHiringStatus(token, { opening_id }, isOpen) {
  const supabase = await supabaseClient(token);
  const { data, error } = await supabase
    .from("openings")
    .update({ isOpen })
    .eq("id", opening_id)
    .select();

  if (error) {
    console.error("Error Updating Hiring Status:", error);
    return null;
  }

  return data;
}

// - post opening
export async function addNewOpening(token, _, openingData) {
  const supabase = await supabaseClient(token);

  const { data, error } = await supabase
    .from("openings")
    .insert([openingData])
    .select();

  if (error) {
    console.error(error);
    throw new Error("Error Creating Opening");
  }

  return data;
}


// Read Saved Openings
export async function getSavedOpenings(token) {
  const supabase = await supabaseClient(token);
  const { data, error } = await supabase
    .from("saved_openings")
    .select("*, opening: openings(*, club: clubs(name,logo_url))");

  if (error) {
    console.error("Error fetching Saved Openings:", error);
    return null;
  }

  return data;
}

// get my created openings
export async function getMyOpenings(token, { recruiter_id }) {
  const supabase = await supabaseClient(token);

  const { data, error } = await supabase
    .from("openings")
    .select("*, club: clubs(name,logo_url)")
    .eq("recruiter_id", recruiter_id);

  if (error) {
    console.error("Error fetching Openings:", error);
    return null;
  }

  return data;
}

// Delete opening
export async function deleteOpening(token, { opening_id }) {
  const supabase = await supabaseClient(token);

  const { data, error: deleteError } = await supabase
    .from("openings")
    .delete()
    .eq("id", opening_id)
    .select();

  if (deleteError) {
    console.error("Error deleting opening:", deleteError);
    return data;
  }

  return data;
}