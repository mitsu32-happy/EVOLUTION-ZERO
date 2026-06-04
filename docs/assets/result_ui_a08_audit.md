# MVP-A08 Result UI Audit

## Current Issues

- Result information was packed into one surface, so outcome stats, rewards, best records, and action buttons competed for attention on narrow mobile screens.
- The upper BEST-style messaging duplicated best score / best survival time that already appeared in the main result panel.
- Acquired adaptation skill display was no longer useful at result timing and made the screen denser than needed.
- Reward rows could become difficult to read when first-clear, title, frame, and ZERO route rewards appeared together.
- ZERO CLEAR needed a stronger but still readable reward surface so route/frame rewards would not be buried.

## A08 Direction

- Split result into two explicit pages: summary first, reward second.
- Summary page shows only outcome, survival time, kills, score, best score, and best survival time.
- `NEW!` is attached only to the updated best score or best survival time value.
- Reward page shows DNA, first-clear rewards, title/frame rewards, and new evolution route rewards.
- Retry and Home actions appear only on the reward page, preventing accidental exit from the first result tap.

## Asset Pass

- Generated a dedicated text-free A08 result UI sheet and cropped runtime PNGs for summary panel, reward panel, reward row, headers, and action buttons.
- Text remains code-rendered for localization and long reward names.
- Graphics fallback remains only for missing texture recovery.

## QA Scope

- CLEAR: summary -> reward transition, retry/home buttons, reward row fit.
- GAME OVER: gameover header and no-reward messaging.
- ENDLESS RESULT: endless header and reward flow.
- ZERO CLEAR: ZERO header and Japanese route/title/frame reward rows.
- Mobile/PWA: 390px-class width, safe bottom button spacing, no reward text clipping.
