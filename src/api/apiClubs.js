import supabaseClient, { supabaseUrl } from "@/utils/supabase";

// Fetch Clubs
export async function getClubs(token) {
  const supabase = await supabaseClient(token);
  const { data, error } = await supabase.from("clubs").select("*");

  if (error) {
    console.error("Error fetching Clubs:", error);
    return null;
  }

  return data;
}

// Add Club
export async function addNewClub(token, _, clubData) {
  const supabase = await supabaseClient(token);

  const random = Math.floor(Math.random() * 90000);
  const fileName = `logo-${random}-${clubData.name}`;

  const { error: storageError } = await supabase.storage
    .from("club-logo")
    .upload(fileName, clubData.logo);

  if (storageError) throw new Error("Error uploading Club Logo");

  const logo_url = `${supabaseUrl}/storage/v1/object/public/club-logo/${fileName}`;

  const { data, error } = await supabase
    .from("clubs")
    .insert([
      {
        name: clubData.name,
        logo_url: logo_url,
      },
    ])
    .select();

  if (error) {
    console.error(error);
    throw new Error("Error submitting Clubs");
  }

  return data;
}