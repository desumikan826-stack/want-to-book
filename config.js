// config.js
const supabaseUrl = "https://eqgyfkxiecozflnbypkl.supabase.co";
const supabaseKey = "sb_publishable_3MQXaPuO9U3O_zub0LPoGg_N2pIYkIJ";

// windowオブジェクトに持たせることで、他のファイルからも使えるようにします
window.supabaseConnection = window.supabase.createClient(supabaseUrl, supabaseKey);
console.log("Supabaseの初期化に成功しました");