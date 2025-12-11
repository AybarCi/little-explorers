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
        const { user_id } = await req.json();

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
            Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""
        );

        console.log('Deleting account for user:', user_id);

        // Cascade delete user data
        // 1. Delete game progress
        const { error: progressError } = await supabase
            .from("game_progress")
            .delete()
            .eq("user_id", user_id);

        if (progressError) {
            console.error('Error deleting game progress:', progressError);
        }

        // 2. Delete challenge claims
        const { error: claimsError } = await supabase
            .from("challenge_claims")
            .delete()
            .eq("user_id", user_id);

        if (claimsError) {
            console.error('Error deleting challenge claims:', claimsError);
        }

        // 3. Delete user inventory
        const { error: inventoryError } = await supabase
            .from("user_inventory")
            .delete()
            .eq("user_id", user_id);

        if (inventoryError) {
            console.error('Error deleting inventory:', inventoryError);
        }

        // 4. Delete from users table
        const { error: userError } = await supabase
            .from("users")
            .delete()
            .eq("id", user_id);

        if (userError) {
            console.error('Error deleting user:', userError);
            return new Response(
                JSON.stringify({ error: "Failed to delete user data" }),
                {
                    status: 500,
                    headers: { ...corsHeaders, "Content-Type": "application/json" },
                }
            );
        }

        // 5. Delete Supabase Auth user
        const { error: authError } = await supabase.auth.admin.deleteUser(user_id);

        if (authError) {
            console.error('Error deleting auth user:', authError);
            return new Response(
                JSON.stringify({ error: "Failed to delete authentication data" }),
                {
                    status: 500,
                    headers: { ...corsHeaders, "Content-Type": "application/json" },
                }
            );
        }

        console.log('Account deleted successfully:', user_id);

        return new Response(
            JSON.stringify({ success: true }),
            {
                status: 200,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
        );
    } catch (error) {
        console.error('Delete account error:', error);
        return new Response(
            JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
            {
                status: 500,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
        );
    }
});
