// components/SiteFooter.jsx
export default function SiteFooter() {
  return (
    <footer className="border-t border-white/10">
      <div className="mx-auto max-w-6xl px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3 text-white/70">
          <span className="text-sm">
            © {new Date().getFullYear()} <span className="text-[#d45e2b]">2776</span>
          </span>
        </div>
        <div className="text-sm text-white/60">
          Coeur d&apos;Alene, Idaho •{" "}
          <a href="mailto:shawn@2776.ltd" className="underline underline-offset-4 hover:text-white">
            shawn@2776.ltd
          </a>
        </div>
      </div>
    </footer>
  );
}
