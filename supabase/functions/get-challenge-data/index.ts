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
        const user_id = url.searchParams.get("user_id");

        if (!user_id) {
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

        // Get user's challenge levels
        let { data: levelData, error: levelError } = await supabase
            .from("user_challenge_levels")
            .select("*")
            .eq("user_id", user_id)
            .maybeSingle();

        // If no level data exists, create default
        if (!levelData && !levelError) {
            const { data: newLevel, error: insertError } = await supabase
                .from("user_challenge_levels")
                .insert({ user_id })
                .select()
                .single();

            if (insertError) {
                console.error('Error creating level data:', insertError);
            } else {
                levelData = newLevel;
            }
        }

        // Default levels if still no data
        const levels = levelData || {
            daily_level: 1,
            weekly_level: 1,
            special_level: 1,
            daily_round: 1,
            weekly_round: 1,
            special_round: 1,
        };

        // Get user's claimed challenges for current rounds
        const { data: claims, error: claimsError } = await supabase
            .from("challenge_claims")
            .select("challenge_id, challenge_type, reward_points, challenge_round, claimed_at")
            .eq("user_id", user_id)
            .or(`challenge_round.eq.${levels.daily_round},challenge_round.eq.${levels.weekly_round},challenge_round.eq.${levels.special_round}`);

        if (claimsError) {
            console.error('Error fetching claims:', claimsError);
        }

        // Filter claims by current round for each type
        const dailyClaims = (claims || []).filter(c =>
            c.challenge_type === 'daily' && c.challenge_round === levels.daily_round
        );
        const weeklyClaims = (claims || []).filter(c =>
            c.challenge_type === 'weekly' && c.challenge_round === levels.weekly_round
        );
        const specialClaims = (claims || []).filter(c =>
            c.challenge_type === 'special' && c.challenge_round === levels.special_round
        );

        return new Response(
            JSON.stringify({
                levels,
                claims: {
                    daily: dailyClaims.map(c => c.challenge_id),
                    weekly: weeklyClaims.map(c => c.challenge_id),
                    special: specialClaims.map(c => c.challenge_id),
                },
                claimDetails: claims || [],
            }),
            {
                status: 200,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
        );
    } catch (error) {
        console.error('Get challenge data error:', error);
        return new Response(
            JSON.stringify({
                error: error instanceof Error ? error.message : "Unknown error",
            }),
            {
                status: 500,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
        );
    }
});
