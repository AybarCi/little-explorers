import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.58.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const url = new URL(req.url);
    const category = url.searchParams.get("category");
    const difficulty = url.searchParams.get("difficulty");
    const userId = url.searchParams.get("user_id");

    console.log('Games-list function called with params:', { category, difficulty, userId });
    console.log('Full URL:', req.url);

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") || "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || Deno.env.get("SUPABASE_ANON_KEY") || ""
    );

    let query = supabase
      .from("games")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (category) {
      query = query.eq("category", category);
    }

    if (difficulty) {
      query = query.eq("difficulty", difficulty);
    }

    const { data: games, error: gamesError } = await query;

    if (gamesError) {
      return new Response(
        JSON.stringify({ error: gamesError.message }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (userId) {
      console.log('Fetching game_progress for userId:', userId);
      
      const { data: progressData, error: progressError } = await supabase
        .from("game_progress")
        .select("game_id, score, completed, time_spent")
        .eq("user_id", userId);

      console.log('Game_progress query result:', { progressData, progressError });
      console.log('Progress data count:', progressData?.length || 0);

      const progressMap = new Map(
        progressData?.map((p:any) => [p.game_id, { score: p.score, completed: p.completed, time_spent: p.time_spent }]) || []
      );

      console.log('Progress map created with entries:', progressMap.size);

      const gamesWithProgress = games?.map((game:any) => ({
        ...game,
        user_progress: progressMap.get(game.id) || null,
      }));

      console.log('Games with progress created:', gamesWithProgress?.length || 0);
      console.log('Sample game with progress:', gamesWithProgress?.[0]);

      return new Response(
        JSON.stringify({ games: gamesWithProgress }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({ games }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
