// ============================================================
// API ROUTE â€” /api/contact
// Next.js 15 Route Handler (App Router).
// Valide avec Zod, envoie avec Resend (ou fallback console).
// Variables d'env requises : RESEND_API_KEY, CONTACT_EMAIL_TO
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { contactSchema } from "@/lib/validation";
import { ZodError } from "zod";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// ---- Types de rÃ©ponse API ----
type ApiSuccess = { success: true; message: string };
type ApiError   = { success: false; error: string; details?: unknown };

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    };

    return entities[character] ?? character;
  });
}

// ---- Rate limiting simple (en mÃ©moire, remplace par Upstash Redis en prod) ----
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
let rateLimitClient: SupabaseClient | null | undefined;

function getRateLimitClient(): SupabaseClient | null {
  if (rateLimitClient !== undefined) return rateLimitClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    rateLimitClient = null;
    return rateLimitClient;
  }

  rateLimitClient = createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return rateLimitClient;
}

function isRateLimitedInMemory(ip: string): boolean {
  const now     = Date.now();
  const window  = 60 * 1000; // 1 minute
  const maxReqs = 3;          // max 3 requÃªtes / minute / IP

  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + window });
    return false;
  }

  if (entry.count >= maxReqs) return true;

  entry.count++;
  return false;
}

async function isRateLimited(ip: string): Promise<boolean> {
  const client = getRateLimitClient();

  if (client) {
    const { data, error } = await client.rpc("consume_rate_limit", {
      p_key: `contact:${ip}`,
      p_limit: 3,
      p_window_seconds: 60,
    });

    if (!error && typeof data === "boolean") {
      return !data;
    }

    console.warn("Supabase rate limit unavailable; using memory fallback.", error);
  }

  return isRateLimitedInMemory(ip);
}

// ---- Handler POST ----
export async function POST(
  req: NextRequest
): Promise<NextResponse<ApiSuccess | ApiError>> {
  try {
    const contentLength = Number(req.headers.get("content-length") ?? 0);
    if (contentLength > 64 * 1024) {
      return NextResponse.json(
        { success: false, error: "RequÃªte trop volumineuse." },
        { status: 413 }
      );
    }

    // 1. Rate limiting
    const ip =
      req.headers.get("x-real-ip")?.trim() ||
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      "unknown";

    if (await isRateLimited(ip)) {
      return NextResponse.json(
        { success: false, error: "Trop de requÃªtes. RÃ©essaie dans une minute." },
        { status: 429 }
      );
    }

    // 2. Parse + validation Zod
    const rawBody = await req.text();
    if (rawBody.length > 64 * 1024) {
      return NextResponse.json(
        { success: false, error: "RequÃªte trop volumineuse." },
        { status: 413 }
      );
    }

    const body = JSON.parse(rawBody);
    const data = contactSchema.parse(body);

    // 3. Envoi email via Resend
    // Doc : https://resend.com/docs/send-with-nextjs
    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const RESEND_FROM_EMAIL = process.env.RESEND_FROM_EMAIL;
    const EMAIL_TO       = process.env.CONTACT_EMAIL_TO ?? "francoisleking@gmail.com";

    if (!RESEND_API_KEY || !RESEND_FROM_EMAIL) {
      if (process.env.NODE_ENV === "production") {
        return NextResponse.json(
          { success: false, error: "Service de contact temporairement indisponible." },
          { status: 503 }
        );
      }

      // âš ï¸ Mode dev : log en console si pas de clÃ© Resend
      console.log("ðŸ“§ [CONTACT FORM] â€” Mode dev (pas de RESEND_API_KEY)");
      console.log("From   :", data.email);
      console.log("Name   :", data.name);
      console.log("Subject:", data.subject);
      console.log("Message:", data.message);

      return NextResponse.json(
        { success: true, message: "Message reÃ§u (mode dev â€” non envoyÃ©)" },
        { status: 200 }
      );
    }

    const safeName = escapeHtml(data.name);
    const safeEmail = escapeHtml(data.email);
    const safeSubject = escapeHtml(data.subject);
    const safeMessage = escapeHtml(data.message).replace(/\n/g, "<br />");

    // Appel Resend API
    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from:    RESEND_FROM_EMAIL,
        to:      [EMAIL_TO],
        replyTo: data.email,
        subject: `[lekingfrancois] ${data.subject}`,
        html: `
          <div style="font-family: Inter, system-ui, sans-serif; background: #f8fafc; padding: 24px; color: #0f172a;">
            <div style="max-width: 680px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 20px; overflow: hidden;">
              <div style="background: linear-gradient(135deg, #8b5cf6, #2563eb); color: #ffffff; padding: 26px 28px;">
                <h1 style="margin: 0; font-size: 1.4rem; letter-spacing: -0.02em;">Nouveau message portfolio</h1>
                <p style="margin: 10px 0 0; font-size: 0.95rem; opacity: 0.84;">Formulaire de contact reÃ§u depuis ton site web.</p>
              </div>
              <div style="padding: 26px 28px; line-height: 1.7; color: #334155;">
                <p style="margin: 0 0 14px; font-size: 0.95rem; color: #475569;"><strong>Nom :</strong> ${safeName}</p>
                <p style="margin: 0 0 14px; font-size: 0.95rem; color: #475569;"><strong>Email :</strong> <a href="mailto:${safeEmail}" style="color: #2563eb; text-decoration: none;">${safeEmail}</a></p>
                <p style="margin: 0 0 22px; padding: 16px; background: #f1f5f9; border: 1px solid #e2e8f0; border-radius: 14px; color: #0f172a;"><strong>Sujet :</strong> ${safeSubject}</p>
                <div style="margin-bottom: 24px;">
                  <h2 style="margin: 0 0 12px; font-size: 1rem; color: #0f172a;">Message</h2>
                  <div style="white-space: pre-wrap; color: #334155; font-size: 0.95rem;">
                    ${safeMessage}
                  </div>
                </div>
              </div>
              <div style="background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 18px 28px; color: #64748b; font-size: 0.9rem;">
                ReÃ§u via le formulaire de contact du portfolio.
              </div>
            </div>
          </div>
        `,
        text: `Nouveau message de ${data.name} <${data.email}>\nSujet: ${data.subject}\n\n${data.message}`,
      }),
    });

    if (!resendResponse.ok) {
      const errorBody = await resendResponse.json();
      console.error("Resend error:", errorBody);
      throw new Error("Ã‰chec de l'envoi via Resend");
    }

    return NextResponse.json(
      { success: true, message: "Message envoyÃ© avec succÃ¨s !" },
      { status: 200 }
    );
  } catch (err) {
    // Erreurs de validation Zod
    if (err instanceof ZodError) {
      return NextResponse.json(
        { success: false, error: "DonnÃ©es invalides", details: err.flatten() },
        { status: 422 }
      );
    }

    console.error("Contact API error:", err);
    return NextResponse.json(
      { success: false, error: "Erreur serveur. RÃ©essaie plus tard." },
      { status: 500 }
    );
  }
}

// ---- MÃ©thodes non autorisÃ©es ----
export function GET() {
  return NextResponse.json(
    { success: false, error: "MÃ©thode non autorisÃ©e" },
    { status: 405 }
  );
}
