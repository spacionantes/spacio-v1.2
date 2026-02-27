import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Simple HTML escaping to prevent injection
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// In-memory rate limiting (per function instance)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 5; // max emails per window
const RATE_WINDOW_MS = 60 * 60 * 1000; // 1 hour

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(key);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return false;
  }
  entry.count++;
  return entry.count > RATE_LIMIT;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
  if (!RESEND_API_KEY) {
    return new Response(JSON.stringify({ error: "Email service not configured" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const body = await req.json();
    const { type, to, data } = body;

    // Validate required fields
    if (!type || typeof type !== "string") {
      return new Response(JSON.stringify({ error: "Invalid request" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!to || typeof to !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) {
      return new Response(JSON.stringify({ error: "Invalid email address" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!data || typeof data !== "object") {
      return new Response(JSON.stringify({ error: "Invalid data" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Rate limit by recipient email
    if (isRateLimited(to)) {
      return new Response(JSON.stringify({ error: "Too many requests. Please try again later." }), {
        status: 429,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Verify the email corresponds to a known lead in the database
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data: leadData, error: leadError } = await supabase
      .from("leads")
      .select("id")
      .eq("email", to)
      .limit(1);

    // Also check diagnostic_results for diagnostic emails
    const { data: diagData } = await supabase
      .from("diagnostic_results")
      .select("id")
      .eq("email", to)
      .limit(1);

    const isKnownRecipient =
      (leadData && leadData.length > 0) || (diagData && diagData.length > 0);

    if (!isKnownRecipient) {
      return new Response(JSON.stringify({ error: "Recipient not authorized" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let subject: string;
    let html: string;

    if (type === "space_confirmation") {
      const orgName = escapeHtml(String(data.organization_name || "").slice(0, 200));
      const spaceTitle = data.space_title ? escapeHtml(String(data.space_title).slice(0, 200)) : "";

      subject = "Spacio — Confirmation de votre demande d'espace";
      html = `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;">
          <h1 style="color:#1a1a2e;font-size:24px;">Merci pour votre demande !</h1>
          <p>Bonjour <strong>${orgName}</strong>,</p>
          <p>Nous avons bien reçu votre demande${spaceTitle ? ` pour <strong>${spaceTitle}</strong>` : ""}.</p>
          <p>Notre équipe vous recontactera sous <strong>24 heures</strong> pour étudier votre demande.</p>
          <hr style="border:none;border-top:1px solid #eee;margin:24px 0;" />
          <p style="font-size:13px;color:#888;">Spacio — La marketplace d'espaces pour les associations</p>
        </div>
      `;
    } else if (type === "diagnostic_results") {
      const scoreVal = Math.max(0, Math.min(100, Number(data.score) || 0));
      const ratioVal = Math.max(0, Math.min(1, Number(data.ratio) || 0));
      const org = escapeHtml(String(data.organization || "").slice(0, 200));

      const scoreColor = scoreVal < 30 ? "#ef4444" : scoreVal < 60 ? "#f59e0b" : "#22c55e";
      const advice = scoreVal < 30
        ? "Votre espace est peu utilisé. Pensez à le mutualiser avec d&#039;autres organisations."
        : scoreVal < 60
        ? "Votre espace a un potentiel d&#039;optimisation. Diversifiez ses usages sur les créneaux libres."
        : "Félicitations ! Votre espace est bien utilisé.";

      subject = `Spacio — Votre Intensi'Score : ${scoreVal}/100`;
      html = `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;">
          <h1 style="color:#1a1a2e;font-size:24px;">Votre Intensi'Score</h1>
          <p>Bonjour <strong>${org}</strong>,</p>
          <div style="text-align:center;margin:24px 0;">
            <span style="font-size:48px;font-weight:800;color:${scoreColor};">${scoreVal}</span>
            <span style="font-size:18px;color:#888;">/100</span>
          </div>
          <p style="text-align:center;color:#888;">Occupation moyenne : ${Math.round(ratioVal * 100)}%</p>
          <div style="background:#f8f9fa;border-radius:12px;padding:16px;margin:24px 0;">
            <p style="margin:0;font-weight:600;">💡 Conseil Spacio</p>
            <p style="margin:8px 0 0;color:#555;">${advice}</p>
          </div>
          <hr style="border:none;border-top:1px solid #eee;margin:24px 0;" />
          <p style="font-size:13px;color:#888;">Spacio — La marketplace d'espaces pour les associations</p>
        </div>
      `;
    } else {
      return new Response(JSON.stringify({ error: "Unknown email type" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Spacio <contact@spacionantes.fr>",
        to: [to],
        subject,
        html,
      }),
    });

    const result = await res.json();
    if (!res.ok) {
      console.error("Resend API error:", res.status, JSON.stringify(result));
      return new Response(JSON.stringify({ error: "Failed to send email" }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Email send error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
