# MVP-A12b Management UI Asset Audit

## Scope

- 対象: 研究画面 / 図鑑画面 / 設定画面
- 目的: A12の文言・配置改善に加えて、見づらいパネル・カード・行パーツを共通アセット化する
- 対象外: 戦闘バランス、PWA、リザルト、ボス通知、新規恐竜

## Classification

| Area | Part | Classification | Action |
| --- | --- | --- | --- |
| 共通 | 外枠/汎用カード/選択カード/リソースチップ | 共通化できる | `public/assets/ui/management/*_a12b.png` を生成 |
| 研究 | 上部背景/カテゴリタブ/研究アイコン | 既存のままでOK | 既存アセット継続 |
| 研究 | 研究カード通常/完了/ロック | アセット生成が必要 | A12bカードへ差し替え |
| 研究 | 研究ボタン/状態バッジ | アセット生成が必要 | A12bボタンフレームへ差し替え |
| 図鑑 | 背景/portrait frame/silhouette | 既存のままでOK | 既存アセット継続 |
| 図鑑 | 原種カード/進化カード/ロック/ZEROカード | アセット生成が必要 | A12bカードへ差し替え |
| 図鑑 | 上部恐竜セレクタ | アセット生成が必要 | A12b selector chipへ差し替え |
| 設定 | 背景/メイン外枠/スライダーつまみ | 既存のままでOK | 既存アセット継続 |
| 設定 | セクションパネル/設定行 | アセット生成が必要 | A12b row/sectionへ差し替え |
| 設定 | ON/OFFチップ | アセット生成が必要 | A12b toggle chipをSprite表示へ接続 |

## Adopted Asset Policy

- 外枠中心で、本文領域は暗色で広く取る
- シアン/紫発光は控えめにし、可読性を優先
- 研究/図鑑/設定で同じ管理画面トーンに統一
- 文字は画像に焼き込まず、コード側Textで表示
- Graphics fallbackは非常時のみ維持

## Generated Source

- Source sheet: `docs/assets/a12b_management_ui_source_sheet.png`
- Contact sheet: `docs/assets/a12b_management_ui_contact.png`
