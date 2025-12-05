import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

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
        const userId = url.searchParams.get("user_id");

        if (!userId) {
            return new Response(
                JSON.stringify({ error: "user_id is required" }),
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

        console.log('Fetching user progress for user:', userId);

        // 1. Fetch user data (total_points, completed_games_count)
        const { data: userData, error: userError } = await supabase
            .from("users")
            .select("total_points, completed_games_count")
            .eq("id", userId)
            .single();

        if (userError) {
            console.error('Error fetching user:', userError);
        }

        console.log('User data:', userData);

        // 2. Fetch all active games to get total count per category
        const { data: gamesData, error: gamesError } = await supabase
            .from("games")
            .select("id, category")
            .eq("is_active", true);

        if (gamesError) {
            console.error('Error fetching games:', gamesError);
        }

        console.log('Total games:', gamesData?.length || 0);

        // 3. Fetch user's game progress with game details
        const { data: progressData, error: progressError } = await supabase
            .from("game_progress")
            .select(`
        game_id,
        score,
        completed,
        time_spent,
        games (
          id,
          category
        )
      `)
            .eq("user_id", userId)
            .eq("completed", true);

        if (progressError) {
            console.error('Error fetching progress:', progressError);
        }

        console.log('User progress entries:', progressData?.length || 0);

        // Calculate totals per category from all games
        const categoryTotals: Record<string, number> = {};
        gamesData?.forEach((game: any) => {
            categoryTotals[game.category] = (categoryTotals[game.category] || 0) + 1;
        });

        console.log('Category totals:', categoryTotals);

        // Initialize categories with all categories from games
        const categories: Record<string, { total: number; completed: number; score: number; time: number }> = {};
        Object.keys(categoryTotals).forEach(cat => {
            categories[cat] = {
                total: categoryTotals[cat],
                completed: 0,
                score: 0,
                time: 0
            };
        });

        // Calculate stats from progress data
        let totalTimeFromProgress = 0;

        progressData?.forEach((progress: any) => {
            const category = progress.games?.category;
            if (!category) {
                console.log('Progress without category:', progress);
                return;
            }

            // Ensure category exists
            if (!categories[category]) {
                categories[category] = {
                    total: categoryTotals[category] || 0,
                    completed: 0,
                    score: 0,
                    time: 0
                };
            }

            // Add to category stats (only completed games)
            categories[category].completed += 1;
            categories[category].score += progress.score || 0;
            categories[category].time += progress.time_spent || 0;

            totalTimeFromProgress += progress.time_spent || 0;
        });

        // Get values from users table
        const totalScore = userData?.total_points || 0;
        const completedGames = userData?.completed_games_count || 0;
        const totalGamesInApp = gamesData?.length || 0;
        const averageScore = completedGames > 0 ? Math.round(totalScore / completedGames) : 0;

        console.log('Final stats:', {
            totalScore,
            completedGames,
            totalTime: totalTimeFromProgress,
            averageScore,
            totalGamesInApp
        });
        console.log('Final categories:', categories);

        return new Response(
            JSON.stringify({
                stats: {
                    totalScore,
                    completedGames,
                    totalTime: totalTimeFromProgress,
                    averageScore,
                    totalGamesInApp
                },
                categories
            }),
            {
                status: 200,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
        );
    } catch (error) {
        console.error('Unexpected error:', error);
        return new Response(
            JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
            {
                status: 500,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
        );
    }
});
