import supabase, { supabaseUrl } from "./supabase";

/******************** GET CABIN ********************/
// return all fields of cabins table
// from = name of the table
// select = fields
export async function getCabins() {
  let { data, error } = await supabase.from("cabins").select("*");

  if (error) {
    console.error(error);
    throw new Error("Cabins could not be loaded");
  }
  console.log("data", data);

  return data;
}

/******************** DELETE CABIN ********************/
export async function deleteCabin(id) {
  const { data, error } = await supabase.from("cabins").delete().eq("id", id);

  if (error) {
    console.error(error);
    throw new Error("Cabin could not be deleted");
  }
  return data;
}

/******************** EDIT AND CREATE CABIN ********************/
// we need to makesure that this name is unique
// If cabin name contains '/' , then Supabase will create folders.
// So, replaceAll() was used to replace All slashes with ''
export async function createEditCabin(newCabin, id) {
  const hasImagePath = newCabin.image?.startsWith?.(supabaseUrl);
  const imageName = `${Math.random()}-${newCabin.image.name}`.replaceAll(
    "/",
    "",
  );

  //supabaseUrl comes from supabase.js
  const imagePath = hasImagePath
    ? newCabin.image
    : `${supabaseUrl}/storage/v1/object/public/cabin-images/${imageName}`;

  let query = supabase.from("cabins");

  //1-A. Create
  if (!id) query = query.insert([{ ...newCabin, image: imagePath }]);

  //1-B. Edit
  if (id) query = query.update({ ...newCabin, image: imagePath }).eq("id", id);

  const { data, error } = await query.select().single();

  //2. upload image:
  if (hasImagePath) return data;

  const { error: storageError } = await supabase.storage
    .from("cabin-images") //select the bucket
    .upload(imageName, newCabin.image);

  if (error) {
    console.error(error);
    throw new Error("Cabin could not be created");
  }

  // 3. delete the cabin if there was an error uploading the corresponding img
  if (storageError) {
    await supabase.from("cabins").delete().eq("id", data.id); // or .eq("id", data[0].id);?
    console.error(storageError);
    throw new Error(
      "Cabin image could not be uploaded and cabin image was not created ",
    );
  }

  return data;
}
