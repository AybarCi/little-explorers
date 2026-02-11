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
        const { email, otp_code } = await req.json();

        if (!email || !otp_code) {
            return new Response(
                JSON.stringify({ error: "E-posta ve doğrulama kodu gereklidir" }),
                { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
        }

        const supabase = createClient(
            Deno.env.get("SUPABASE_URL") || "",
            Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""
        );

        // Verify the OTP code for signup confirmation
        const { data: verifyData, error: verifyError } = await supabase.auth.verifyOtp({
            email,
            token: otp_code,
            type: "signup",
        });

        if (verifyError) {
            console.error("Email verification error:", verifyError);

            const errorMessages: Record<string, string> = {
                "Token has expired or is invalid": "Doğrulama kodunun süresi dolmuş veya geçersiz",
                "Invalid otp": "Geçersiz doğrulama kodu",
            };
            const turkishError = errorMessages[verifyError.message] || "Doğrulama kodu geçersiz. Lütfen tekrar deneyin.";

            return new Response(
                JSON.stringify({ error: turkishError }),
                { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
        }

        if (!verifyData.session || !verifyData.user) {
            return new Response(
                JSON.stringify({ error: "Doğrulama başarısız oldu. Lütfen tekrar deneyin." }),
                { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
        }

        // Get user profile from database
        const { data: userData, error: userError } = await supabase
            .from("users")
            .select("*")
            .eq("id", verifyData.user.id)
            .single();

        if (userError) {
            console.error("User profile error:", userError);
        }

        return new Response(
            JSON.stringify({
                success: true,
                session: verifyData.session,
                user: userData || {
                    id: verifyData.user.id,
                    email: verifyData.user.email,
                },
                message: "E-posta başarıyla doğrulandı!",
            }),
            { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    } catch (error) {
        console.error("Verify email error:", error);
        return new Response(
            JSON.stringify({ error: error instanceof Error ? error.message : "Bilinmeyen hata" }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }
});
