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
          category,
          points
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

        // Calculate stats from progress data dynamically
        let totalTimeFromProgress = 0;
        let calculatedTotalScore = 0;
        let calculatedCompletedGames = 0;

        progressData?.forEach((progress: any) => {
            const category = progress.games?.category;
            const points = progress.score || 0;

            // Increment global stats
            calculatedCompletedGames++;
            calculatedTotalScore += points;
            totalTimeFromProgress += progress.time_spent || 0;

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
            categories[category].score += points; // Use game points for category score too
            categories[category].time += progress.time_spent || 0;
        });

        // Use calculated values instead of users table values to ensure consistency
        const totalScore = calculatedTotalScore;
        const completedGames = calculatedCompletedGames;
        const totalGamesInApp = gamesData?.length || 0;

        // Average score is based on the actual game scores (performance), not the base points
        // Wait, if we want "Average Score" to reflect performance, we should average the 'score' field from game_progress
        // Let's calculate average performance score
        let totalPerformanceScore = 0;
        progressData?.forEach((p: any) => {
            totalPerformanceScore += p.score || 0;
        });

        const averageScore = completedGames > 0 ? Math.round(totalPerformanceScore / completedGames) : 0;

        // Sync fixed values back to users table if they differ (self-healing)
        if (userData && (userData.total_points !== totalScore || userData.completed_games_count !== completedGames)) {
            console.log('Fixing user stats mismatch:', {
                old: { points: userData.total_points, count: userData.completed_games_count },
                new: { points: totalScore, count: completedGames }
            });

            supabase.from("users").update({
                total_points: totalScore,
                completed_games_count: completedGames
            }).eq("id", userId).then(({ error }) => {
                if (error) console.error('Failed to auto-fix user stats:', error);
            });
        }

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
