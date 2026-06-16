# Companion Synergy CS06 Main Merge Report

Date: 2026-06-16
Branch: main
Source branch: feature/companion-synergy-v1

## Summary

Companion Synergy V1 was merged into main as a patch update after CS01-CS05c.
The feature adds data definitions, first-pass play effects, companion UI display,
QA documentation, and the CS05c display cleanup that keeps synergy information
out of the crowded play HUD.

## Merge Result

- origin/main was fetched before merge.
- local main was fast-forward checked against origin/main before merge.
- `feature/companion-synergy-v1` was merged into main with `--no-ff`.
- Conflict count: 0
- Push status: not pushed. Push requires user approval after this report.
- Existing stash `wip-main-push-release-checklist-doc` was not touched.

## Version

- Previous: 0.10.0
- New: 0.10.1
- Build label: companion-synergy-v1

## Update News

Title: 共存シナジーを追加しました

Body:

- 特定の恐竜とお供恐竜を組み合わせることで、共存シナジーが発動するようになりました。
- 第1弾として、ティラノサウルス、ヴェロキラプトル、スピノサウルス、トリケラトプスの組み合わせに対応しました。
- お供選択画面や研究画面で相性と効果を確認できます。

## Integrated Areas

- `src/data/companion_synergy.js` defines the 10 companion synergy pairings.
- Four implemented player dinosaur pairings are enabled.
- Six future pairings remain disabled and use `未発見の恐竜` in normal UI.
- Play effects are active for the enabled four pairings only.
- Home companion selection and research companion list show synergy information.
- Persistent PlayScene synergy HUD was removed in CS05c to avoid boss HP overlap.
- No save schema change was introduced.
- No new assets were introduced.

## Post-Merge QA Results

- Active synergy PlayScene boot:
  - tyrannosaurus x rex_hatchling: pass, runtime console error/warn 0.
  - velociraptor x raptorling: pass, runtime console error/warn 0.
  - spinosaurus x spino_pup: pass, runtime console error/warn 0.
  - triceratops x tricera_calf: pass, runtime console error/warn 0.
- Non-synergy PlayScene boot:
  - tyrannosaurus x spino_pup: pass, runtime console error/warn 0.
  - velociraptor x rex_hatchling: pass, runtime console error/warn 0.
- No companion PlayScene boot: pass, runtime console error/warn 0.
- ZERO short boot: pass, runtime console error/warn 0.
- ENDLESS short boot: pass, runtime console error/warn 0.
- Home companion panel: pass. It shows basic companion info and no misleading `発動中` label.
- Companion selection modal: pass. It shows `共存シナジー`, `効果`, and active/inactive status.
- Research companion screen: pass. It shows compact synergy information and disabled future pairs as `相性: 未発見の恐竜`.
- Disabled future synergy display: pass. No future-update wording or unreleased dino name is exposed in normal UI.

## Checks

- `node --check`: pass for touched runtime/data/UI files.
- `git diff --check`: pass. CRLF warnings only.
- `npm.cmd run build`: pass.
- Existing Vite chunk-size warning remains non-blocking.

## Push Decision

push可.
Push has not been performed. User approval is required.

## Remaining Notes

- Existing Vite chunk-size warning is expected and non-blocking.
- Push is intentionally stopped until user approval.
