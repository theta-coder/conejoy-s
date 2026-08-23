const WHATSAPP_URL =
  "https://wa.me/923407258700?text=Assalam-o-Alaikum%20Cone%20Joy%27s%2C%20I%20would%20like%20to%20place%20an%20order.";

export default function HomeContact() {
  return (
    <section
      id="visit"
      className="scroll-mt-[var(--header-height)] bg-[var(--home-cream)] px-[clamp(16px,5vw,72px)] pb-[clamp(72px,9vw,128px)] pt-[clamp(36px,4.5vw,64px)]"
      aria-labelledby="visit-title"
    >
      <div className="mx-auto grid w-full max-w-[1380px] grid-cols-[minmax(0,0.9fr)_minmax(360px,1.1fr)] items-start gap-[clamp(36px,8vw,120px)] max-md:grid-cols-1">
        <div>
          <h2
            id="visit-title"
            className="max-w-[680px] font-display text-[clamp(2.7rem,5.8vw,6rem)] font-extrabold leading-[0.9] tracking-[-0.07em]"
          >
            Visit us in Chung.
          </h2>
          <p className="mt-5 max-w-[520px] text-base font-semibold leading-relaxed text-[rgba(74,38,24,0.7)]">
            Stop by in Lahore or place your delivery order on WhatsApp.
          </p>
        </div>

        <div className="rounded-[28px] border border-[rgba(74,38,24,0.5)] bg-[var(--home-golden)] p-[clamp(24px,4vw,48px)] shadow-[0_18px_55px_rgba(74,38,24,0.12)]">
          <dl className="grid gap-7">
            <div>
              <dt className="text-xs font-black uppercase tracking-[0.14em] text-[var(--home-brown)]">Address</dt>
              <dd className="mt-2 font-display text-[clamp(1.6rem,3vw,2.5rem)] font-extrabold leading-tight tracking-[-0.04em]">
                Chung, Lahore
              </dd>
            </div>
            <div>
              <dt className="text-xs font-black uppercase tracking-[0.14em] text-[var(--home-brown)]">Opening hours</dt>
              <dd className="mt-2 text-lg font-black">12:00 PM to 12:00 AM</dd>
            </div>
            <div>
              <dt className="text-xs font-black uppercase tracking-[0.14em] text-[var(--home-brown)]">Delivery</dt>
              <dd className="mt-2 text-lg font-black">Available</dd>
            </div>
          </dl>

          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noreferrer"
            className="mt-9 inline-flex min-h-[52px] w-full items-center justify-center whitespace-nowrap rounded-full bg-[var(--home-brown)] px-7 text-sm font-black text-[var(--home-white)] transition-transform duration-200 ease-custom hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[var(--home-brown)]"
          >
            Order on WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
