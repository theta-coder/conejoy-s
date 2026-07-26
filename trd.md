# Cone Joys Scroll Hero Technical Requirements

## Runtime

- Entry page: `cone-scroll.html`
- Hosting model: static HTML, CSS, JavaScript, or Live Server.
- No framework or build step is required by the page.
- Assets are relative to `./assets/`.
- WhatsApp order number is configured in the two `wa.me` links.

## DOM structure

```text
scroll-story (1200svh)
└── hero (sticky, 100svh)
    ├── nav
    ├── hero-grid
    │   ├── copy
    │   └── stage
    │       ├── stage-disc
    │       ├── cone-stack (12 images)
    │       ├── flavour-stack (12 labels)
    │       └── progress (12 indicators)
    └── footer-line
```

## Scroll state

The script maps scroll progress to a discrete flavour index:

```text
progress = clamp(scrollTop / scrollRange, 0, 1)
activeIndex = round(progress * (coneCount - 1))
```

On an index change:

1. Cancel existing Web Animations on cones and labels.
2. Set every inactive cone and label to `opacity: 0` and `visibility: hidden`.
3. Set only the active cone and label to visible.
4. Animate the active pair with transform and opacity only.
5. Update background colour, counter, and progress indicator.

This hard handoff is intentional. Do not reintroduce continuous crossfading because it causes cones and labels to visually mix during fast scrolling.

## Asset contract

Every flavour image must be:

- PNG with an alpha channel.
- A single upright cone with generous transparent padding.
- Free of text, watermark, cast shadow, and background colour.
- Named after the flavour in kebab case.
- Given an accurate flavour-specific `alt` value.

Current production assets live in `assets/cones/`. The original brand mark is `assets/conejoys-logo.png`.

If an asset fails to load, the inline SVG fallback keeps the layout usable. Replace failed assets rather than relying on the fallback as a final product image.

## Performance

- Update state inside one `requestAnimationFrame` callback.
- Use passive scroll listeners.
- Animate only `transform` and `opacity`.
- Keep the sticky stage isolated from layout-changing animations.
- Avoid adding a library import to this static page unless a bundler is introduced.
- Use `loading="eager"` for the first cone and consider `decoding="async"` for later images if image payload grows.

## Accessibility

- Keep the semantic `main`, `nav`, `section`, `h1`, and labelled regions.
- Keep one meaningful alt text per flavour image.
- Mark inactive decorative images as `aria-hidden="true"` in the state update.
- Keep visible keyboard focus styles on links and the CTA.
- Keep `prefers-reduced-motion: reduce`: no transform animation and no smooth scrolling.
- Ensure black text meets WCAG AA against every flavour background.

## Verification checklist

- 320×568, 390×844, 768×1024, 1024×768, 844×390, and 1440×900.
- Scroll from first to last flavour and confirm counter values 01 through 12.
- Confirm exactly one `.cone` is visible after each index change.
- Confirm `document.documentElement.scrollWidth === innerWidth`.
- Confirm all image requests resolve and no Vite/browser overlay appears.
- Test with reduced motion enabled.

