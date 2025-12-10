import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.58.0";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
    if (req.method === "OPTIONS") {
        return new Response(null, { status: 200, headers: corsHeaders });
    }

    try {
        const url = new URL(req.url);
        const type = url.searchParams.get("type") || "points"; // "points" or "score"
        const limit = parseInt(url.searchParams.get("limit") || "50");

        const supabase = createClient(
            Deno.env.get("SUPABASE_URL") || "",
            Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""
        );

        let leaderboard: any[] = [];

        if (type === "points") {
            // Get users sorted by total_points
            const { data, error } = await supabase
                .from("users")
                .select("id, full_name, total_points, age_group")
                .order("total_points", { ascending: false })
                .limit(limit);

            if (error) {
                console.error("Points leaderboard error:", error);
                throw error;
            }

            leaderboard = (data || []).map((user, index) => ({
                rank: index + 1,
                user_id: user.id,
                name: user.full_name,
                value: user.total_points || 0,
                age_group: user.age_group,
            }));
        } else if (type === "score") {
            // Get sum of scores from game_progress per user
            const { data, error } = await supabase
                .rpc("get_score_leaderboard", { limit_count: limit });

            if (error) {
                console.error("Score leaderboard RPC error:", error);
                // Fallback: manual query if RPC doesn't exist
                const { data: progressData, error: progressError } = await supabase
                    .from("game_progress")
                    .select("user_id, score");

                if (progressError) throw progressError;

                // Aggregate scores by user
                const userScores: Record<string, number> = {};
                (progressData || []).forEach((p: any) => {
                    userScores[p.user_id] = (userScores[p.user_id] || 0) + (p.score || 0);
                });

                // Get user details
                const userIds = Object.keys(userScores);
                const { data: usersData } = await supabase
                    .from("users")
                    .select("id, full_name, age_group")
                    .in("id", userIds);

                const usersMap = new Map((usersData || []).map((u: any) => [u.id, u]));

                // Create leaderboard
                leaderboard = Object.entries(userScores)
                    .map(([userId, score]) => ({
                        user_id: userId,
                        name: usersMap.get(userId)?.full_name || "Bilinmeyen",
                        value: score,
                        age_group: usersMap.get(userId)?.age_group || "",
                    }))
                    .sort((a, b) => b.value - a.value)
                    .slice(0, limit)
                    .map((item, index) => ({ ...item, rank: index + 1 }));
            } else {
                leaderboard = (data || []).map((item: any, index: number) => ({
                    rank: index + 1,
                    user_id: item.user_id,
                    name: item.full_name,
                    value: item.total_score || 0,
                    age_group: item.age_group,
                }));
            }
        }

        return new Response(
            JSON.stringify({ leaderboard, type }),
            { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    } catch (error) {
        console.error("Leaderboard error:", error);
        return new Response(
            JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }
});
