# ND10 New Dinos Main Merge

## Scope

ND10 integrates the six-new-playable-dino update into `main`.

Added playable dinos:

- ankylosaurus
- parasaurolophus
- stegosaurus
- pteranodon
- compsognathus
- ornithomimus

This release also includes the research-point cleanup, daily-panel removal, home UI banner/background polish, new-dino research unlock flow, codex support, base and evolution assets, gameplay sprites, normal attacks, branch icons, and special/ultimate effects.

## Final QA Summary

- Home:
  - Top-right DNA display removed.
  - News button moved to top-right.
  - Segmented home background and new-six-dino banner displayed.
  - Banner opens Research > Unknown tab.
  - Runtime smoke check: console warn/error 0.
- Research:
  - Research Pt display removed from active UI.
  - Conversion tab removed by empty conversion rates / category filtering.
  - Unknown tab filters to unlockable dino cards only.
  - Spinosaurus plus six new dino unlock cards are present by data check.
  - DNA cost is calculated as DNA only.
  - Research Pt conversion rate: 1 research Pt = 5 DNA.
- Dino Select:
  - New six dinos are locked until research unlock.
  - Locked card uses hero-derived silhouette behavior.
  - Debug QA route confirms all dinos can be exposed without saving.
- PlayScene:
  - Representative runtime smoke checks passed for ankylosaurus and ornithomimus.
  - Representative forced evolution checks passed for ankylosaurus_attack and ornithomimus_zero.
  - `debugForceEvolution={dinoId}_zero` now unlocks the matching ZERO route for that QA session, so direct ZERO visual checks use the dedicated evolution sheet instead of falling back to the base dino.
  - Existing dino configs remained present.
- Evolution:
  - 18 normal branches are defined for the six new dinos.
  - 6 ZERO branches are defined but remain future route gated / debug-only for direct QA.
  - Companion synergy reserved pairs remain `enabled: false`.
- Codex:
  - New dino and evolution definitions are available through data/asset definitions.
  - ZERO evolutions remain hidden until discovered unless debug QA flags are used.
- Save migration:
  - Old researchPt values convert to DNA once.
  - `researchPtConvertedToDna` prevents double conversion.
  - Daily save fields normalize to empty non-crashing state.

## Version

- Previous: 0.10.1
- New: 0.11.0
- Build: new-dinos-six-v1

## Update News

Added latest news entry:

- Title: 新たな恐竜を6体追加しました
- Summary:
  - Added six playable dinos.
  - Unlock them through Research.
  - Added dedicated attacks, evolutions, assets, and codex entries.
  - Integrated research Pt into DNA.
  - Cleaned up Home and Research UI.

## Merge Result

- Source branch: `feature/new-dinos-six-v1`
- Target branch: `main`
- Merge method: `--no-ff`
- Conflict result: no conflicts.

## Checks

- `node --check`: required changed/important JS and full `src` syntax check passed before merge.
- `git diff --check`: passed before merge.
- `npm.cmd run build`: passed before merge with existing Vite chunk size warning only.
- Runtime smoke:
  - Home: console warn/error 0.
  - ankylosaurus PlayScene: console warn/error 0.
  - ornithomimus PlayScene: console warn/error 0.
  - ankylosaurus_attack forced evolution: console warn/error 0.
  - ornithomimus_zero forced evolution: console warn/error 0.

## Push Result

Pending at document creation. Fill in after final main checks and push.

## Remaining Notes

- Physical controller QA is still best handled as a separate manual hardware pass.
- Existing old update-news entries contain legacy mojibake text; the ND10 entry itself is valid Japanese.
- Existing Vite chunk size warning remains unchanged.

## Next Update Candidates

1. Reduce processing load for adaptation skill effects.
2. Implement the fourth ZERO stage.
3. Add a new stage.
4. Add achievement functionality in a future update.
