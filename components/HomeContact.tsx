import { MapPin, Clock, Truck, Navigation, MessageCircle } from "lucide-react";

const WHATSAPP_URL =
  "https://wa.me/923407258700?text=Assalam-o-Alaikum%20Cone%20Joy%27s%2C%20I%20would%20like%20to%20place%20an%20order.";

const GOOGLE_MAPS_DIRECTIONS =
  "https://www.google.com/maps/dir/?api=1&destination=31.43175985641227,74.1781213394898";

export default function HomeContact() {
  return (
    <section
      id="visit"
      className="scroll-mt-[var(--header-height)] bg-[#fdf6e3] px-[clamp(16px,5vw,72px)] py-[clamp(56px,7vw,104px)]"
      aria-labelledby="visit-title"
    >
      <div className="mx-auto w-full max-w-[1380px]">
        {/* Section Header */}
        <div className="mb-10 max-w-[680px]">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#4a2618]/15 bg-white/70 px-4 py-1.5 backdrop-blur-sm">
            <span className="h-2 w-2 rounded-full bg-[#e63946] animate-pulse" />
            <span className="text-xs font-black uppercase tracking-[0.14em] text-[#4a2618]">
              SCOOP SHOP &amp; DELIVERY
            </span>
          </div>
          <h2
            id="visit-title"
            className="font-display text-[clamp(2.4rem,4.5vw,4.2rem)] font-extrabold leading-[0.96] tracking-[-0.06em] text-[#4a2618]"
          >
            Visit us in Chung, Lahore.
          </h2>
          <p className="mt-4 text-[clamp(0.98rem,1.4vw,1.15rem)] font-semibold leading-relaxed text-[#4a2618]/75">
            Stop by for fresh cones and cups, or get your favourite treats delivered straight to your doorstep.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-12">
          {/* Info Card Column */}
          <div className="flex flex-col justify-between rounded-[32px] border border-[#4a2618]/15 bg-white/95 p-[clamp(24px,4vw,40px)] shadow-[0_20px_50px_rgba(74,38,24,0.06)] backdrop-blur-sm lg:col-span-5">
            <div className="space-y-6">
              {/* Address Item */}
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#fdf6e3] text-[#4a2618] border border-[#4a2618]/10">
                  <MapPin className="h-5 w-5 stroke-[2.2]" />
                </div>
                <div>
                  <h3 className="text-xs font-black uppercase tracking-[0.14em] text-[#4a2618]/60">
                    Store Address
                  </h3>
                  <p className="mt-1 text-base font-extrabold text-[#4a2618] leading-snug">
                    Chung, Multan Road
                  </p>
                  <p className="text-sm font-semibold text-[#4a2618]/70 mt-0.5">
                    Kamboh Colony, near Care Plus Medical Store, Lahore
                  </p>
                </div>
              </div>

              <div className="h-[1px] w-full bg-[#4a2618]/10" />

              {/* Hours Item */}
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#fdf6e3] text-[#4a2618] border border-[#4a2618]/10">
                  <Clock className="h-5 w-5 stroke-[2.2]" />
                </div>
                <div>
                  <h3 className="text-xs font-black uppercase tracking-[0.14em] text-[#4a2618]/60">
                    Opening Hours
                  </h3>
                  <p className="mt-1 text-base font-extrabold text-[#4a2618]">
                    12:00 PM - 12:00 AM
                  </p>
                  <p className="text-sm font-semibold text-[#4a2618]/70 mt-0.5">
                    Open daily for dine-in, takeaway &amp; delivery
                  </p>
                </div>
              </div>

              <div className="h-[1px] w-full bg-[#4a2618]/10" />

              {/* Delivery Item */}
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#fdf6e3] text-[#4a2618] border border-[#4a2618]/10">
                  <Truck className="h-5 w-5 stroke-[2.2]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-black uppercase tracking-[0.14em] text-[#4a2618]/60">
                      Delivery Service
                    </h3>
                    <span className="rounded-full bg-[#4a2618]/10 px-2.5 py-0.5 text-[0.68rem] font-extrabold text-[#4a2618]">
                      Active
                    </span>
                  </div>
                  <p className="mt-1 text-base font-extrabold text-[#4a2618]">
                    Express Doorstep Delivery
                  </p>
                  <p className="text-sm font-semibold text-[#4a2618]/70 mt-0.5">
                    Serving Chung and nearby areas via WhatsApp
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href={GOOGLE_MAPS_DIRECTIONS}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-[50px] flex-1 items-center justify-center gap-2 rounded-2xl border-2 border-[#4a2618] bg-transparent px-5 text-sm font-black text-[#4a2618] transition-all duration-200 hover:bg-[#4a2618] hover:text-white"
              >
                <Navigation className="h-4 w-4" />
                <span>Get Directions</span>
              </a>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-[50px] flex-1 items-center justify-center gap-2 rounded-2xl bg-[#4a2618] hover:bg-[#381c11] px-5 text-sm font-black text-white shadow-md transition-all duration-200 hover:-translate-y-0.5"
              >
                <MessageCircle className="h-4 w-4 stroke-[2.5]" />
                <span>WhatsApp Order</span>
              </a>
            </div>
          </div>

          {/* Map Column */}
          <div className="relative min-h-[380px] overflow-hidden rounded-[32px] border border-[#4a2618]/15 bg-white shadow-[0_20px_50px_rgba(74,38,24,0.06)] lg:col-span-7">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3405.419139268571!2d74.17554637626955!3d31.431764451586566!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3918ffd624c965c7%3A0x6bfaeef7ddc3230a!2sCone%20Joy&#39;s!5e0!3m2!1sen!2s!4v1722000000000!5m2!1sen!2s"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: "380px" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Cone Joy's Google Maps Location"
              className="h-full w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
