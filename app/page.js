"use client";

import { useState } from "react";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-white/90 selection:text-black">
      <SiteNav />
      <Hero />
      <Contact />
      <SiteFooter />
    </main>
  );
}

function SiteNav() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-black/50 border-b border-white/10">
      <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
        <a href="#" className="group inline-flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-white text-black grid place-items-center font-black">2776</div>
          <span className="font-semibold tracking-[0.18em] text-sm uppercase text-white/90 group-hover:text-white transition">
            2776
          </span>
        </a>
        <nav className="hidden md:flex items-center gap-8 text-sm text-white/70">
          <a href="#contact" className="hover:text-white/95 transition">
            Contact
          </a>
          <a
            href="#contact"
            className="ml-2 rounded-xl bg-white text-black px-4 py-2 font-medium hover:opacity-90 transition"
          >
            Start a Project
          </a>
        </nav>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 left-1/2 h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,#6366f1,transparent)] opacity-30 blur-3xl" />
      </div>
      <div className="mx-auto max-w-6xl px-6 py-24 md:py-36 text-center">
        <h1 className="mt-6 text-5xl md:text-6xl font-extrabold tracking-tight">
          Sleek. Premium. <span className="text-indigo-400">Web Experiences.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-white/70">
          2776 crafts fast, elegant websites that elevate your brand and deliver results.
        </p>
        <div className="mt-10 flex items-center justify-center gap-4">
          <a
            href="#contact"
            className="rounded-2xl bg-white text-black px-6 py-3 font-semibold hover:opacity-90 transition"
          >
            Start a Project
          </a>
        </div>
      </div>
    </section>
  );
}

function Contact() {
  const [sent, setSent] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    const form = Object.fromEntries(new FormData(e.currentTarget).entries());
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) setSent(true);
    else alert("Something went wrong. Try again.");
  }

  return (
    <section id="contact" className="mx-auto max-w-3xl px-6 py-24">
      <div className="text-center">
        <h2 className="text-3xl md:text-4xl font-bold">Contact</h2>
        <p className="mt-4 text-white/70">Let’s connect and talk about your project.</p>
      </div>
      <form onSubmit={onSubmit} className="mt-10 space-y-5">
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

function SiteFooter() {
  return (
    <footer className="border-t border-white/10">
      <div className="mx-auto max-w-6xl px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3 text-white/70">
          <div className="h-8 w-8 rounded-lg bg-white text-black grid place-items-center font-black">27</div>
          <span className="text-sm">© {new Date().getFullYear()} 2776</span>
        </div>
        <div className="text-sm text-white/60">
          Coeur d'Alene, Idaho •{" "}
          <a href="mailto:shawn@2776.ltd" className="underline underline-offset-4 hover:text-white">
            shawn@2776.ltd
          </a>
        </div>
      </div>
    </footer>
  );
}
