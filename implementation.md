# Cone Joys Hero Implementation Plan

## Purpose

This document is the implementation source of truth for making the Cone Joys scroll hero fast, responsive, stable, and production-ready. It describes what must be implemented without changing the current code in this document's creation step.

## Current problem

The hero can feel slow because:

- Twelve large PNG files are downloaded at once.
- PNG assets contain much more data than the visible cone needs.
- Every scroll event can update many image styles.
- `filter: blur()` and large `drop-shadow()` effects are expensive on mobile GPUs.
- The current image dimensions are larger than the display dimensions.
- Vercel optimisation is not enough if the browser still receives oversized source images.
- Multiple dev servers or stale deployments can make testing look inconsistent.

## Target outcomes

The finished page should meet these targets:

- First meaningful hero content appears quickly on a 4G mobile connection.
- First cone is visible without waiting for all twelve images.
- Initial download contains only the logo, first cone, and the next useful cone.
- Later cones load progressively before they are needed.
- Scroll interaction stays visually smooth without layout changes.
- No horizontal overflow at supported breakpoints.
- The active cone never mixes with another cone.
- A reduced-motion user gets a stable, non-moving experience.

Recommended performance budgets:

| Metric | Target |
|---|---:|
| Initial hero image payload | under 250 KB compressed |
| Each cone asset | ideally 35–120 KB WebP/AVIF |
| Logo asset | under 50 KB |
| JavaScript for hero interaction | under 30 KB gzip where practical |
| Cumulative Layout Shift | under 0.1 |
| Interaction to Next Paint | under 200 ms |
| Lighthouse mobile performance | 85+ target |

## Implementation order

### Phase 1: Asset inventory and optimisation

1. Keep one production image per flavour.
2. Remove source, preview, screenshot, and duplicate assets from the deployment payload.
3. Crop transparent padding to the visible subject bounds while preserving a small edge margin.
4. Resize each cone to the largest size actually needed on desktop. Do not keep 1024px or 1536px originals if the displayed image never approaches that size.
5. Create AVIF and WebP versions for every cone.
6. Keep PNG only as a fallback when alpha quality or browser support requires it.
7. Inspect every converted asset for transparent corners, edge halos, colour fringing, and a clipped cone tip.
8. Keep stable filenames so references do not change on every build.

Suggested final asset set:

```text
public/assets/cones/mango.avif
public/assets/cones/mango.webp
public/assets/cones/mango.png       # fallback only if required
...
public/assets/conejoys-logo.webp
public/assets/conejoys-logo.png     # fallback
```

Use a generated `<picture>` only when the component needs explicit fallback control. Otherwise use `next/image` with a controlled `sizes` value.

### Phase 2: Next.js image delivery

For the Next.js route, use `next/image` for the logo and cone assets. Provide:

- Explicit `width` and `height` or a stable `fill` container.
- `sizes` matching the responsive layout.
- `priority` only for the logo and first visible cone.
- `loading="lazy"` for cones that are not initially visible.
- `quality` around 70–82 for photographic cone assets after visual checking.
- A fixed aspect-ratio wrapper to prevent layout shift.

Do not mark all twelve images as priority. Priority on every image defeats lazy loading and increases startup cost.

Recommended loading policy:

| Asset | Loading | Priority |
|---|---|---|
| Original logo | eager | yes |
| First active cone | eager | yes |
| Next cone | eager or preload after first paint | no |
| Previous cone | lazy | no |
| Remaining cones | lazy/progressive | no |

For the static HTML route, use `loading="lazy"`, `decoding="async"`, explicit dimensions, and WebP/AVIF sources.

### Phase 3: Progressive flavour preloading

Do not decode twelve large images during initial render.

Initial state:

```text
load activeIndex
preload activeIndex + 1
optionally preload activeIndex - 1
```

When the active index changes:

1. Set the active image immediately if it is already decoded.
2. Start loading the next image in the direction of travel.
3. Preload the adjacent image only after the active image is ready.
4. Never block the scroll handler waiting for a network request.
5. If an image is late, keep the current cone visible and show the new cone when decoded.

Use an image cache map so each asset is requested only once. Use `HTMLImageElement.decode()` outside the scroll handler.

### Phase 4: Scroll performance

The scroll listener must only schedule one animation frame:

```text
onScroll:
  if frame is already scheduled: return
  requestAnimationFrame(render)
```

Inside `render`:

- Read scroll geometry once.
- Calculate the active index once.
- Write styles in one batch.
- Do not call React state setters for continuous scroll progress.
- Use React state only for the discrete active flavour label/counter, or update a ref and DOM text directly.

Animate only:

- `transform`
- `opacity`

Avoid on every scroll frame:

- `width`
- `height`
- `top`
- `left`
- `margin`
- `padding`
- `filter`
- box-shadow changes
- layout reads after style writes

### Phase 5: Remove expensive visual effects

The following effects should be reduced or made static:

- Remove continuous `blur()` from inactive cones.
- Keep one static, low-cost shadow on the active cone.
- Avoid changing `filter` on every scroll frame.
- Replace large animated shadows with a static pseudo-element or low-opacity radial gradient.
- Do not animate the large background rings.
- Keep the white stage disc static.

If a depth cue is needed, use opacity and transform only. A slightly smaller inactive cone is enough; blur is not required.

### Phase 6: Stable carousel state

The visual rule is hard handoff:

```text
old cone: opacity 0, visibility hidden
new cone: opacity 1, visibility visible
```

Never use a continuous opacity crossfade between two large transparent PNGs. It creates visual mixing and makes the page feel slow.

For the three-cone carousel variation:

- Render previous, active, and next items only.
- Place the active item at scale 1.
- Place previous and next items at reduced scale and opacity.
- On a step change, recycle the DOM position instead of rendering all twelve large assets.
- Keep the active flavour text separate from the cone image transition.

## Responsive implementation rules

### Desktop, 1200px and above

- Two-column split layout.
- Maximum content width: 1380px.
- Stage disc capped around 650px.
- Cone width must be capped with `clamp()`.
- Copy remains left aligned.
- CTA and counter remain in the bottom row.

### Tablet, 600px to 1199px

- Use a single-column layout in portrait.
- Use a compact two-column layout in landscape with height below 600px.
- Keep the flavour label inside the stage bounds.
- Size the stage disc using both width and height constraints.

### Mobile, below 600px

- Use 12–16px horizontal gutters.
- Keep the logo identifiable but compact.
- Limit the headline to two visual lines.
- Hide non-essential scroll cue on short screens.
- Keep the cone inside a fixed stage box with `aspect-ratio`.
- Keep CTA touch target at least 44px where space allows.
- Use a short-height override for devices below 700px height.
- Never allow the flavour label or progress rail to create horizontal overflow.

### Mobile landscape

- Use a compact split layout.
- Reduce nav and footer heights.
- Hide the scroll cue.
- Size the disc and cone from viewport height.
- Keep copy, stage, and footer within `100svh`.

## Accessibility requirements

- Keep the semantic `main`, `nav`, and labelled sections.
- Provide accurate alt text for every flavour.
- Mark inactive decorative images `aria-hidden="true"`.
- Make progress buttons keyboard reachable.
- Provide visible focus states.
- Respect `prefers-reduced-motion: reduce`.
- Do not make flavour discovery depend only on animation.
- Keep contrast at WCAG AA for text and CTA.

## Vercel deployment requirements

1. Deploy the Next.js app route from `app/page.tsx`.
2. Keep `public/assets` in the repository.
3. Ensure `tailwind.config.js` scans `app`, `components`, `pages`, and `src`.
4. Do not ignore `public/assets/cones` in `.vercelignore`.
5. Use `npm ci` for installation and `npm run build` for the build command.
6. Confirm the Vercel project root is the folder containing `package.json` and `app/`.
7. Redeploy after pushing config or CSS changes.
8. Test the production URL in a clean/incognito window after deployment.

## Verification commands

Run locally:

```bash
npm ci
npm run build
npm run dev
```

Then verify:

- First load on a throttled mobile connection.
- Network panel: initial images and their sizes.
- No 404 image requests.
- No horizontal overflow.
- No hydration or runtime errors.
- Scroll from flavour 01 to flavour 12.
- Verify exactly one active cone for hard handoff mode.
- Verify three visible cones only for the three-cone carousel mode.
- Test reduced motion.
- Test 320×568, 390×844, 768×1024, 844×390, 1024×768, 1440×900, and 1920×1080.

## Definition of done

- All production images are compressed and served in modern formats.
- Initial load does not request all twelve heavy images.
- Scroll remains responsive on a mid-range mobile device.
- No continuous blur or shadow animation remains.
- No image mixing occurs during fast scrolling.
- All supported viewports remain readable and usable.
- `npm run build` passes.
- Vercel production URL displays the same layout as local production mode.

