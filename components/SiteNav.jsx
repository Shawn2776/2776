// components/SiteNav.jsx
import Link from "next/link";

export default function SiteNav() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-black/50 border-b border-white/10">
      <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
        <Link href="/" className="group inline-flex items-center gap-3">
          <span className="font-semibold tracking-[0.18em] text-sm uppercase text-white/90 group-hover:text-white transition">
            2776
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm text-white/70">
          <Link href="/work" className="hover:text-white/95 transition">
            Work
          </Link>
          <a href="/#contact" className="hover:text-white/95 transition">
            Contact
          </a>
          <a
            href="/#contact"
            className="ml-2 rounded-xl bg-white text-black px-4 py-2 font-medium hover:opacity-90 transition"
          >
            Start a Project
          </a>
        </nav>
      </div>
    </header>
  );
}
