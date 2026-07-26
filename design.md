# Cone Joys Responsive Design System

## Design direction

Editorial, flavour-led, and product-first. The hero uses a split layout on wide screens and a stacked layout on narrow screens. The cone is the visual anchor; text and controls must never compete with it.

## Design tokens

```css
--ink: #15150f;
--panel: #fffdf4;
--line: rgba(21, 21, 15, 0.18);
--ease: cubic-bezier(0.22, 1, 0.36, 1);
```

Each flavour owns a soft, sampled background colour. Background colours should be light enough for black text and quiet enough that the cone remains the focal point.

## Layout contract

### Wide desktop: 1200px and above

- Content width: `min(1380px, 100% - 64px)`.
- Navigation target height: approximately 96px.
- Hero grid: two columns, approximately 0.72fr / 1.28fr.
- Copy is left aligned.
- Stage disc is capped at 650px.
- Flavour label sits at the right edge of the stage.
- CTA and footer remain inside the viewport.

### Desktop and tablet landscape: 821px to 1199px

- Preserve the two-column grid.
- Reduce stage disc and cone with `clamp()` instead of fixed pixels.
- Keep at least 24px horizontal gap between copy and stage.
- If viewport height is 600px or less, use the compact landscape rules: smaller logo, hide the scroll cue, reduce headline and stage height.

### Tablet portrait: 600px to 820px

- Collapse to one column.
- Center copy.
- Keep the stage below the copy with a capped height around 420px.
- Place flavour label inside the lower-right of the stage, not outside the viewport.
- Keep the progress rail inside the right padding.

### Standard mobile: 481px to 599px

- Use 12px side gutters.
- Navigation height: approximately 64px.
- Logo width: approximately 80px.
- Headline uses `clamp(2.1rem, 10vw, 3.4rem)` and line-height around 0.88.
- Hide the scroll cue to protect vertical space.
- Stage height: `clamp(200px, 36svh, 320px)`.
- Cone width: no more than `min(58vw, 240px)`.
- CTA remains one line and uses a 36px minimum touch height.

### Small phone: up to 480px

- Use `width: calc(100% - 24px)` for navigation, hero grid, and footer.
- Keep the logo visually clear but compact.
- Never allow headline lines to overlap. The outlined line must have its own line box, a small top margin, and bottom padding.
- Use a short-height override at `max-height: 740px`: reduce nav, headline, lead, stage, progress rail, and footer together.
- Keep the disc below the copy and the flavour label within the stage bounds.
- The CTA must remain visible above the bottom edge.

### Mobile landscape

For `min-width: 600px` and `max-height: 600px`:

- Use a compact two-column layout.
- Hide the scroll cue.
- Use a 52px navigation and roughly 44px footer.
- Stage height is `calc(100svh - 96px)`.
- Disc width is based on viewport height, not only viewport width.
- Copy remains left aligned and the flavour label stays inside the stage.

## Typography rules

- Keep the hero heading to two visual lines.
- Use tight display typography, but never negative line-height that causes glyph overlap.
- `.outline` must have explicit `line-height`, `margin-top`, and `padding-bottom`.
- Body copy should stay under four lines on phones.
- Flavour names may wrap to two lines; counters must remain single line.

## Image rules

- Images are centered in the stage and use `object-fit: contain`.
- Never crop the cone tip or scoop.
- Never show two active images at the same time.
- Use `visibility: hidden` as well as `opacity: 0` for inactive images so transparent edges cannot visually blend.
- If an image is missing, the fallback must preserve the same approximate subject bounds.

## Interaction rules

- Scrolling changes the active flavour; there is no autoplay.
- A flavour transition can animate the active cone in, but the previous cone must be hidden first.
- Background colour transitions are allowed; they must not change layout.
- Hover effects are restricted to fine pointers.
- Reduced-motion mode removes movement and keeps the active item stable.

## Responsive QA matrix

| Viewport | Expected layout | Main risk to check |
|---|---|---|
| 320×568 | Compact stacked hero | CTA and logo clipping |
| 390×844 | Stacked hero | Cone/text overlap |
| 600×800 | Tablet stack | Label outside stage |
| 768×1024 | Tablet stack | Excess vertical whitespace |
| 844×390 | Landscape split | Stage height and footer |
| 1024×768 | Compact split | Copy and disc collision |
| 1440×900 | Full split | Right label and progress rail |
| 1920×1080 | Capped split | Over-scaling and empty space |

## Definition of responsive done

- No horizontal scrollbar at any matrix size.
- No text overlap at any matrix size.
- Logo remains identifiable at every size.
- Cone remains fully visible with tip and scoops inside the disc.
- Flavour name, counter, and CTA are readable and reachable.
- Background, active cone, and active label update together.
- Keyboard focus and reduced-motion behaviour remain intact.

