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
    const requestData = await req.json();
    const { user_id, game_id, score, completed, time_spent, progress_data } = requestData;
    console.log('Incoming progress payload:', { user_id, game_id, score, completed, time_spent });
    const authHeader = req.headers.get('authorization') || req.headers.get('Authorization') || '';
    const apikeyHeader = req.headers.get('apikey') || req.headers.get('Apikey') || '';
    console.log('Request headers preview:', {
      authorization: authHeader ? authHeader.substring(0, 16) + '...' : 'none',
      apikey: apikeyHeader ? apikeyHeader.substring(0, 12) + '...' : 'none'
    });

    if (!user_id || !game_id) {
      return new Response(
        JSON.stringify({ error: "user_id and game_id are required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") || "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || Deno.env.get("SUPABASE_ANON_KEY") || ""
    );

    console.log('Processing game progress for user:', user_id, 'game:', game_id);

    const { data: existingProgress, error: existingError } = await supabase
      .from("game_progress")
      .select("*")
      .eq("user_id", user_id)
      .eq("game_id", game_id)
      .maybeSingle();

    if (existingError) {
      console.error('Error checking existing progress:', existingError);
      return new Response(
        JSON.stringify({ error: "Failed to check existing progress" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Get user data
    const { data: userData, error: userDataError } = await supabase
      .from("users")
      .select("total_points, completed_games_count")
      .eq("id", user_id)
      .single();

    if (userDataError) {
      console.error('Error fetching user data:', userDataError);
    }

    // Get game's base points value
    const { data: gameData, error: gameDataError } = await supabase
      .from("games")
      .select("points")
      .eq("id", game_id)
      .single();

    if (gameDataError) {
      console.error('Error fetching game data:', gameDataError);
    }

    const gameBasePoints = gameData?.points || 0;
    console.log('Game base points:', gameBasePoints);

    let result;
    let pointsToAdd = 0;
    let completedGamesToAdd = 0;

    if (existingProgress) {
      const updateData: any = {
        updated_at: new Date().toISOString(),
      };

      // High Score Logic: Only update score if new score is higher
      if (score !== undefined) {
        if (!existingProgress.score || score > existingProgress.score) {
          updateData.score = score;
        }
      }

      // UNLIMITED GRIND LOGIC:
      // Always mark as completed if it is completed
      if (completed) {
        updateData.completed = true;

        // Always increment completed games count for the user stats
        completedGamesToAdd = 1;

        // Always add FULL game base points AND the Game Score to the user stats
        // This allows users to "farm" points and climb leaderboards based on SKILL (Score) + EFFORT (Base Points)
        pointsToAdd = gameBasePoints + (score || 0);
      }

      if (time_spent !== undefined) {
        updateData.time_spent = (existingProgress.time_spent || 0) + time_spent;
      }

      if (progress_data !== undefined) {
        updateData.progress_data = progress_data;
      }

      console.log('Updating existing progress:', updateData);

      const { data, error } = await supabase
        .from("game_progress")
        .update(updateData)
        .eq("id", existingProgress.id)
        .select()
        .single();

      if (error) {
        console.error('Update error:', error);
        throw new Error(`Failed to update progress: ${error.message}`);
      }
      result = data;
      console.log('Progress update result:', { id: result.id, score: result.score, completed: result.completed, time_spent: result.time_spent });
    } else {
      console.log('Inserting new progress');

      const { data, error } = await supabase
        .from("game_progress")
        .insert([
          {
            user_id: user_id,
            game_id: game_id,
            score: score || 0,
            completed: completed || false,
            time_spent: time_spent || 0,
            progress_data: progress_data || {},
          },
        ])
        .select()
        .single();

      if (error) {
        console.error('Insert error:', error);
        throw new Error(`Failed to insert progress: ${error.message}`);
      }
      result = data;
      console.log('Progress insert result:', { id: result.id, score: result.score, completed: result.completed, time_spent: result.time_spent });

      // Use game's base points for user's total_points, not the player score
      pointsToAdd = completed ? gameBasePoints : 0;
      completedGamesToAdd = completed ? 1 : 0;
    }

    // Update user stats
    if (pointsToAdd > 0 || completedGamesToAdd > 0) {
      const newTotalPoints = (userData?.total_points || 0) + pointsToAdd;
      const newCompletedCount = (userData?.completed_games_count || 0) + completedGamesToAdd;

      console.log('Updating user stats:', { newTotalPoints, newCompletedCount });

      const { error: userUpdateError } = await supabase
        .from("users")
        .update({
          total_points: newTotalPoints,
          completed_games_count: newCompletedCount,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user_id);

      if (userUpdateError) {
        console.error('Failed to update user stats:', userUpdateError);
      } else {
        console.log('User stats updated successfully');
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        progress: result,
        new_total_points: pointsToAdd > 0 ? (userData?.total_points || 0) + pointsToAdd : undefined,
        new_completed_games_count: completedGamesToAdd > 0 ? (userData?.completed_games_count || 0) + completedGamesToAdd : undefined
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error('Game progress error:', error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
        details: error instanceof Error ? error.message : "Unknown error occurred while saving progress"
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
