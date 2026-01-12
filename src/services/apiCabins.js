import supabase from "./supabase";

// return all fields of cabins table
// from = name of the table
// select = fields
export async function getCabins() {
  let { data, error } = await supabase.from("cabins").select("*");

  if (error) {
    console.error(error);
    throw new Error("Cabins could not be loaded");
  }

  return data;
}

//export default getCabins;
