# Research UI Spec

## MVP-160c ResearchPt Display

- The top resource row displays `DNA` and `研究Pt`.
- `研究Pt` is the canonical Japanese label. Mojibake strings such as `遐皮ｩｶPt` must not appear in runtime UI.
- Research cards that consume ResearchPt should show the existing ResearchPt icon plus a number. Long fallback text may use `研究Pt` but should not use corrupted or mixed-encoding labels.
- Analysis conversion copy remains `余剰DNAを研究Ptへ変換する`.

See also `docs/ui/dna_research_ui_spec.md` for the broader DNA research layout rules.

## MVP-A01b: Research Card Cost Display

- Research Pt-only unlock cards show `研究Pt 220` instead of `D0/P220`.
- Spinosaurus unlock failure uses `Pt不足` when Research Pt is short.
- Completed dinosaur unlock cards show `研究済み`.
