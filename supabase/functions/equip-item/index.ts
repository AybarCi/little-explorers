import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.58.0";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface EquipRequest {
    user_id: string;
    item_type: "avatar" | "frame" | "badge";
    item_id: string | null; // null to unequip
}

Deno.serve(async (req: Request) => {
    if (req.method === "OPTIONS") {
        return new Response(null, { status: 200, headers: corsHeaders });
    }

    try {
        const { user_id, item_type, item_id }: EquipRequest = await req.json();

        if (!user_id || !item_type) {
            return new Response(
                JSON.stringify({ error: "user_id and item_type are required" }),
                { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
        }

        const supabase = createClient(
            Deno.env.get("SUPABASE_URL") || "",
            Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""
        );

        // If item_id is provided, check if user owns the item
        if (item_id) {
            // Check if it's a default free item
            const tableName = item_type === "avatar" ? "avatars" : item_type === "frame" ? "frames" : "badges";
            const { data: itemData } = await supabase
                .from(tableName)
                .select("price, is_default")
                .eq("id", item_id)
                .single();

            const isDefaultOrFree = itemData?.is_default || itemData?.price === 0;

            if (!isDefaultOrFree) {
                const { data: inventoryItem } = await supabase
                    .from("user_inventory")
                    .select("id")
                    .eq("user_id", user_id)
                    .eq("item_type", item_type)
                    .eq("item_id", item_id)
                    .maybeSingle();

                if (!inventoryItem) {
                    return new Response(
                        JSON.stringify({ error: "Bu ürüne sahip değilsin!" }),
                        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
                    );
                }
            }
        }

        // Update user's equipped item
        const columnName = `current_${item_type}_id`;
        const updateData: Record<string, any> = {
            [columnName]: item_id,
            updated_at: new Date().toISOString(),
        };

        const { error: updateError } = await supabase
            .from("users")
            .update(updateData)
            .eq("id", user_id);

        if (updateError) {
            console.error("Failed to equip item:", updateError);
            return new Response(
                JSON.stringify({ error: "Ürün kullanılamadı" }),
                { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
        }

        // Get the item name for response
        let itemName = "Ürün";
        if (item_id) {
            const tableName = item_type === "avatar" ? "avatars" : item_type === "frame" ? "frames" : "badges";
            const { data: itemData } = await supabase
                .from(tableName)
                .select("name")
                .eq("id", item_id)
                .single();
            itemName = itemData?.name || itemName;
        }

        return new Response(
            JSON.stringify({
                success: true,
                equipped_item: itemName,
                item_type,
            }),
            { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    } catch (error) {
        console.error("Equip error:", error);
        return new Response(
            JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }
});
