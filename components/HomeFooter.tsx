import Image from "next/image";
import Link from "next/link";

export default function HomeFooter() {
  return (
    <footer className="border-t border-[var(--home-brown)] bg-[var(--home-brown)] px-[clamp(16px,5vw,72px)] py-8 text-[var(--home-white)]">
      <div className="mx-auto flex w-full max-w-[1380px] items-center justify-between gap-6 max-sm:flex-col max-sm:items-start">
        <Link
          href="/"
          className="inline-flex min-h-11 items-center rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--home-white)]"
          aria-label="Cone Joy's Ice Cream home"
        >
          <Image
            src="/assets/conejoys-mascot-logo.png"
            alt="Cone Joy's Ice Cream"
            width={500}
            height={500}
            sizes="57px"
            className="h-auto w-[57px]"
            loading="lazy"
          />
        </Link>
        <a
          href="https://mavplo.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center text-sm font-bold underline decoration-1 underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--home-white)]"
        >
          Designed by MAVPLO · mavplo.com
        </a>
      </div>
    </footer>
  );
}
