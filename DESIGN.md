# Design System: Daily Capsule

## 1. Visual Theme & Atmosphere

Daily Capsule is a pocket-sized memory ritual, not a productivity dashboard. The interface should feel like a quiet editorial photo journal: tactile, intimate, warm, and slightly cinematic. Photos carry emotional weight; typography and whitespace frame them without competing for attention.

- **Density:** 3/10 — gallery-airy. A screen should communicate one primary idea at a time.
- **Variance:** 7/10 — deliberately offset and asymmetric, while preserving a calm reading rhythm.
- **Motion:** 6/10 — fluid, weighty, and ritualistic. The sealing interaction is the signature moment.
- **Personality:** contemporary editorial photography mixed with a well-made paper notebook.
- **Core principle:** one day, one memory, one decisive action.

The product should feel personal after the first capsule and increasingly precious over time. Avoid gamification language, productivity metrics, and social-media visual conventions. Streaks, counts, and sync status remain secondary to the memory itself.

Use light mode as the canonical direction. Dark mode may be derived later, but it must preserve warm neutrals rather than shifting to blue-gray.

## 2. Color Palette & Roles

Use this warm-neutral palette consistently. Do not mix it with cool slate or blue-gray neutrals.

- **Album Paper** (`#F3EFE7`) — primary app canvas; a warm, low-contrast paper surface.
- **Raised Paper** (`#FBF8F2`) — sheets, form surfaces, menus, and elevated controls.
- **Charcoal Ink** (`#24211D`) — primary text, icons, and strong structural details; never use pure black.
- **Faded Ink** (`#746F66`) — captions, metadata, helper text, and inactive navigation.
- **Hairline Linen** (`#DCD5C9`) — one-pixel dividers, input outlines, calendar rules, and subtle boundaries.
- **Pressed Linen** (`#C9C0B3`) — pressed states and stronger neutral outlines.
- **Persimmon Seal** (`#C65D3B`) — the single accent; reserved for the primary Seal action, selected mood, current date, focus ring, and rare status moments.
- **Error Clay** (`#9E3F32`) — inline destructive or error copy only. It is a semantic exception, never decorative.
- **Soft Shadow** (`rgba(59, 47, 36, 0.12)`) — shadows tinted toward the warm canvas.
- **Photo Scrim** (`rgba(24, 21, 18, 0.38)`) — readable text over photography, used sparingly.

Color behavior:

- Keep at least 80% of each screen in Album Paper, Raised Paper, photography, or Charcoal Ink.
- Persimmon Seal should occupy less than 8% of a typical screen.
- Never use gradients as decoration. A subtle transparent photo scrim is allowed only to protect text contrast.
- Mood selection uses shape, label, and accent together; never rely on color alone.
- Focus states use a two-pixel Persimmon Seal ring with a two-pixel Album Paper offset.

## 3. Typography Rules

Use typography to make each day feel dated, authored, and collectible.

- **Display and editorial moments:** `Instrument Serif`, weight 400. Use for the date numeral, capsule quotation, monthly title, and short emotional prompts. It must never be used for controls or dense metadata.
- **Interface and body:** `Satoshi`, weights 400, 500, and 600. Use for navigation, labels, buttons, helper text, and body copy.
- **Metadata:** `Geist Mono`, weights 400 and 500. Use for dates, timestamps, image count, sync state, and compact calendar labels.
- **Fallbacks:** Display falls back to `ui-serif`; interface falls back to `Arial, sans-serif`; metadata falls back to `ui-monospace, monospace`.
- **Banned:** Inter, Times New Roman, Georgia, Garamond, Palatino, and generic decorative script fonts.

Type scale:

- **Date display:** `clamp(4.75rem, 22vw, 7.5rem)`, line-height `0.82`, letter-spacing `-0.055em`.
- **Screen title:** `clamp(2.25rem, 9vw, 3.5rem)`, line-height `0.95`, letter-spacing `-0.035em`.
- **Capsule quote:** `clamp(1.75rem, 7vw, 2.75rem)`, line-height `1.08`, letter-spacing `-0.025em`.
- **Section title:** `1.375rem`, line-height `1.15`, letter-spacing `-0.02em`.
- **Body:** `1rem`, line-height `1.6`; maximum line length `58ch`.
- **Control:** `0.9375rem`, line-height `1.2`, weight 600.
- **Metadata:** `0.75rem`, line-height `1.35`, letter-spacing `0.08em`, uppercase only for short labels.

Do not create hierarchy by making every heading large. Prefer weight, whitespace, font pairing, and muted color. Long notes always use Satoshi, never the display serif.

## 4. Component Stylings

### Primary seal button

- Full-width on mobile, minimum height `56px`, pill radius `999px`.
- Persimmon Seal fill with Raised Paper text.
- The label is always a direct verb: `Seal today` before creation and `Sealed` afterward.
- On press, translate down `1px` and scale to `0.985`; the shadow contracts with the motion.
- No icon unless the icon communicates sealed state after completion.
- Disabled state uses Pressed Linen fill and Faded Ink text; never lower opacity below readable contrast.

### Secondary and icon buttons

- Raised Paper or transparent background, Charcoal Ink foreground, one-pixel Hairline Linen border when containment is necessary.
- Minimum `44px` square tap target.
- Corners are `16px` for square controls and fully rounded for compact text controls.
- Active feedback is a `0.98` scale and a subtle Pressed Linen surface change.
- No neon glow, glassmorphism, or floating circular action button.

### Photo well

- This is the dominant creation surface, not a generic upload card.
- Use a portrait ratio close to `4:5`, width `100%`, maximum height `52dvh`, and `28px` corners.
- Empty state is an editorial composition: a fine inset frame, a short prompt, and one restrained camera glyph.
- Once selected, the photo fills the well using `object-fit: cover`. Editing controls live in a separate row beneath it and never overlap the image.
- Loading uses a fixed-dimension warm shimmer that exactly matches the final photo well.

### Mood selector

- Use five named, abstract glyphs drawn as simple lines and filled shapes; do not use emoji.
- Labels: `Heavy`, `Still`, `Good`, `Light`, `Alive`.
- Arrange in a five-column grid with equal `48px` minimum targets, but visually emphasize only the selected item.
- Selected state gains a Persimmon Seal keyline, Raised Paper fill, and the text label beneath. Unselected states remain borderless.
- Screen readers receive the full label and selected state.

### Note field

- Label sits above the field: `One sentence to keep`.
- Raised Paper fill, one-pixel Hairline Linen border, `20px` corners, `18px` internal padding.
- Minimum height `112px`; maximum recommended input `180` characters with an understated mono counter.
- Focus uses the defined accent ring. Error copy appears immediately below in Error Clay.
- Never use a floating label or an underline-only input.

### Memory tiles

- Tiles behave like prints laid into an album, not dashboard cards.
- Photography is `3:4` or `4:5`, with `20px` corners. Metadata sits below the image in open space, not in a boxed footer.
- Use elevation only for the featured memory. Ordinary tiles use no shadow.
- Month groups are separated by generous whitespace and a fine top rule.
- The first memory in a month may span the full content width; following items use an offset two-column rhythm on screens wider than `390px` and a single column on narrower screens.

### Calendar cells

- Build with CSS Grid. Seven equal columns, fixed aspect ratio cells, minimum `44px` tap target.
- A day with a memory shows a cropped image fragment or abstract mood mark. A day without one remains Album Paper.
- Today uses a small Persimmon Seal keyline, not a filled red circle.
- Selected date uses a Raised Paper inset surface and Charcoal Ink border.
- The grid has no card container and no heavy box around each cell.

### Bottom navigation

- Three destinations: `Today`, `Memories`, `Calendar`.
- Fixed above the device safe area on mobile; use a Raised Paper surface with a one-pixel top rule.
- Height is `64px` plus `env(safe-area-inset-bottom)`.
- Icons are simple `1.75px` strokes. Active state uses Charcoal Ink and a small Persimmon Seal dash; inactive state uses Faded Ink.
- No oversized central action and no floating glass pill.

### Feedback states

- **Loading:** skeletons with the same geometry as final content; a low-contrast highlight travels once, then slows to a gentle loop.
- **Empty memories:** show one framed blank print, the current month title, and copy explaining that the first sealed day will appear there. Offer one link back to Today.
- **Offline:** a compact inline paper strip reading `Saved on this device` beneath the primary action. It should reassure, not alarm.
- **Sync error:** preserve the local capsule, explain the issue inline, and provide a `Try again` text action. Never use a blocking modal for sync failure.

## 5. Layout Principles

Daily Capsule is mobile-first and optimized for `360px` to `430px` wide viewports. It must remain elegant on tablets and desktop without turning into a dashboard.

- Use a twelve-column CSS Grid on wide screens and a four-column CSS Grid on mobile.
- Mobile side padding is `20px`; increase to `28px` above `390px` and `40px` on tablets.
- The primary mobile content column is capped at `480px` and centered on desktop. Detail views may expand to a two-column composition capped at `1120px`.
- Full-height experiences use `min-height: 100dvh`, never `100vh`.
- Respect `env(safe-area-inset-top)` and `env(safe-area-inset-bottom)`.
- Vertical spacing follows an `8px` base rhythm, with meaningful steps of `8`, `12`, `16`, `24`, `32`, `48`, and `72px`.
- Never overlap text, imagery, controls, or navigation. Every element owns a clean spatial zone.
- Avoid nested cards. Use whitespace, thin rules, typography, and photography to define hierarchy.
- No horizontal page scrolling at any viewport.

### Screen 1: Today — unsealed

This is the primary ritual and the first screen after launch.

1. A quiet top row contains the wordmark on the left and a small settings control on the right.
2. The date composition is left-aligned and asymmetric: a very large serif day numeral with the month and weekday set in compact mono type beside its lower edge.
3. The prompt `What will you keep from today?` sits beneath, limited to two lines and aligned to the left.
4. The portrait photo well fills most of the middle viewport.
5. Mood selector, note field, and Seal button follow in a single vertical flow.
6. Bottom navigation remains visible, but it yields visual priority to the form.

Do not center the entire composition. The date may align to column one while the prompt begins at column two to create a controlled editorial offset.

### Screen 2: Today — sealed

The sealed capsule becomes the hero.

1. The photograph is large and nearly edge-to-edge within the content column, with no text over it.
2. Date and mood sit in a compact mono row above the image.
3. The saved sentence appears below as an Instrument Serif quotation.
4. A small seal mark and `Sealed today` label close the composition.
5. Editing, if temporarily available, is a quiet text action placed below the seal status with the remaining edit window.

The post-seal screen should feel complete and still. Do not add confetti, scores, streak banners, or recommendations.

### Screen 3: Memories

1. Start with an offset editorial title: current year in mono above `Memories` in display serif.
2. Group content by month with one featured full-width memory followed by an irregular but orderly album grid.
3. Preserve original photo ratios within defined tile families; avoid masonry that causes unstable reflow.
4. Metadata stays beneath each photo and includes day, short mood label, and optional truncated sentence.
5. New month groups reveal in a staggered cascade as they enter the viewport.

### Screen 4: Calendar

1. Place the month name left and year right on the same baseline with unequal visual weight.
2. Use a clean seven-column grid with image fragments and abstract mood marks.
3. Below the calendar, show a quiet monthly summary as a border-top section, not a card: sealed days, most frequent mood, and longest gap only when enough data exists.
4. Selecting a day reveals a compact memory preview below the grid; it never opens as an overlapping popover on mobile.

### Screen 5: Capsule detail

1. On mobile, the image appears first and consumes up to `62dvh`; content continues naturally below.
2. On tablets and desktop, use an asymmetric `7/5` split: photograph on the left, date, mood, and sentence on the right.
3. Previous and next navigation appears as labeled edge controls beneath the content, never as arrows floating over the photo.
4. Preserve a cinematic pace through large whitespace and restrained metadata.

### Responsive behavior

- Below `768px`, every multi-column content layout becomes a single column except the calendar grid and mood selector.
- Below `390px`, Memories uses one column and slightly smaller image radii.
- At `768px` and above, Today remains a narrow ritual column; do not stretch its form across the viewport.
- At `1024px` and above, Capsule detail adopts the asymmetric split layout.
- Typography scales with `clamp()`; body text never drops below `16px` and metadata never below `12px`.
- All interactive targets are at least `44px` in both dimensions.

## 6. Motion & Interaction

Motion should suggest paper, weight, and preservation. Default transitions use spring physics with `stiffness: 100` and `damping: 20`. Animate only `transform` and `opacity`.

### Signature seal sequence

1. On press, the button compresses to `0.985` for `90ms`.
2. The form content gently fades and translates downward by `8px`.
3. A thin Persimmon Seal ring draws around a small abstract seal mark using an SVG stroke animation.
4. The mark settles with a single `1.025` to `1` spring.
5. The sealed capsule content reveals in three staggered steps: metadata, photo, quotation.

The full sequence should complete in approximately `900–1200ms`. It must not resemble a reward explosion.

### Ambient micro-interactions

- The empty photo well has an almost imperceptible `2px` vertical float over six seconds.
- The active bottom-nav dash breathes between `0.75` and `1` opacity over three seconds.
- The selected mood glyph has a subtle four-second scale breath from `1` to `1.035`.
- Offline and syncing labels use a restrained traveling highlight within their text or rule, never a spinner.
- Memory lists mount with `40ms` staggered opacity and `12px` translate reveals.

### Gestures and state changes

- Photo selection crossfades from placeholder to image without changing container dimensions.
- Month changes use directional `12px` translation plus opacity, with direction matching navigation.
- Detail navigation supports a horizontal swipe threshold but always exposes visible Previous and Next buttons.
- Destructive actions require a clearly worded confirmation sheet. Sheets rise from the bottom and never cover critical confirmation copy with the keyboard.
- Respect `prefers-reduced-motion`: remove float, breathing, SVG drawing, and stagger; retain instant state changes and short opacity transitions under `150ms`.

## 7. Content & Voice

The voice is calm, plainspoken, and observant. It should sound like the app is making space for the user, not coaching them.

- Prefer: `What will you keep from today?`, `One sentence to keep`, `Seal today`, `Saved on this device`, `Nothing sealed yet`.
- Avoid: motivational copy, guilt, urgency, achievement language, and therapy claims.
- Never call memories `content`, `entries`, `posts`, or `records` in the interface.
- Do not pressure users to maintain a streak. Missing days remain ordinary blank space.
- Keep primary prompts under eight words and helper text under sixteen words.
- Use real, specific sample copy when examples are required, such as `Rain on the balcony after dinner.` Avoid generic personal names and lorem ipsum.

## 8. Accessibility & Product Constraints

- Text and essential icons must meet WCAG AA contrast against their surfaces.
- Every icon-only control has an accessible name.
- Mood options communicate state through glyph, text, border, and selection semantics.
- Photos require editable alt text later; for the MVP, derive a neutral date-based label rather than exposing filenames.
- Never place essential text directly on a photo. If a compact preview requires overlay text, use Photo Scrim and verify contrast.
- Keyboard focus order follows visual order; focus is never trapped outside confirmation sheets.
- The interface remains usable at 200% text zoom.
- Use native date semantics and locale-aware display while storing canonical calendar dates.
- The Today screen must remain functional offline and clearly distinguish local save from cloud sync.

## 9. Anti-Patterns (Banned)

- No emoji anywhere in the product UI, including mood selection.
- No Inter and no generic serif fonts.
- No pure black (`#000000`).
- No purple, blue-neon, or multicolor gradients.
- No outer glow, glassmorphism, or frosted floating navigation pills.
- No excessive rounded cards and no card inside card.
- No three-equal-card feature rows.
- No centered hero composition.
- No text overlapping imagery or controls floating over the main photo.
- No circular loading spinners.
- No floating action button.
- No confetti, points, badges, leaderboards, or guilt-based streak messaging.
- No generic dashboard charts on the core four screens.
- No filler directions such as `Swipe down`, `Scroll to explore`, or bouncing arrows.
- No AI copywriting clichés such as `Elevate`, `Seamless`, `Unleash`, or `Next-gen`.
- No generic placeholder people, lorem ipsum, fake percentages, or broken remote image links.
- No decorative animation of `top`, `left`, `width`, or `height`.

## 10. Stitch Screen Generation Order

Generate screens in this order so the product's visual grammar is established by the core ritual rather than by secondary navigation:

1. **Today — unsealed:** establish date composition, photo well, mood selector, note field, primary Seal action, and bottom navigation.
2. **Today — sealed:** establish photography treatment, quotation typography, seal mark, and completed-state restraint.
3. **Memories:** extend the established photo and metadata grammar into an asymmetric monthly album.
4. **Calendar:** translate the same visual language into a dense but quiet month grid.
5. **Capsule detail:** create the cinematic reading view and wide-screen split behavior.

For every generated screen, use a mobile canvas around `390 × 844` first. Generate a desktop or tablet adaptation only after the mobile composition is accepted. Keep the same palette, typography, photo treatment, navigation, and content voice across every screen.
