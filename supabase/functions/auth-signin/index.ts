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
    const { email, password } = await req.json();

    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: "E-posta ve şifre gereklidir" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") || "",
      Deno.env.get("SUPABASE_ANON_KEY") || ""
    );

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      // Translate known Supabase error messages to Turkish
      const errorMessages: Record<string, string> = {
        "Invalid login credentials": "E-posta veya şifre hatalı",
        "Email not confirmed": "E-posta adresiniz henüz doğrulanmamış. Lütfen e-postanızı kontrol edin.",
        "User not found": "Bu e-posta adresiyle kayıtlı bir hesap bulunamadı",
        "Too many requests": "Çok fazla deneme yaptınız. Lütfen biraz bekleyin.",
      };
      const turkishError = errorMessages[authError.message] || "Giriş yapılırken bir hata oluştu";

      return new Response(
        JSON.stringify({ error: turkishError }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (!authData.user || !authData.session) {
      return new Response(
        JSON.stringify({ error: "Giriş yapılamadı. Lütfen tekrar deneyin." }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("id", authData.user.id)
      .single();

    if (userError || !userData) {
      return new Response(
        JSON.stringify({ error: "Kullanıcı profili bulunamadı" }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({
        session: authData.session,
        user: userData,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
