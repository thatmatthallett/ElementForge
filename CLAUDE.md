# ElementForge

A Lit 3 + TypeScript web-component design system, built with Vite, documented in Storybook 10,
and tested with Vitest 4 in browser mode (Playwright). All components are custom elements with the
`ef-` prefix.

## Commands

- `npm run dev` — Vite dev server (entry: `index.html`)
- `npm run build` — `tsc` type-check then `vite build`
- `npm run storybook` — Storybook on port 6006
- `npm run build-storybook` — static Storybook build

There is no standalone `test` script; Vitest runs via the Storybook addon (portable stories) or the
Vitest CLI directly. Browser mode uses headless Chromium via `@vitest/browser-playwright`.

## Architecture — the layering

The system is a deliberate 5-layer stack. Build new work by composing these layers, not by
reaching around them.

### 1. Foundation — `src/lib/ef-element.ts`
`EfElement extends LitElement` is the base class every component inherits. It provides:
- Auto-generated `efId`, plus reactive `theme` (`light`/`dark`/`forge`/`dim`/`high-contrast`),
  `status`, and `statusMessage`.
- `emit()` — type-safe custom-event dispatch that auto-injects `efId` into every event detail.
- `listen()` — event registration that is **auto-cleaned up** on `disconnectedCallback`. Prefer it
  over raw `addEventListener`.
- `schedule()` (microtask coalescing) and `warnOnce()` (deduped dev warnings).
- Adopted-stylesheet management (a shared `CSSStyleSheet` cached across instances).
- `this.ally.*` — the bridge to the accessibility library (see layer 4).

### 2. Composition — mixins + controllers
Capabilities are layered onto `EfElement` via mixins, e.g.
`class Base extends OverlayControls(AnchorPositioning(EfElement)) {}`.
- `src/mixins/anchor-positioning.ts` — CSS Anchor Positioning (anchor-name / position-area) for
  elements that float relative to a target.
- `src/mixins/overlay-controls.ts` — `open` state + click/hover/focus triggers; reacts to global
  `ef-show` / `ef-hide` events.
- `src/lib/overlay/overlay-controller.ts` — the overlay state machine: mount/unmount, animations,
  focus-trap, dismiss handling, z-index, focus restore. Instantiated by overlay components.
- `src/lib/events.ts` — a single `eventDefinitions` map is the source of truth for all custom
  events. `ComponentEvents` / `EventOf<K>` derive fully-typed events from it; every event carries
  `efId`. Add new events here first.

`ef-tooltip` is the reference component that exercises the full overlay/anchor/controller stack.

### 3. Tokens & styles — `src/tokens/`, `src/styles/`
- TS token modules (`colorSet`, `colorTokens`, `shapeTokens`, `statusTokens`, `strokeWidthTokens`)
  map to `--ef-*` CSS custom properties.
- `src/styles/tokens.css` defines the root custom properties in **OKLch**, with theme variants
  (light / forge / dim / high-contrast) and `prefers-color-scheme` support.
- Cascade uses `@layer theme < base`. Fonts: Inter (UI), Satoshi (display), JetBrains Mono (code).
- Token flow: root `--ef-color-primary` → component-scoped prop (e.g. `--ef-btn-bg`) → final
  `var()` in the component CSS. Components set their scoped props on `:host`.

### 4. Accessibility — `src/lib/ally/`
A hybrid library, surfaced on components as `this.ally.*`:
- Dev-time assertions (gated on `import.meta.env.DEV`): `assertLabel`, `assertRole`,
  `assertFocusable`, `assertSingleTabStop`, `assertAriaControls`, `assertAriaExpanded`,
  `assertAltText`, `assertRequiredProps`. Call them in `connectedCallback`.
- Runtime helpers: `trapFocus`, `restoreFocus`, `ensureTabbable`, `warnIfInteractiveWithoutRole`.

### 5. Components — `src/components/`
Auto-registered via `import.meta.glob('./ef-*/ef-*.ts', { eager: true })` in
`src/components/index.ts` — a new `src/components/ef-foo/ef-foo.ts` using `@customElement` is picked
up automatically. Each component folder holds `.ts`, `.css`, and usually `.stories.ts`.

Current components: `ef-button` (form-associated; loading, toggle, icon slots), `ef-badge`
(`count`, anchored), `ef-alert` + `ef-alert-container` (imperative `pushAlert()` queue, global
`ef-alert` listener, live region), `ef-status`, `ef-icon` (Tabler registry), `ef-tooltip`.
`my-element` is leftover scaffold.

## Generated code — do not hand-edit

`scripts/` holds codegen that must be re-run rather than edited by hand:
- `generate-icons.js` — reads Tabler outline/filled icons + `src/assets/logos/`, emits
  `src/assets/icons/icons.ts` (SVG registry) and `icon-types.ts` (the `IconName` union).
- `generate-component-types.js` — scans component `@property` decorators and emits
  `src/types/ef-jsx.d.ts`, `src/types/ef-dom.d.ts`, and `src/types/ef-html.json` (IDE autocomplete).

So `src/types/ef-*.d.ts` / `ef-html.json` and `src/assets/icons/*` are build artifacts — change the
source components/scripts and regenerate, don't patch the output.

## Conventions

- Custom elements and CSS custom properties are prefixed `ef-` / `--ef-`.
- Dispatch events with `emit()` and register listeners with `listen()` (auto-cleanup) — not raw DOM
  APIs — so new events stay typed and leak-free.
- Validate token-ish inputs with the type guards in `src/utils/valueValidation.ts` and fall back
  with `warnOnce()` rather than throwing.
- Reflect public attributes; set dynamic theming via scoped CSS custom properties on `:host`.
