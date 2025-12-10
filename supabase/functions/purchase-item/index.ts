import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.58.0";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface PurchaseRequest {
    user_id: string;
    item_type: "avatar" | "frame" | "badge";
    item_id: string;
}

Deno.serve(async (req: Request) => {
    if (req.method === "OPTIONS") {
        return new Response(null, { status: 200, headers: corsHeaders });
    }

    try {
        const { user_id, item_type, item_id }: PurchaseRequest = await req.json();

        if (!user_id || !item_type || !item_id) {
            return new Response(
                JSON.stringify({ error: "user_id, item_type, and item_id are required" }),
                { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
        }

        const supabase = createClient(
            Deno.env.get("SUPABASE_URL") || "",
            Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""
        );

        // Check if already owned
        const { data: existingItem } = await supabase
            .from("user_inventory")
            .select("id")
            .eq("user_id", user_id)
            .eq("item_type", item_type)
            .eq("item_id", item_id)
            .maybeSingle();

        if (existingItem) {
            return new Response(
                JSON.stringify({ error: "Bu ürüne zaten sahipsin!", already_owned: true }),
                { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
        }

        // Get item price
        const tableName = item_type === "avatar" ? "avatars" : item_type === "frame" ? "frames" : "badges";
        const { data: itemData, error: itemError } = await supabase
            .from(tableName)
            .select("price, name")
            .eq("id", item_id)
            .single();

        if (itemError || !itemData) {
            return new Response(
                JSON.stringify({ error: "Ürün bulunamadı" }),
                { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
        }

        // Get user's diamonds
        const { data: userData, error: userError } = await supabase
            .from("users")
            .select("diamonds")
            .eq("id", user_id)
            .single();

        if (userError || !userData) {
            return new Response(
                JSON.stringify({ error: "Kullanıcı bulunamadı" }),
                { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
        }

        const userDiamonds = userData.diamonds || 0;
        const itemPrice = itemData.price || 0;

        // Check if user has enough diamonds
        if (userDiamonds < itemPrice) {
            return new Response(
                JSON.stringify({
                    error: "Yeterli elmas yok!",
                    insufficient_diamonds: true,
                    required: itemPrice,
                    current: userDiamonds
                }),
                { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
        }

        // Deduct diamonds
        const newDiamonds = userDiamonds - itemPrice;
        const { error: updateError } = await supabase
            .from("users")
            .update({ diamonds: newDiamonds, updated_at: new Date().toISOString() })
            .eq("id", user_id);

        if (updateError) {
            console.error("Failed to update diamonds:", updateError);
            return new Response(
                JSON.stringify({ error: "Elmas güncellenemedi" }),
                { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
        }

        // Add to inventory
        const { error: inventoryError } = await supabase
            .from("user_inventory")
            .insert({ user_id, item_type, item_id });

        if (inventoryError) {
            console.error("Failed to add to inventory:", inventoryError);
            // Rollback diamonds
            await supabase.from("users").update({ diamonds: userDiamonds }).eq("id", user_id);
            return new Response(
                JSON.stringify({ error: "Envantere eklenemedi" }),
                { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
        }

        console.log(`Purchase successful: ${user_id} bought ${itemData.name} for ${itemPrice} diamonds`);

        return new Response(
            JSON.stringify({
                success: true,
                item_name: itemData.name,
                price_paid: itemPrice,
                new_diamond_balance: newDiamonds,
            }),
            { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    } catch (error) {
        console.error("Purchase error:", error);
        return new Response(
            JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }
});
