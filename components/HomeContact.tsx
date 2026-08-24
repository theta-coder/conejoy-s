const WHATSAPP_URL =
  "https://wa.me/923407258700?text=Assalam-o-Alaikum%20Cone%20Joy%27s%2C%20I%20would%20like%20to%20place%20an%20order.";

const GOOGLE_MAPS_DIRECTIONS =
  "https://www.google.com/maps/dir/?api=1&destination=31.43175985641227,74.1781213394898";

export default function HomeContact() {
  return (
    <section
      id="visit"
      className="scroll-mt-[var(--header-height)] bg-[var(--home-cream)] px-[clamp(16px,5vw,72px)] py-[clamp(56px,7vw,104px)]"
      aria-labelledby="visit-title"
    >
      <div className="mx-auto w-full max-w-[1380px]">
        {/* Section Header */}
        <div className="mb-10 max-w-[680px]">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[rgba(74,38,24,0.15)] bg-white/70 px-4 py-1.5 backdrop-blur-sm">
            <span className="h-2 w-2 rounded-full bg-[var(--home-coral)] animate-pulse" />
            <span className="text-xs font-black uppercase tracking-[0.14em] text-[var(--home-brown)]">
              SCOOP SHOP &amp; DELIVERY
            </span>
          </div>
          <h2
            id="visit-title"
            className="font-display text-[clamp(2.4rem,4.5vw,4.2rem)] font-extrabold leading-[0.96] tracking-[-0.06em] text-[var(--home-brown)]"
          >
            Visit us in Chung, Lahore.
          </h2>
          <p className="mt-4 text-[clamp(0.98rem,1.4vw,1.15rem)] font-semibold leading-relaxed text-[rgba(74,38,24,0.75)]">
            Stop by for fresh cones and cups, or get your favourite treats delivered straight to your doorstep.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-12">
          {/* Info Card Column */}
          <div className="flex flex-col justify-between rounded-[32px] border border-[rgba(74,38,24,0.15)] bg-white/90 p-[clamp(24px,4vw,40px)] shadow-[0_20px_50px_rgba(74,38,24,0.06)] backdrop-blur-sm lg:col-span-5">
            <div className="space-y-6">
              {/* Address Item */}
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--home-cream)] text-[var(--home-brown)] border border-[rgba(74,38,24,0.1)]">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xs font-black uppercase tracking-[0.14em] text-[rgba(74,38,24,0.6)]">
                    Store Address
                  </h3>
                  <p className="mt-1 text-base font-extrabold text-[var(--home-brown)] leading-snug">
                    Chung, Multan Road
                  </p>
                  <p className="text-sm font-semibold text-[rgba(74,38,24,0.7)] mt-0.5">
                    Kamboh Colony, near Care Plus Medical Store, Lahore
                  </p>
                </div>
              </div>

              <div className="h-[1px] w-full bg-[rgba(74,38,24,0.08)]" />

              {/* Hours Item */}
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--home-cream)] text-[var(--home-brown)] border border-[rgba(74,38,24,0.1)]">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xs font-black uppercase tracking-[0.14em] text-[rgba(74,38,24,0.6)]">
                    Opening Hours
                  </h3>
                  <p className="mt-1 text-base font-extrabold text-[var(--home-brown)]">
                    12:00 PM – 12:00 AM
                  </p>
                  <p className="text-sm font-semibold text-[rgba(74,38,24,0.7)] mt-0.5">
                    Open daily for dine-in, takeaway &amp; delivery
                  </p>
                </div>
              </div>

              <div className="h-[1px] w-full bg-[rgba(74,38,24,0.08)]" />

              {/* Delivery Item */}
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--home-cream)] text-[var(--home-brown)] border border-[rgba(74,38,24,0.1)]">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-black uppercase tracking-[0.14em] text-[rgba(74,38,24,0.6)]">
                      Delivery Service
                    </h3>
                    <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[0.68rem] font-extrabold text-emerald-800">
                      Active
                    </span>
                  </div>
                  <p className="mt-1 text-base font-extrabold text-[var(--home-brown)]">
                    Express Doorstep Delivery
                  </p>
                  <p className="text-sm font-semibold text-[rgba(74,38,24,0.7)] mt-0.5">
                    Serving Chung and nearby areas via WhatsApp
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <a
                href={GOOGLE_MAPS_DIRECTIONS}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-[52px] flex-1 items-center justify-center gap-2 rounded-full bg-[var(--home-brown)] px-6 text-sm font-black text-white shadow-[0_8px_24px_rgba(74,38,24,0.18)] transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[var(--home-brown)]"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                Get Directions
              </a>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-[52px] flex-1 items-center justify-center gap-2 rounded-full border-2 border-[var(--home-brown)] bg-[var(--home-golden)] px-6 text-sm font-black text-[var(--home-brown)] transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[var(--home-brown)]"
              >
                Order on WhatsApp
              </a>
            </div>
          </div>

          {/* Map Column */}
          <div className="relative min-h-[380px] overflow-hidden rounded-[32px] border border-[rgba(74,38,24,0.15)] bg-white shadow-[0_20px_50px_rgba(74,38,24,0.08)] lg:col-span-7 lg:min-h-[480px]">
            {/* Top Floating Badge */}
            <div className="absolute left-4 top-4 z-10 flex items-center gap-2.5 rounded-full border border-[rgba(74,38,24,0.12)] bg-white/90 px-4 py-2 shadow-md backdrop-blur-md">
              <span className="flex h-2.5 w-2.5 items-center justify-center">
                <span className="h-2 w-2 rounded-full bg-[var(--home-golden)]" />
              </span>
              <span className="text-xs font-black text-[var(--home-brown)]">
                ConeJoy&apos;s Scoop Shop — Chung, Lahore
              </span>
            </div>

            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d212.77248836304298!2d74.1781213394898!3d31.43175985641227!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3919031eeb169d51%3A0xbd009e0a8cfba415!2sConejoys!5e0!3m2!1sen!2s!4v1787527243952!5m2!1sen!2s"
              title="Cone Joy's Ice Cream location on Google Maps — Chung, Lahore"
              className="h-full w-full border-0 min-h-[380px] lg:min-h-[480px]"
              allowFullScreen
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
