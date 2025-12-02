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

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") || "",
      Deno.env.get("SUPABASE_ANON_KEY") || ""
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
      const { data: progressData } = await supabase
        .from("game_progress")
        .select("game_id, score, completed")
        .eq("user_id", userId);

      const progressMap = new Map(
        progressData?.map((p) => [p.game_id, { score: p.score, completed: p.completed }]) || []
      );

      const gamesWithProgress = games?.map((game) => ({
        ...game,
        user_progress: progressMap.get(game.id) || null,
      }));

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
