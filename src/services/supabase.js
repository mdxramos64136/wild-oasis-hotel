import { createClient } from "@supabase/supabase-js";

export const supabaseUrl = "https://kaqpopgsrqnpsioynwiv.supabase.co";
const supabaseKey = "sb_publishable_NMeuAjghi0-QctXcgetUzQ_30Iz0dTw";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
