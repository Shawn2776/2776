// app/api/contact/route.js
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

// ---- simple per-IP rate limiter (1m window) ----
const WINDOW_MS = 60_000;
const MAX_HITS = 5;
global._contactRate = global._contactRate || new Map();
function rateLimit(ip) {
  const now = Date.now();
  const hits = (global._contactRate.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  if (hits.length >= MAX_HITS) return false;
  hits.push(now);
  global._contactRate.set(ip, hits);
  return true;
}

function getTransporter() {
  const port = Number(process.env.SMTP_PORT || 465);
  const secure = port === 465; // 465=SSL, 587=STARTTLS
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST, // e.g., smtp.fastmail.com
    port,
    secure,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
}

const DISPOSABLE = new Set([
  "mailinator.com",
  "tempmail.dev",
  "sharklasers.com",
  "10minutemail.com",
  "guerrillamail.com",
]);

export async function POST(req) {
  try {
    const ip = (req.headers.get("x-forwarded-for") || "").split(",")[0] || "unknown";
    const ua = req.headers.get("user-agent") || "";

    // --- parse FormData (NOT JSON) ---
    const form = await req.formData();
    const name = (form.get("name") || "").toString().trim();
    const email = (form.get("email") || "").toString().trim();
    const message = (form.get("message") || "").toString().trim();

    // hidden bot controls
    const hp = (form.get("hp_field") || "").toString().trim(); // honeypot
    const renderedAt = Number((form.get("ts_rendered_at") || 0).toString()); // min time
    const token = (form.get("cf-turnstile-response") || "").toString(); // Turnstile

    // --- guards ---
    if (hp) return NextResponse.json({ error: "Bad Request", reason: "honeypot" }, { status: 400 });

    if (!name || !email || !message)
      return NextResponse.json({ error: "Bad Request", reason: "missing_fields" }, { status: 400 });

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return NextResponse.json({ error: "Bad Request", reason: "bad_email" }, { status: 400 });

    const domain = email.split("@")[1]?.toLowerCase() || "";
    if (DISPOSABLE.has(domain))
      return NextResponse.json({ error: "Bad Request", reason: "disposable_email" }, { status: 400 });

    const tooShort = message.length < 20;
    const noSpaces = !/\s/.test(message);
    const looksGibberish = /^[A-Za-z0-9+/=]{15,}$/.test(message); // base64-ish junk
    if (tooShort || noSpaces || looksGibberish)
      return NextResponse.json({ error: "Bad Request", reason: "low_quality" }, { status: 400 });

    if (!token) return NextResponse.json({ error: "Bad Request", reason: "missing_turnstile_token" }, { status: 400 });

    // --- Turnstile verify ---
    const verify = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        secret: process.env.TURNSTILE_SECRET_KEY || "",
        response: token,
        remoteip: ip,
      }),
    }).then((r) => r.json());

    if (!verify?.success)
      return NextResponse.json({ error: "Bad Request", reason: "captcha_failed", details: verify }, { status: 400 });

    // --- rate limit ---
    if (!rateLimit(ip))
      return NextResponse.json({ error: "Too Many Requests", reason: "rate_limited" }, { status: 429 });

    // --- send email ---
    const transporter = getTransporter();
    // verify transport (better error messages during setup)
    await transporter.verify();

    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: process.env.SMTP_TO || process.env.SMTP_USER,
      subject: `New website inquiry: ${name}`,
      replyTo: email,
      text: `Name: ${name}\nEmail: ${email}\nIP: ${ip}\nUA: ${ua}\n\n${message}`,
      html: `
        <h2>New Contact Message</h2>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>IP:</strong> ${escapeHtml(ip)}</p>
        <p><strong>UA:</strong> ${escapeHtml(ua)}</p>
        <p><strong>Message:</strong></p>
        <pre style="white-space:pre-wrap">${escapeHtml(message)}</pre>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Email send error:", {
      code: err?.code,
      command: err?.command,
      response: err?.response,
      message: err?.message,
    });
    return NextResponse.json(
      { error: "Email failed", code: err?.code || "UNKNOWN", reason: err?.message || "Unknown error" },
      { status: 500 }
    );
  }
}

// tiny HTML escape
function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
