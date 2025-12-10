import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.58.0";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface ClaimRequest {
    user_id: string;
    challenge_id: string;
    challenge_type: 'daily' | 'weekly' | 'special';
    reward_points: number;
    challenge_round: number;
}

Deno.serve(async (req: Request) => {
    if (req.method === "OPTIONS") {
        return new Response(null, {
            status: 200,
            headers: corsHeaders,
        });
    }

    try {
        const requestData: ClaimRequest = await req.json();
        const { user_id, challenge_id, challenge_type, reward_points, challenge_round } = requestData;

        console.log('Claim challenge request:', { user_id, challenge_id, challenge_type, reward_points, challenge_round });

        if (!user_id || !challenge_id || !challenge_type || reward_points === undefined) {
            return new Response(
                JSON.stringify({ error: "user_id, challenge_id, challenge_type, and reward_points are required" }),
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

        // Check if already claimed in current round
        const { data: existingClaim, error: checkError } = await supabase
            .from("challenge_claims")
            .select("id")
            .eq("user_id", user_id)
            .eq("challenge_id", challenge_id)
            .eq("challenge_round", challenge_round || 1)
            .maybeSingle();

        if (checkError) {
            console.error('Error checking existing claim:', checkError);
            return new Response(
                JSON.stringify({ error: "Failed to check claim status" }),
                {
                    status: 500,
                    headers: { ...corsHeaders, "Content-Type": "application/json" },
                }
            );
        }

        if (existingClaim) {
            return new Response(
                JSON.stringify({ error: "Challenge already claimed", already_claimed: true }),
                {
                    status: 400,
                    headers: { ...corsHeaders, "Content-Type": "application/json" },
                }
            );
        }

        // Get user's current points
        const { data: userData, error: userError } = await supabase
            .from("users")
            .select("total_points")
            .eq("id", user_id)
            .single();

        if (userError) {
            console.error('Error fetching user:', userError);
            return new Response(
                JSON.stringify({ error: "User not found" }),
                {
                    status: 404,
                    headers: { ...corsHeaders, "Content-Type": "application/json" },
                }
            );
        }

        const newTotalPoints = (userData.total_points || 0) + reward_points;

        // Insert claim record
        const { error: insertError } = await supabase
            .from("challenge_claims")
            .insert({
                user_id,
                challenge_id,
                challenge_type,
                reward_points,
                challenge_round: challenge_round || 1,
            });

        if (insertError) {
            console.error('Error inserting claim:', insertError);
            return new Response(
                JSON.stringify({ error: "Failed to record claim" }),
                {
                    status: 500,
                    headers: { ...corsHeaders, "Content-Type": "application/json" },
                }
            );
        }

        // Update user's total points
        const { error: updateError } = await supabase
            .from("users")
            .update({
                total_points: newTotalPoints,
                updated_at: new Date().toISOString(),
            })
            .eq("id", user_id);

        if (updateError) {
            console.error('Error updating user points:', updateError);
            return new Response(
                JSON.stringify({ error: "Failed to update points" }),
                {
                    status: 500,
                    headers: { ...corsHeaders, "Content-Type": "application/json" },
                }
            );
        }

        console.log('Challenge claimed successfully:', { user_id, challenge_id, reward_points, newTotalPoints });

        return new Response(
            JSON.stringify({
                success: true,
                reward_points,
                new_total_points: newTotalPoints,
            }),
            {
                status: 200,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
        );
    } catch (error) {
        console.error('Claim challenge error:', error);
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
