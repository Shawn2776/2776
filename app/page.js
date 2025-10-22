"use client";

import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-white/90 selection:text-black">
      <Hero />
      <Contact />
    </main>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <div className="relative h-full w-full">
          <Image src="/hero-grid.png" alt="" fill priority className="object-cover opacity-70" />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-6xl px-6 py-24 md:py-36 text-center">
        <h1 className="mt-6 text-5xl md:text-6xl font-extrabold tracking-tight">
          Sleek. Premium. <span className="text-[#d45e2b]">Web Experiences.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-white/70">
          2776 crafts fast, elegant websites that elevate your brand and deliver results.
        </p>
        <div className="mt-10 flex items-center justify-center gap-4">
          <Link
            href="#contact"
            className="rounded-2xl bg-white text-black px-6 py-3 font-semibold hover:opacity-90 transition"
          >
            Start a Project
          </Link>
        </div>
      </div>
    </section>
  );
}

function Contact() {
  const [sent, setSent] = useState(false);
  const formRef = useRef(null);

  // set "rendered at" timestamp for min-time check
  useEffect(() => {
    const el = formRef.current?.querySelector('[name="ts_rendered_at"]');
    if (el) el.value = String(Date.now());
  }, []);

  async function onSubmit(e) {
    e.preventDefault();
    const fd = new FormData(formRef.current);
    const res = await fetch("/api/contact", { method: "POST", body: fd });
    if (res.ok) setSent(true);
    else alert("Something went wrong. Try again.");
  }

  return (
    <section id="contact" className="mx-auto max-w-3xl px-6 py-24">
      {/* Turnstile script */}
      <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer />

      <div className="text-center">
        <h2 className="text-3xl md:text-4xl font-bold">Contact</h2>
        <p className="mt-4 text-white/70">Let&apos;s connect and talk about your project.</p>
      </div>

      <form ref={formRef} onSubmit={onSubmit} className="mt-10 space-y-5">
        {/* Honeypot (hidden) */}
        <input
          type="text"
          name="hp_field"
          autoComplete="off"
          tabIndex={-1}
          aria-hidden="true"
          style={{ position: "absolute", left: "-9999px" }}
        />
        {/* Min time */}
        <input type="hidden" name="ts_rendered_at" value="" />

        <Field label="Name">
          <input
            required
            name="name"
            className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 outline-none focus:border-white/25"
          />
        </Field>
        <Field label="Email">
          <input
            required
            type="email"
            name="email"
            className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 outline-none focus:border-white/25"
          />
        </Field>
        <Field label="Message">
          <textarea
            required
            name="message"
            rows={5}
            className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 outline-none focus:border-white/25"
          />
        </Field>

        {/* Cloudflare Turnstile widget */}
        <div className="cf-turnstile" data-sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}></div>

        <div className="flex items-center justify-end">
          <button
            className="rounded-2xl bg-white text-black px-6 py-3 font-semibold hover:opacity-90 transition"
            disabled={sent}
          >
            {sent ? "Sent ✓" : "Send Message"}
          </button>
        </div>
      </form>
    </section>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <div className="mb-2 text-sm text-white/70">{label}</div>
      {children}
    </label>
  );
}
