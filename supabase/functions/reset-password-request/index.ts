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
        const { email } = await req.json();

        if (!email) {
            return new Response(
                JSON.stringify({ error: "E-posta adresi gereklidir" }),
                { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
        }

        const supabase = createClient(
            Deno.env.get("SUPABASE_URL") || "",
            Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""
        );

        // Check if user exists
        const { data: userData, error: userError } = await supabase
            .from("users")
            .select("id")
            .eq("email", email)
            .single();

        if (userError || !userData) {
            // Don't reveal whether email exists or not for security
            // But still return success to prevent email enumeration
            return new Response(
                JSON.stringify({ success: true, message: "Eğer bu e-posta ile kayıtlı bir hesap varsa, şifre sıfırlama kodu gönderildi." }),
                { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
        }

        // Send password reset email with OTP code
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(email);

        if (resetError) {
            console.error("Reset password error:", resetError);
            return new Response(
                JSON.stringify({ error: "Şifre sıfırlama kodu gönderilirken bir hata oluştu" }),
                { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
        }

        return new Response(
            JSON.stringify({ success: true, message: "Şifre sıfırlama kodu e-posta adresinize gönderildi" }),
            { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    } catch (error) {
        console.error("Reset password request error:", error);
        return new Response(
            JSON.stringify({ error: error instanceof Error ? error.message : "Bilinmeyen hata" }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }
});
