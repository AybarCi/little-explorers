import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.58.0";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
    if (req.method === "OPTIONS") {
        return new Response(null, { status: 200, headers: corsHeaders });
    }

    try {
        const url = new URL(req.url);
        const userId = url.searchParams.get("user_id");

        const supabase = createClient(
            Deno.env.get("SUPABASE_URL") || "",
            Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""
        );

        // Get all shop items
        const [avatarsRes, framesRes, badgesRes] = await Promise.all([
            supabase.from("avatars").select("*").order("sort_order"),
            supabase.from("frames").select("*").order("sort_order"),
            supabase.from("badges").select("*").order("sort_order"),
        ]);

        // Get user's inventory if userId provided
        let inventory: string[] = [];
        let userProfile = null;

        if (userId) {
            const { data: invData } = await supabase
                .from("user_inventory")
                .select("item_type, item_id")
                .eq("user_id", userId);

            inventory = (invData || []).map(
                (item: any) => `${item.item_type}_${item.item_id}`
            );

            const { data: userData } = await supabase
                .from("users")
                .select("current_avatar_id, current_frame_id, current_badge_id, diamonds")
                .eq("id", userId)
                .single();

            userProfile = userData;
        }

        // Group avatars by category
        const emojiAvatars = (avatarsRes.data || []).filter(
            (a: any) => a.category === "emoji"
        );
        const premiumAvatars = (avatarsRes.data || []).filter(
            (a: any) => a.category === "premium"
        );

        return new Response(
            JSON.stringify({
                avatars: {
                    emoji: emojiAvatars,
                    premium: premiumAvatars,
                },
                frames: framesRes.data || [],
                badges: badgesRes.data || [],
                inventory,
                userProfile,
            }),
            { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    } catch (error) {
        console.error("Get shop items error:", error);
        return new Response(
            JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }
});
