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
        const { email, otp_code, new_password } = await req.json();

        if (!email || !otp_code || !new_password) {
            return new Response(
                JSON.stringify({ error: "E-posta, doğrulama kodu ve yeni şifre gereklidir" }),
                { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
        }

        if (new_password.length < 6) {
            return new Response(
                JSON.stringify({ error: "Yeni şifre en az 6 karakter olmalıdır" }),
                { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
        }

        const supabase = createClient(
            Deno.env.get("SUPABASE_URL") || "",
            Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""
        );

        // Verify the OTP code
        const { data: verifyData, error: verifyError } = await supabase.auth.verifyOtp({
            email,
            token: otp_code,
            type: "recovery",
        });

        if (verifyError) {
            console.error("OTP verification error:", verifyError);

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

        if (!verifyData.user) {
            return new Response(
                JSON.stringify({ error: "Kullanıcı doğrulanamadı" }),
                { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
        }

        // Update password using admin API
        const { error: updateError } = await supabase.auth.admin.updateUserById(
            verifyData.user.id,
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
            JSON.stringify({ success: true, message: "Şifreniz başarıyla güncellendi! Yeni şifrenizle giriş yapabilirsiniz." }),
            { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    } catch (error) {
        console.error("Reset password verify error:", error);
        return new Response(
            JSON.stringify({ error: error instanceof Error ? error.message : "Bilinmeyen hata" }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }
});
