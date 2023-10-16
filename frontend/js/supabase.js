console.log("Initialisierung Supabase");

// Supabase Initialisierung
const supabaseUrl = 'https://lbidntqxkczdgazdxzth.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxiaWRudHF4a2N6ZGdhemR4enRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTYzMTY3MDksImV4cCI6MjAxMTg5MjcwOX0.AGFucn8pcLyC4Lz5ddam4iqtlFwZAeO-w7n3nDVaKVQ'
const supa = supabase.createClient(supabaseUrl, supabaseKey, {
    auth: {
        redirectTo: window.location.origin,  // This will redirect back to the page where the request originated from
    },
});

export { supa }