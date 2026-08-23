# Cone Joy's production performance audit

Audited 2026-08-23. Mobile is the primary target. “Before” is the deployed site at https://conejoy-s.vercel.app/. “Candidate” is the optimized local production build. Lighthouse used the same v12.8.2 simulated mobile/desktop presets, but origin latency differs, so transfer/request comparisons are stronger evidence than live-vs-local timing comparisons. A deployed rerun is required for final production timing.

## Architecture

- Next.js 15.5.22, React 19, App Router, Tailwind CSS 3.
- All routes are statically prerendered: `/`, `/cups`, and `/shakes`. There are no API routes, middleware, serverless data calls, or runtime dynamic rendering.
- Shared first-load JavaScript is 103 KB build output; route totals are 120 KB (`/`), 121 KB (`/cups`), and 120 KB (`/shakes`).
- Interactive route shells are Client Components. The root is wrapped by a cart provider; cart persistence uses localStorage.
- Fonts use `next/font`: DM Sans and Manrope, transferring about 62 KB. There are no external font requests.
- No initial third-party JavaScript, analytics, widgets, or tracking scripts.
- The home experience uses a scroll-linked rAF animation. Scroll/touch/wheel/key listeners are passive where applicable and cleaned up; mobile disables the most expensive filters/backdrop effects.
- Search filters only 12 records. Its compute cost is negligible and does not justify added architecture.

## Baseline and candidate — mobile

| Route | State | Score | FCP | LCP | CLS | TBT | Speed Index | TTI | Transfer | Requests |
|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| / | Live before | 92 | 1.034 s | 3.124 s | 0 | 144 ms | 1.549 s | 3.237 s | 1,830,243 B | 27 |
| / | Local candidate | 94 | 1.254 s | 2.904 s | 0.0007 | 55 ms | 3.411 s | 2.926 s | 350,100 B | 15 |
| /cups | Live before | 90 | 1.101 s | 2.954 s | 0 | 182 ms | 3.779 s | 2.954 s | 411,858 B | 17 |
| /cups | Local candidate | 95 | 1.234 s | 2.773 s | 0.0007 | 111 ms | 2.393 s | 2.785 s | 292,843 B | 18 |
| /shakes | Live before | 94 | 1.049 s | 2.769 s | 0 | 92 ms | 4.085 s | 2.815 s | 417,008 B | 19 |
| /shakes | Local candidate | 95 | 1.236 s | 2.640 s | 0.0006 | 170 ms | 1.534 s | 2.811 s | 279,429 B | 20 |

The local candidate FCP and the shakes TBT run regressed; those values must not be presented as production improvements. Lighthouse variance plus local-vs-live origin differences make a post-deployment repeat necessary.

## Baseline and candidate — desktop

| Route | State | Score | FCP | LCP | CLS | TBT | Speed Index | TTI | Transfer |
|---|---|---:|---:|---:|---:|---:|---:|---:|---:|
| / | Live before | 99 | 573 ms | 926 ms | 0 | 6 ms | 934 ms | 932 ms | 1,830,154 B |
| / | Local candidate | 100 | 345 ms | 633 ms | 0.0055 | 16 ms | 672 ms | 636 ms | 340,459 B |
| /cups | Live before | 100 | 439 ms | 709 ms | 0 | 23 ms | 654 ms | 709 ms | 411,828 B |
| /cups | Local candidate | 100 | 342 ms | 605 ms | 0.0018 | 0 ms | 670 ms | 608 ms | 283,204 B |
| /shakes | Live before | 100 | 403 ms | 694 ms | 0 | 6 ms | 633 ms | 698 ms | 417,016 B |
| /shakes | Local candidate | 100 | 344 ms | 558 ms | 0.0014 | 0 ms | 698 ms | 560 ms | 264,359 B |

## Exact live bottlenecks

- Home LCP: Mango cone image. Live LCP was 3.124 s. Home transferred 1,609,120 B of images and requested all 12 cone WebPs within the first second.
- Cups LCP: Mango cup image. Its modern Lighthouse breakdown attributed about 1.966 s to element render delay.
- Shakes LCP: Mango shake image. Its modern breakdown attributed about 1.959 s to element render delay.
- Main thread on mobile: script evaluation was about 493–506 ms per route. The largest live tasks were roughly 232–255 ms in the shared React chunk.
- Render blocking: one 10.6 KB stylesheet, estimated at 150 ms. It is already small; splitting it is lower value than image/loading work.
- Logo: 500×311, 135,122 B, rendered around 80×50. Lighthouse estimated about 131 KB of avoidable waste.
- Public static images return `Cache-Control: public, max-age=0, must-revalidate`. Repeat visits revalidate mutable public filenames.
- Field INP/CrUX was unavailable: the PageSpeed endpoint rate-limited the query and Vercel Speed Insights is not installed. Lab event processing was fast (home next control 24 ms; cup flavour change 56 ms). Sheet presentation reports 256–264 ms because it includes the intentional 260 ms entrance motion; first and second animation frames were measured at 4 ms and 11.8 ms, so this was not a long JavaScript handler.
- `/assets/favicon.png` returns 404 in both live and local builds.

## Prioritized plan

| Priority | Issue | Current problem | User impact | Recommended fix | Expected gain | Risk |
|---|---|---|---|---|---|---|
| P0 | Home requests every cone | 1.61 MB initial image transfer | LCP contention and wasted mobile data | Mount active/adjacent images only | 1.0–1.4 MB expected; measured 1.47 MB image reduction | Medium |
| P1 | Oversized logo/product delivery | Source pixels greatly exceed display size | Network and decode cost | Responsive Next Image with accurate sizes | 100+ KB/route | Low |
| P1 | Product LCP render delay | ~1.96 s element render delay | Late visual completion | Reduce critical hydration/render work only after deployed trace | 0.5–1.2 s target | Medium |
| P1 | Mobile main-thread tasks | 232–255 ms shared React tasks | INP/LCP risk on slower CPUs | Narrow client/cart subscriptions after React profiling | Better interaction headroom | Medium |
| P2 | Immediate route/image prefetch | Competes with first load | Slower constrained-network load | Prefetch near intent; respect Save-Data/2G | Less contention | Low |
| P2 | Mutable asset revalidation | max-age=0 for public images | Repeat-visit latency | Fingerprint URLs or rely on Next image cache | Repeat-load win | Medium |
| P2 | Cart context breadth | One context updates all consumers | Unrelated rerenders | Split state/actions only after render profiling | Interaction win | Medium |
| P3 | Dot height/effect animation | Minor layout/paint work | Small smoothness cost | Transform-based indicator if profiling confirms | Small | Low |
| P3 | Search filtering | Only 12 items | Negligible | Keep simple | None needed | Low |

## Performance budget

| Item | Mobile budget |
|---|---:|
| Initial JavaScript transferred | ≤130 KB |
| Initial CSS transferred | ≤15 KB |
| Home LCP image | ≤80 KB |
| Product LCP image | ≤50 KB |
| All initial images | ≤250 KB |
| Total initial transfer | ≤500 KB home; ≤400 KB product routes |
| Initial requests | ≤20 home; ≤18 product routes |
| Fonts | ≤65 KB |
| Initial third-party JS | 0 KB |
| LCP / CLS / INP | <2.5 s / <0.1 / <200 ms |

The candidate meets the byte budgets. Shakes has 20 initial requests, two over its product-route request budget; this is not worth trading away current UX without a deployed waterfall showing harm.

## Current public image inventory

The library contains 75 image files totaling 28513.4 KB. PNG and WebP pairs share dimensions. “Current strategy” describes the optimized candidate, not the older live deployment.

| Filename | Format, dimensions, file size | Where / fold | Current or recommended loading |
|---|---|---|---|
| `assets/conejoys-logo.*` | PNG 240×163, 48.1 KB<br>WEBP 240×163, 20.3 KB | Not referenced by current app | Unused duplicate: remove only after external-reference check |
| `assets/conejoys-logo-new.*` | PNG 500×311, 132.0 KB | Navigation on every route | Above fold: responsive Next Image; eager |
| `assets/cones/blueberry.*` | PNG 516×1487, 1188.0 KB<br>WEBP 516×1487, 111.7 KB | Home cone carousel | Deferred: mounted only when active/adjacent; active eager, adjacent lazy |
| `assets/cones/caramel-crunch.*` | PNG 540×1401, 1178.8 KB<br>WEBP 540×1401, 120.3 KB | Home cone carousel | Deferred: mounted only when active/adjacent; active eager, adjacent lazy |
| `assets/cones/chocolate.*` | PNG 511×1332, 993.9 KB<br>WEBP 511×1332, 102.2 KB | Home cone carousel | Deferred: mounted only when active/adjacent; active eager, adjacent lazy |
| `assets/cones/coconut-delight.*` | PNG 540×1307, 902.3 KB<br>WEBP 540×1307, 73.6 KB | Home cone carousel | Deferred: mounted only when active/adjacent; active eager, adjacent lazy |
| `assets/cones/coffee-chino.*` | PNG 506×1350, 1036.1 KB<br>WEBP 506×1350, 111.8 KB | Home cone carousel | Deferred: mounted only when active/adjacent; active eager, adjacent lazy |
| `assets/cones/kit-kat.*` | PNG 477×1394, 1013.3 KB<br>WEBP 477×1394, 106.7 KB | Home cone carousel | Deferred: mounted only when active/adjacent; active eager, adjacent lazy |
| `assets/cones/kulfa.*` | PNG 466×1302, 802.9 KB<br>WEBP 466×1302, 64.7 KB | Home cone carousel | Deferred: mounted only when active/adjacent; active eager, adjacent lazy |
| `assets/cones/mango.*` | PNG 540×1500, 1046.0 KB<br>WEBP 540×1500, 88.2 KB | Home cone carousel | Above fold/LCP: Next Image, eager + high priority; adjacent only after state window |
| `assets/cones/pistachio.*` | PNG 540×1131, 751.0 KB<br>WEBP 540×1131, 71.9 KB | Home cone carousel | Deferred: mounted only when active/adjacent; active eager, adjacent lazy |
| `assets/cones/strawberry.*` | PNG 511×1354, 886.0 KB<br>WEBP 511×1354, 67.4 KB | Home cone carousel | Deferred: mounted only when active/adjacent; active eager, adjacent lazy |
| `assets/cones/tutti-frutti.*` | PNG 493×1416, 892.5 KB<br>WEBP 493×1416, 64.7 KB | Home cone carousel | Deferred: mounted only when active/adjacent; active eager, adjacent lazy |
| `assets/cones/vanilla.*` | PNG 470×1345, 800.3 KB<br>WEBP 470×1345, 56.2 KB | Home cone carousel | Deferred: mounted only when active/adjacent; active eager, adjacent lazy |
| `assets/cups/black-currant.*` | PNG 400×459, 265.5 KB<br>WEBP 400×459, 33.0 KB | Cups carousel/cart | Lazy/near-critical: only previous/current/next are mounted |
| `assets/cups/caramel-crunch.*` | PNG 414×468, 275.8 KB<br>WEBP 414×468, 33.6 KB | Cups carousel/cart | Lazy/near-critical: only previous/current/next are mounted |
| `assets/cups/chocolate-chip.*` | PNG 389×464, 268.5 KB<br>WEBP 389×464, 34.5 KB | Cups carousel/cart | Lazy/near-critical: only previous/current/next are mounted |
| `assets/cups/coconut-delight.*` | PNG 433×500, 297.5 KB<br>WEBP 433×500, 33.2 KB | Cups carousel/cart | Lazy/near-critical: only previous/current/next are mounted |
| `assets/cups/coffee-chino.*` | PNG 430×500, 318.7 KB<br>WEBP 430×500, 40.0 KB | Cups carousel/cart | Lazy/near-critical: only previous/current/next are mounted |
| `assets/cups/kit-kat.*` | PNG 446×500, 352.7 KB<br>WEBP 446×500, 46.1 KB | Cups carousel/cart | Lazy/near-critical: only previous/current/next are mounted |
| `assets/cups/kulfa.*` | PNG 398×456, 245.5 KB<br>WEBP 398×456, 27.7 KB | Cups carousel/cart | Lazy/near-critical: only previous/current/next are mounted |
| `assets/cups/mango.*` | PNG 393×454, 236.3 KB<br>WEBP 393×454, 26.8 KB | Cups carousel/cart | Above fold/LCP: Next Image, eager + high priority |
| `assets/cups/pista.*` | PNG 419×484, 277.3 KB<br>WEBP 419×484, 32.3 KB | Cups carousel/cart | Lazy/near-critical: only previous/current/next are mounted |
| `assets/cups/strawberry.*` | PNG 418×485, 280.6 KB<br>WEBP 418×485, 33.3 KB | Cups carousel/cart | Lazy/near-critical: only previous/current/next are mounted |
| `assets/cups/tutti-frutti.*` | PNG 433×499, 313.9 KB<br>WEBP 433×499, 38.9 KB | Cups carousel/cart | Lazy/near-critical: only previous/current/next are mounted |
| `assets/cups/vanilla.*` | PNG 402×473, 226.2 KB<br>WEBP 402×473, 24.0 KB | Cups carousel/cart | Lazy/near-critical: only previous/current/next are mounted |
| `assets/shakes/black-currant.*` | PNG 900×900, 1011.6 KB<br>WEBP 900×900, 33.9 KB | Shakes carousel/cart | Lazy/near-critical: only previous/current/next are mounted |
| `assets/shakes/caramel-crunch.*` | PNG 900×900, 1015.7 KB<br>WEBP 900×900, 28.7 KB | Shakes carousel/cart | Lazy/near-critical: only previous/current/next are mounted |
| `assets/shakes/chocolate-chip.*` | PNG 900×900, 1005.9 KB<br>WEBP 900×900, 35.3 KB | Shakes carousel/cart | Lazy/near-critical: only previous/current/next are mounted |
| `assets/shakes/coconut-delight.*` | PNG 900×900, 890.6 KB<br>WEBP 900×900, 18.8 KB | Shakes carousel/cart | Lazy/near-critical: only previous/current/next are mounted |
| `assets/shakes/coffee-chino.*` | PNG 900×900, 1008.8 KB<br>WEBP 900×900, 31.8 KB | Shakes carousel/cart | Lazy/near-critical: only previous/current/next are mounted |
| `assets/shakes/kit-kat.*` | PNG 900×900, 1056.3 KB<br>WEBP 900×900, 38.5 KB | Shakes carousel/cart | Lazy/near-critical: only previous/current/next are mounted |
| `assets/shakes/kulfa.*` | PNG 900×900, 956.9 KB<br>WEBP 900×900, 22.9 KB | Shakes carousel/cart | Lazy/near-critical: only previous/current/next are mounted |
| `assets/shakes/mango.*` | PNG 900×900, 940.7 KB<br>WEBP 900×900, 25.7 KB | Shakes carousel/cart | Above fold/LCP: Next Image, eager + high priority |
| `assets/shakes/pista.*` | PNG 900×900, 976.3 KB<br>WEBP 900×900, 27.8 KB | Shakes carousel/cart | Lazy/near-critical: only previous/current/next are mounted |
| `assets/shakes/strawberry.*` | PNG 900×900, 941.1 KB<br>WEBP 900×900, 25.7 KB | Shakes carousel/cart | Lazy/near-critical: only previous/current/next are mounted |
| `assets/shakes/tutti-frutti.*` | PNG 900×900, 943.3 KB<br>WEBP 900×900, 24.1 KB | Shakes carousel/cart | Lazy/near-critical: only previous/current/next are mounted |
| `assets/shakes/vanilla.*` | PNG 900×900, 938.6 KB<br>WEBP 900×900, 21.5 KB | Shakes carousel/cart | Lazy/near-critical: only previous/current/next are mounted |
| `assets/favicon.png` | Missing (metadata references it) | Browser tab metadata | Supply a small branded 32–64 px icon; current live/local request is 404 |

## Implemented and verified

- Responsive Next Image delivery for navigation logos, cone/cup/shake visuals, and cart thumbnails.
- Accurate `sizes`, reserved dimensions, priority only on the active LCP visual.
- Home cone DOM/network window limited to active plus adjacent flavours; all flavour labels and progress controls remain rendered.
- Removed the redundant manual adjacent-image allocator.
- Deferred `/cups` prefetch until the visitor reaches the final three cones; skipped it on Save-Data/2G.
- Static generation and the existing animation/UX were preserved.

Verification: production build passed; all 12 cone/cup/shake states loaded; search, navigation, quantity, serving/size selection, cart add/open/close/persistence, and WhatsApp link presence passed; no console errors; no broken mounted images; 360/375/390/412/430 px had no horizontal overflow; desktop visual check passed.

## Remaining work

1. Deploy the candidate and rerun the same Lighthouse matrix against Vercel. Local timings are not the final production result.
2. Add Vercel Speed Insights or another privacy-appropriate RUM source to collect p75 LCP/INP/CLS by route and device.
3. Supply a small branded favicon to remove the existing 404.
4. Profile real field interactions before splitting cart context or changing the 260 ms sheets.
5. If repeat traffic matters, fingerprint static image URLs before applying immutable caching.
6. Remove duplicate PNG/WebP source variants only after confirming no external or legacy page consumes them.

