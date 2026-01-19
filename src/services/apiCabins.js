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

/******************** CREATE CABIN ********************/
// just pass the object. The fields that we have in the CreateCabinForm (in the ...resgister("name"))
// is exactly the same that we have in the Supabase table.
export async function createCabin(newCabin) {
  //we need to makesure that this name is unique
  //If cabin name contains any slash / , then Supabase will create folders and
  //we don't want that. So, replaceAll() was used.
  // It will replace All slashes with ''
  const imageName = `${Math.random()}-${newCabin.image.name}`.replaceAll(
    "/",
    "",
  );

  //supabaseUrl comes from supabase.js
  const imagePath = `${supabaseUrl}/storage/v1/object/public/cabin-images/${imageName}`;

  //1. create a cabin
  const { data, error } = await supabase
    .from("cabins")
    .insert([{ ...newCabin, image: imagePath }])
    .select();

  if (error) {
    console.error(error);
    throw new Error("Cabin could not be created");
  }

  //2. upload image
  const { error: storageError } = await supabase.storage
    .from("cabin-images")
    .upload(imageName, newCabin.image);

  // 3. delete the cabin if thre was an error uploading the corresponding img
  if (storageError) {
    await supabase.from("cabins").delete().eq("id", data.id);
    console.error(storageError);
    throw new Error(
      "Cabin image could not be uploaded and cabin image was not created ",
    );
  }

  return data;
}
