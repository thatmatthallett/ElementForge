# Parallel workflows

Two agents work in parallel, each in its own git worktree, run as Herdr (`hc`) terminals.
A coordinator session in the main checkout (`master`) watches them, brings each checkpoint to
the user for review, and does all merges.

| Workflow | Plan | Branch | Worktree | Storybook port |
|---|---|---|---|---|
| A: Overlay fixes + finish `ef-tooltip` | [tooltip.md](tooltip.md) | `feat/tooltip` | `../ElementForge-wt/tooltip` | 6007 |
| B: New `ef-popover` | [popover.md](popover.md) | `feat/popover` | `../ElementForge-wt/popover` | 6008 |

Run Storybook on your assigned port: `npm run storybook -- -p <port>`.

## Ordering

Both workflows sit on the shared overlay layer (`src/mixins/overlay-controls.ts`,
`src/mixins/anchor-positioning.ts`, `src/lib/overlay/`). **Workflow A owns that layer.**
Workflow B builds only inside `src/components/ef-popover/` until A's checkpoint **A2** has been
merged to `master`. B then rebases onto `master` before starting **B3**.

```
A1 ─ A2 ─┬─ A3 ─ A4 ─ A5
         │ (merge to master)
B1 ─ B2 ─┴─ (rebase) ─ B3 ─ B4
```

## Rules for every agent

1. Work only inside your own worktree. Never touch the main checkout or the other worktree.
2. Edit only the files your plan says you own. If you need a change somewhere else, **stop and
   report the need** instead of making it.
3. Don't commit generated files: `src/types/ef-*.d.ts`, `ef-html.json`, `src/assets/icons/*`.
   The coordinator regenerates them on `master` after each merge.
4. Follow the architecture in `CLAUDE.md`: compose the layers, use `emit()`/`listen()`, add new
   event types to `src/lib/events.ts` `eventDefinitions` first.
5. Run the tests before reporting back from a checkpoint.
6. **Stop at every checkpoint** and wait for review. Commit your checkpoint work to your branch,
   but don't merge, push, or rebase unless told to.
7. When you stop, give a short report: what changed (files), test results, open questions.
