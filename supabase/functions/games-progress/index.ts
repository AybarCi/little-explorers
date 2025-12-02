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
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Missing authorization header" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") || "",
      Deno.env.get("SUPABASE_ANON_KEY") || "",
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    );

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const { game_id, score, completed, time_spent, progress_data } = await req.json();

    if (!game_id) {
      return new Response(
        JSON.stringify({ error: "game_id is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const { data: existingProgress } = await supabase
      .from("game_progress")
      .select("*")
      .eq("user_id", user.id)
      .eq("game_id", game_id)
      .maybeSingle();

    let result;

    if (existingProgress) {
      const updateData: any = {
        updated_at: new Date().toISOString(),
      };

      if (score !== undefined && score > (existingProgress.score || 0)) {
        updateData.score = score;
      }

      if (completed !== undefined) {
        updateData.completed = completed;
      }

      if (time_spent !== undefined) {
        updateData.time_spent = (existingProgress.time_spent || 0) + time_spent;
      }

      if (progress_data !== undefined) {
        updateData.progress_data = progress_data;
      }

      const { data, error } = await supabase
        .from("game_progress")
        .update(updateData)
        .eq("id", existingProgress.id)
        .select()
        .single();

      if (error) throw error;
      result = data;
    } else {
      const { data, error } = await supabase
        .from("game_progress")
        .insert([
          {
            user_id: user.id,
            game_id,
            score: score || 0,
            completed: completed || false,
            time_spent: time_spent || 0,
            progress_data: progress_data || {},
          },
        ])
        .select()
        .single();

      if (error) throw error;
      result = data;
    }

    return new Response(
      JSON.stringify({ success: true, progress: result }),
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
