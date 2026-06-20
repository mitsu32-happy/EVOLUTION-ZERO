# ND10前 研究Pt / デイリー整理

## 目的

新6体追加ブランチのND10 QA前に、研究Ptとデイリー導線を廃止し、研究/解放/孵化コストをDNAへ一本化する。

## 研究Pt廃止方針

- 研究Ptは通常UIから表示しない。
- 研究カテゴリ、研究カード、孵化画面、ホームリソース、ロードTips、チュートリアル文言はDNA表記へ統一した。
- 解析変換タブは研究カテゴリ一覧から削除した。
- `researchPt` フィールドは旧セーブ互換と移行判定のため残すが、正規化後は `0` にする。

## DNA換算レート

- 換算レート: 研究Pt 1 = DNA 5
- 根拠: 既存の解放コストに対して極端な値上げ/値下げにならない範囲で、研究PtをDNAコストへ足し込むため。
- 例:
  - スピノサウルス: 研究Pt 220 -> DNA 1100
  - アンキロサウルス: DNA 1400 + 研究Pt 260 -> DNA 2700
  - ステゴサウルス: DNA 1400 + 研究Pt 270 -> DNA 2750

## 所持研究Ptの移行仕様

- 旧セーブに `researchPt` があり、`researchPtConvertedToDna` が未設定の場合のみ、`researchPt * 5` を `ownedDna` に加算する。
- 変換後は `researchPtConvertedToDna: true` と `researchPt: 0` を保存する。
- 旧セーブ読み込み時に移行が発生した場合は即保存し、再起動後の二重加算を防ぐ。
- `researchPt` が未保存の旧セーブでは、過去の `totalExpGained` から研究Ptを推定しない。意図しないDNA増加を避けるため。

## 研究画面

- 変換タブを削除。
- 未知タブは実際に解放できる恐竜解析カードのみ表示。
- 適応タブは実装済み適応技カードのみ表示。
- 将来解放予定 / placeholder 的なカードは通常表示しない。
- お供孵化は旧 `DNA 90 + 研究Pt 12` を `DNA 150` に統合した。

## デイリー廃止

- ホームのデイリー / 記録 / 解放パネルは非表示。
- デイリー進行更新、受取、デバッグ達成は互換APIだけ残し、実処理は行わない。
- `dailyMissions` / `dailyMissionClaims` は旧セーブ互換のため読み込めるが、正規化後は空構造にする。
- デイリー跡地には代替パネルを置かず、将来イベント表示領域として空ける。

## BRANCHアイコン透過

- 新6体の進化portrait 24点を確認したところ、四隅に半透明背景が残っていた。
- 24点を透過PNGとして修正し、BRANCH / 進化演出 / HUD / リザルトで背景色が浮かないようにした。
- 透過QA: `docs/assets/nd10pre_branch_icon_transparency_contact.png`
- 透過レポート: `docs/assets/nd10_pre_asset_report.json`

## Sprint Impact確認

- `ornithomimus_sprint_kick`、ornithomimus系branch effect、ultimate effect、base/evolution sprite sheetを確認。
- 外周edge issue / cell contaminationは検出なし。
- 目視contact: `docs/assets/nd10_pre_sprint_impact_contact.png`

## アチーブメント将来計画

- デイリー/記録/解放パネル廃止後の長期目標として、将来アップデートでアチーブメント機能を検討する。
- UI案: 下部メニューに「アチーブメント」を追加。
- 報酬候補: 称号、フレーム、DNA、キャラ解放、コスメ/進行報酬。
- 今回は実装しない。通常UIにも表示しない。

## QA結果

- 旧研究Pt 7 -> DNA +35 へ移行、再起動相当で二重加算なし。
- 未知タブ: スピノサウルス + 新6体の研究解放カードのみ。
- 適応タブ: 実装済み3カードのみ。
- 新6体研究購入: 6/6 成功、`unlockedDinos` 反映確認。
- BRANCH icon/portrait透過: post-fix edge issue 0。
- Sprint Impact候補: edge issue 0。

## 残課題

- 画面目視QAはND10最終QAで継続する。
- お知らせ/Version更新はmain統合時に実施する。今回はfeatureブランチ作業のため更新しない。
