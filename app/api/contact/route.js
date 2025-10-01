// app/api/contact/route.js
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

function getTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST, // smtp.fastmail.com
    port: Number(process.env.SMTP_PORT || 465), // 465 (SSL) or 587 (STARTTLS)
    secure: process.env.SMTP_PORT === "465", // true for 465, false for 587
    auth: {
      user: process.env.SMTP_USER, // e.g. shawn@2776.ltd
      pass: process.env.SMTP_PASS, // Fastmail app password
    },
  });
}

export async function POST(req) {
  try {
    const { name, email, message } = await req.json();
    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (reqBody.website) {
      return NextResponse.json({ error: "Spam detected" }, { status: 400 });
    }

    const transporter = getTransporter();

    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER, // must be your Fastmail address/domain
      to: process.env.SMTP_TO || process.env.SMTP_USER, // where you want to receive it
      subject: `New message from ${name}`,
      replyTo: email,
      text: message,
      html: `
        <h2>New Contact Message</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <pre style="white-space:pre-wrap">${message}</pre>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Email send error:", err);
    return NextResponse.json({ error: "Email failed to send" }, { status: 500 });
  }
}
