export default function WorkPage() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-white/90 selection:text-black">
      <div className="mx-auto max-w-6xl px-6 py-24 space-y-24">
        <h1 className="text-4xl font-bold">Work</h1>

        {/* Iron Horse Ranch */}
        <CaseStudy
          title="The Venue at Iron Horse Ranch"
          img="/screenshots/venue-hero.jpeg"
          link="https://www.thevenueatironhorseranch.com/"
          description="The Venue at Iron Horse Ranch had begun building their site on Squarespace, but the project stalled. I stepped in to complete the design, refine the layout, and launch a polished version that reflects the beauty of their property. Now live, the site supports their events business today - and they’ve asked me to continue working with them on a fully customized solution as their brand grows."
          bullets={[
            "Completed an unfinished client-built Squarespace site",
            "Designed responsive layouts showcasing the property",
            "Delivered a fast, polished launch experience",
          ]}
        />

        {/* Steelhead Electric */}
        <CaseStudy
          title="Steelhead Electric"
          img="/screenshots/steelhead-hero.jpeg"
          link="https://www.steelheadelectric.pro/"
          description="Steelhead Electric needed a custom-built site to highlight their residential and commercial electrical services. I designed and developed the site from scratch - no CMS or template - to deliver a lightweight, high-performance experience. I also integrated Google Analytics, giving them visibility into traffic and customer engagement."
          bullets={[
            "Fully custom-coded site, no CMS or template",
            "Responsive design tailored for electricians in North Idaho",
            "Google Analytics integration for insights and performance tracking",
          ]}
        />

        {/* Placeholder */}
        <CaseStudy
          title="Your Project Here"
          img="/screenshots/placeholder.jpg"
          link="#contact"
          description="Looking to elevate your brand with a modern, custom website? Let’s build something sleek, premium, and effective together."
          bullets={[
            "Web design tailored to your brand",
            "Fast, responsive, SEO-friendly builds",
            "Ongoing support and optimization",
          ]}
        />
      </div>
    </main>
  );
}

function CaseStudy({ title, img, link, description, bullets }) {
  return (
    <div className="grid md:grid-cols-2 gap-10 items-start">
      <div>
        <img src={img} alt={title} className="rounded-2xl w-full object-cover" />
      </div>
      <div className="flex flex-col justify-center space-y-5">
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="text-white/80 leading-relaxed">{description}</p>
        <ul className="space-y-2 text-white/70 text-sm">
          {bullets.map((b, i) => (
            <li key={i}>• {b}</li>
          ))}
        </ul>
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-block rounded-xl border border-white/20 px-4 py-2 text-sm hover:border-white/40"
        >
          View Live Site →
        </a>
      </div>
    </div>
  );
}
