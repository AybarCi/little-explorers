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
            // Get users sorted by total_points with avatar info
            const { data, error } = await supabase
                .from("users")
                .select("id, full_name, total_points, age_group, current_avatar_id, current_frame_id, current_badge_id")
                .order("total_points", { ascending: false })
                .limit(limit);

            if (error) {
                console.error("Points leaderboard error:", error);
                throw error;
            }

            // Get avatar, frame, badge details for all users
            const avatarIds = (data || []).map(u => u.current_avatar_id).filter(Boolean);
            const frameIds = (data || []).map(u => u.current_frame_id).filter(Boolean);
            const badgeIds = (data || []).map(u => u.current_badge_id).filter(Boolean);

            const [avatarsRes, framesRes, badgesRes] = await Promise.all([
                avatarIds.length > 0
                    ? supabase.from("avatars").select("id, emoji, image_key, category").in("id", avatarIds)
                    : { data: [] },
                frameIds.length > 0
                    ? supabase.from("frames").select("id, color_primary, color_secondary").in("id", frameIds)
                    : { data: [] },
                badgeIds.length > 0
                    ? supabase.from("badges").select("id, emoji").in("id", badgeIds)
                    : { data: [] },
            ]);

            const avatarsMap = new Map<any, any>((avatarsRes.data || []).map((a: any) => [a.id, a]));
            const framesMap = new Map<any, any>((framesRes.data || []).map((f: any) => [f.id, f]));
            const badgesMap = new Map<any, any>((badgesRes.data || []).map((b: any) => [b.id, b]));

            leaderboard = (data || []).map((user, index) => {
                const avatar = avatarsMap.get(user.current_avatar_id);
                const frame = framesMap.get(user.current_frame_id);
                const badge = badgesMap.get(user.current_badge_id);

                return {
                    rank: index + 1,
                    user_id: user.id,
                    name: user.full_name,
                    value: user.total_points || 0,
                    age_group: user.age_group,
                    // Avatar info
                    avatar_emoji: avatar?.emoji || null,
                    avatar_image_key: avatar?.image_key || null,
                    avatar_category: avatar?.category || null,
                    // Frame info
                    frame_color: frame?.color_primary || null,
                    frame_color_secondary: frame?.color_secondary || null,
                    // Badge info
                    badge_emoji: badge?.emoji || null,
                };
            });
        } else if (type === "score") {
            // Get ALL users first to ensure everyone is listed
            const { data: usersData, error: usersError } = await supabase
                .from("users")
                .select("id, full_name, age_group, current_avatar_id, current_frame_id, current_badge_id");

            if (usersError) throw usersError;

            // Get game progress to calculate scores
            // Note: For larger scale, this should be an RPC or materialized view
            const { data: progressData, error: progressError } = await supabase
                .from("game_progress")
                .select("user_id, score");

            if (progressError) throw progressError;

            // Aggregate scores by user
            const userScores: Record<string, number> = {};
            (progressData || []).forEach((p: any) => {
                userScores[p.user_id] = (userScores[p.user_id] || 0) + (p.score || 0);
            });

            // Get avatar, frame, badge details
            const avatarIds = (usersData || []).map(u => u.current_avatar_id).filter(Boolean);
            const frameIds = (usersData || []).map(u => u.current_frame_id).filter(Boolean);
            const badgeIds = (usersData || []).map(u => u.current_badge_id).filter(Boolean);

            const [avatarsRes, framesRes, badgesRes] = await Promise.all([
                avatarIds.length > 0
                    ? supabase.from("avatars").select("id, emoji, image_key, category").in("id", avatarIds)
                    : { data: [] },
                frameIds.length > 0
                    ? supabase.from("frames").select("id, color_primary, color_secondary").in("id", frameIds)
                    : { data: [] },
                badgeIds.length > 0
                    ? supabase.from("badges").select("id, emoji").in("id", badgeIds)
                    : { data: [] },
            ]);

            const avatarsMap = new Map<any, any>((avatarsRes.data || []).map((a: any) => [a.id, a]));
            const framesMap = new Map<any, any>((framesRes.data || []).map((f: any) => [f.id, f]));
            const badgesMap = new Map<any, any>((badgesRes.data || []).map((b: any) => [b.id, b]));

            // Create leaderboard from users list
            leaderboard = (usersData || [])
                .map((user: any) => {
                    const score = userScores[user.id] || 0;
                    const avatar = avatarsMap.get(user.current_avatar_id);
                    const frame = framesMap.get(user.current_frame_id);
                    const badge = badgesMap.get(user.current_badge_id);

                    return {
                        user_id: user.id,
                        name: user.full_name || "Bilinmeyen",
                        value: score,
                        age_group: user.age_group || "",
                        avatar_emoji: avatar?.emoji || null,
                        avatar_image_key: avatar?.image_key || null,
                        avatar_category: avatar?.category || null,
                        frame_color: frame?.color_primary || null,
                        frame_color_secondary: frame?.color_secondary || null,
                        badge_emoji: badge?.emoji || null,
                    };
                })
                .sort((a, b) => b.value - a.value)
                .slice(0, limit)
                .map((item, index) => ({ ...item, rank: index + 1 }));
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
