# Workflow A: Overlay fixes + finish `ef-tooltip`

**Branch** `feat/tooltip` · **Worktree** `../ElementForge-wt/tooltip` · **Storybook** port 6007

Shared rules and ordering: [README.md](README.md).

## Owned files

- `src/mixins/overlay-controls.ts`
- `src/mixins/anchor-positioning.ts`
- `src/lib/overlay/`
- `src/shared/anchor-position.css`
- `src/components/ef-tooltip/`
- Test setup and test files (`vitest.config.ts`, `vitest.shims.d.ts`, `*.test.ts`)

## Background: known problems in the overlay layer

Found while reading the code. Each one should be confirmed with a test before it's fixed.

1. **The controller never gets its anchor.** `ef-tooltip` builds `new OverlayController({ anchor: this.anchor, ... })`
   as a class field initializer, when `this.anchor` is still `null`. Nothing calls
   `controller.update({ anchor })` later, so `restoreFocus` falls back to the overlay itself.
2. **A pending close isn't cancelled.** `OverlayControls.closeOverlay()` schedules
   `setTimeout(..., this.delay)`, but `openOverlay()` never clears `_closeTimeout`. Leaving
   the anchor and re-entering within `delay` still closes the overlay.
3. **`delay` is only a close delay.** The tooltip sets `delay = 500` but opens instantly. Separate
   the open and close delays (e.g. `openDelay` / `closeDelay`, or a clearly documented `delay`).
4. **Listeners pile up.** `_setupListeners()` runs on every `anchor` change and adds listeners
   without removing the previous anchor's. It also doesn't re-run when `trigger` changes. The
   global `ef-show`/`ef-hide` window listeners get added again each time too.
5. **Nothing implements dismissing.** `OverlayController` expects an injected
   `setupDismissListeners`, but there's no default implementation, so `dismissible: true`
   does nothing.
6. **Leftover badge names.** `AnchorPositioning.updateAnchor()` removes
   `--ef-badge-anchor-offset-block/inline` instead of `--ef-anchor-offset-block/inline`.
7. **Tooltip accessibility is missing.** There's no `role="tooltip"`, and the anchor doesn't
   point to the tooltip with `aria-describedby`. Escape doesn't close it, and hovering onto the
   tooltip itself doesn't keep it open (WCAG 1.4.13).
8. **No tests exist.** A Vitest browser-mode (Playwright) config exists, but nobody has
   confirmed it runs.

## Checkpoints

### A1: Test harness
- Get `vitest` browser mode running (`npx vitest run`, or add an npm `test` script).
- Add one smoke test: `ef-tooltip` registers and renders its slot content.
- Add one failing test that reproduces problem 2 (close timer race). This proves the harness
  can test overlay timing.
- Leave `src/components/my-element/` alone for now (whether to delete it is undecided).

**Stop and report:** does the harness work, what did setup take, and any config changes made.

### A2: Overlay fixes (**gates workflow B**)
- Fix problems 1 to 6 above, each with a test.
- Keep the fixes generic so `ef-popover` can rely on them. In particular, the default
  `setupDismissListeners` must support Escape and outside click (anchor clicks don't count as
  outside clicks).
- Don't change the public behavior of `ef-badge` or other anchor users beyond the bug fixes.

**Stop and report:** list of fixes, test results, any API changes (new or renamed properties).
The coordinator merges this to `master` after review.

### A3: Tooltip accessibility
- `role="tooltip"` on the tooltip, with a stable id.
- `aria-describedby` on the anchor pointing at the tooltip. Clean it up when the anchor changes
  or the tooltip disconnects.
- Escape closes the tooltip, and focus stays on the anchor.
- The tooltip stays open while the pointer is over the tooltip itself (WCAG 1.4.13).
- Tests for each.

**Stop and report:** accessibility behavior and tests.

### A4: Story
- `ef-tooltip.stories.ts` following the `ef-alert.stories.ts` pattern.
- Controls: `color`, `shape`, `variant`, position (`anchorPositionArea` and block/inline), `trigger`, delays.
- Check it in Storybook on port 6007.

**Stop and report:** ready for review in Storybook.

### A5: Arrow/caret decision (proposal only)
- Read commits `ff0df17` (caret started) and `8c13dbf` (abandoned) and work out why the caret
  was dropped.
- Propose an approach that works with CSS anchor positioning and `position-area` flips, or
  recommend leaving the arrow out.
- **Don't write code.** A short written proposal only.

**Stop and report:** the proposal, for the user to decide.
