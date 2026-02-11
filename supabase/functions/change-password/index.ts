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
        const { user_id, current_password, new_password, email } = await req.json();

        if (!user_id || !current_password || !new_password || !email) {
            return new Response(
                JSON.stringify({ error: "Tüm alanlar zorunludur" }),
                { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
        }

        // Validate new password length
        if (new_password.length < 6) {
            return new Response(
                JSON.stringify({ error: "Yeni şifre en az 6 karakter olmalıdır" }),
                { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
        }

        // Check if new password is same as current
        if (current_password === new_password) {
            return new Response(
                JSON.stringify({ error: "Yeni şifre mevcut şifrenizle aynı olamaz" }),
                { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
        }

        const supabase = createClient(
            Deno.env.get("SUPABASE_URL") || "",
            Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""
        );

        // Verify current password by attempting to sign in
        const { error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password: current_password,
        });

        if (signInError) {
            return new Response(
                JSON.stringify({ error: "Mevcut şifreniz yanlış" }),
                { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
        }

        // Update password using admin API
        const { error: updateError } = await supabase.auth.admin.updateUserById(
            user_id,
            { password: new_password }
        );

        if (updateError) {
            console.error("Password update error:", updateError);
            return new Response(
                JSON.stringify({ error: "Şifre güncellenirken bir hata oluştu" }),
                { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
        }

        return new Response(
            JSON.stringify({ success: true, message: "Şifreniz başarıyla güncellendi" }),
            { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    } catch (error) {
        console.error("Change password error:", error);
        return new Response(
            JSON.stringify({ error: error instanceof Error ? error.message : "Bilinmeyen hata" }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }
});
