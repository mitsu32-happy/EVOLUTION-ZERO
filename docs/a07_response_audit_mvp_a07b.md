# MVP-A07 Response Audit / A07b Intake

Date: 2026-05-31

## Classification

| Area | A07 state | A07b action |
| --- | --- | --- |
| Home UI | Partially done | Add full News menu and keep A07 readability/copy changes. |
| Stage select | Done | Keep readable difficulty copy and no recommended dino display. |
| Dino select | Partially done | Verify Spinosaurus locked/unlocked consistency and remove card artifact/crop bleed. |
| Loading UI | Done | Keep `ロード中` main title. |
| Level-up UI | Partially done | Keep fallback reward cards; replace fallback card frame with dedicated generated raster asset. |
| Evolution candidate UI | Simplified | Add dedicated generated card frame and clearer portrait layout. |
| Result UI | Partially done | Remove upper BEST/skill sections and reorganize result/reward rows to avoid clipping. |
| Codex | Partially done | Keep locked dino silhouette/detail limit and recheck Spinosaurus state. |
| Level-up shortage | Done | Keep DNA/HP/score fallback selection path. |
| Balance | Done | Add A07b velociraptor attack-frequency tuning. |
| Spinosaurus unlock cost | Done | Keep ResearchPt 220. |
| Boss/ZERO notices | Simplified/legacy | Add dedicated generated raster panels and connect them in runtime. |

## A07b Scope

- Full News menu: Home entry, list, detail, close/back, data-driven entries.
- Result cleanup: one-screen layout unless reward content forces future staging.
- Dedicated raster UI assets for News, boss/ZERO notices, evolution candidate card, fallback reward card.
- Spinosaurus card crop/mask and locked-state consistency checks.
- Velociraptor base attack cadence improvement.

## Out Of Scope

- New dinos, new stages, ruins ZERO production implementation, PWA overhaul, service-worker/cache changes, and save schema migrations.
