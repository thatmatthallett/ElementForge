# Workflow B: New `ef-popover`

**Branch** `feat/popover` · **Worktree** `../ElementForge-wt/popover` · **Storybook** port 6008

Shared rules and ordering: [README.md](README.md).

## What a popover is (compared with `ef-tooltip`)

| | `ef-tooltip` | `ef-popover` |
|---|---|---|
| Content | Plain text hint | Any content, including interactive (buttons, inputs, links) |
| Opens on | Hover or focus | Click, or Enter/Space on the trigger |
| Closes on | Leaving the anchor, losing focus, Escape | Escape, outside click, clicking the trigger again, programmatic |
| Focus | Stays on the anchor | Can move into the panel; goes back to the trigger on close |
| Accessibility | `role="tooltip"` + `aria-describedby` | Trigger has `aria-expanded` + `aria-controls`; panel is usually `role="dialog"` |

The popover uses the overlay features the tooltip leaves unused: the `click` trigger,
`dismissible`, `restoreFocus`, and `setupDismissListeners`. It's also the base for later
components (menu, dialog, select).

## Owned files

- `src/components/ef-popover/` (component, CSS, stories, tests)
- New entries in `src/lib/events.ts` `eventDefinitions`, if the popover needs new events (add only; don't edit existing ones)

**Not owned:** the overlay layer (`src/mixins/overlay-controls.ts`,
`src/mixins/anchor-positioning.ts`, `src/lib/overlay/`). Workflow A is fixing it. If the popover
needs something there, **stop and report the need.**

## Checkpoints

### B1: API proposal (doc only)
Write `src/components/ef-popover/API.md` covering:
- Properties, using the existing `color`/`shape`/`variant` and anchor properties where they fit.
- Events (e.g. open/close), named to match `src/lib/events.ts` conventions.
- Slots (default content; any header/footer?).
- Accessibility: the role of the panel, `aria-expanded`/`aria-controls` on the trigger,
  focus behavior on open (first focusable element, or the panel?) and on close.
- Which `OverlayControls`/`AnchorPositioning`/`OverlayController` features it relies on, and
  which problems listed in [tooltip.md](tooltip.md) affect it.

**Stop and report:** the API proposal, for the user to approve. Don't write component code yet.

### B2: Build the component
- `ef-popover.ts` + `ef-popover.css`, structured like `ef-tooltip` (`EfElement` +
  `OverlayControls(AnchorPositioning(...))`, `stylesText` via `mergeCss` with the shared anchor CSS).
- Tokens for color/shape/variant the same way as `ef-tooltip` (`--ef-popover-*` custom properties).
- Basic opening and closing on click. Don't work around overlay-layer bugs; write them down for B3.
- Add new event types to `eventDefinitions` if needed.

**Stop and report:** renders and opens; list of overlay-layer problems hit.

### (wait) Rebase after A2
Wait until the coordinator confirms that A2 has been merged to `master`, then
`git rebase master` and rerun the tests.

### B3: Behavior and accessibility
- Clicking the trigger toggles the popover; Enter/Space on the trigger toggles it.
- Escape and outside click close it (using A2's default `setupDismissListeners`).
- Focus moves into the panel on open (per the B1 decision) and back to the trigger on close.
- `aria-expanded` and `aria-controls` stay in sync on the trigger.
- Tests for each.

**Stop and report:** behavior, accessibility, and tests.

### B4: Story
- `ef-popover.stories.ts` following the `ef-alert.stories.ts` pattern, including an example
  with interactive content (e.g. a small form).
- Check it in Storybook on port 6008.

**Stop and report:** ready for review in Storybook.
