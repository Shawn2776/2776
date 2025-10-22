// app/api/contact/route.js
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

// simple per-IP rate limiter (1-minute window)
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
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST, // e.g. smtp.fastmail.com
    port: Number(process.env.SMTP_PORT || 465), // 465 SSL, 587 STARTTLS
    secure: process.env.SMTP_PORT === "465",
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
    const form = await req.formData();

    const name = (form.get("name") || "").toString().trim();
    const email = (form.get("email") || "").toString().trim();
    const message = (form.get("message") || "").toString().trim();
    const hp = (form.get("hp_field") || "").toString().trim();
    const renderedAt = Number(form.get("ts_rendered_at") || 0);
    const token = (form.get("cf-turnstile-response") || "").toString();

    if (hp) return NextResponse.json({ error: "Bad Request", reason: "honeypot" }, { status: 400 });
    if (!renderedAt || Date.now() - renderedAt < 4000)
      return NextResponse.json({ error: "Bad Request", reason: "too_fast" }, { status: 400 });

    if (!name || !email || !message)
      return NextResponse.json({ error: "Bad Request", reason: "missing_fields" }, { status: 400 });

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return NextResponse.json({ error: "Bad Request", reason: "bad_email" }, { status: 400 });

    const domain = email.split("@")[1]?.toLowerCase() || "";
    const DISPOSABLE = new Set([
      "mailinator.com",
      "tempmail.dev",
      "sharklasers.com",
      "10minutemail.com",
      "guerrillamail.com",
    ]);
    if (DISPOSABLE.has(domain))
      return NextResponse.json({ error: "Bad Request", reason: "disposable_email" }, { status: 400 });

    const tooShort = message.length < 20;
    const noSpaces = !/\s/.test(message);
    const looksGibberish = /^[A-Za-z0-9+/=]{15,}$/.test(message);
    if (tooShort || noSpaces || looksGibberish)
      return NextResponse.json({ error: "Bad Request", reason: "low_quality" }, { status: 400 });

    if (!token) return NextResponse.json({ error: "Bad Request", reason: "missing_turnstile_token" }, { status: 400 });

    // … then your Turnstile verify + email send (unchanged) …

    // Turnstile verify
    const verify = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        secret: process.env.TURNSTILE_SECRET_KEY || "",
        response: token,
        remoteip: ip,
      }),
    }).then((r) => r.json());

    if (!verify?.success) return NextResponse.json({ error: "Captcha failed" }, { status: 400 });

    // rate limit
    if (!rateLimit(ip)) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

    // send mail
    const transporter = getTransporter();
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
    console.error("Email send error:", err);
    return NextResponse.json({ error: "Email failed to send" }, { status: 500 });
  }
}

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
