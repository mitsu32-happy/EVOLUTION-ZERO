# MVP-159 Font Credits

確認日: 2026-05-24

## 採用フォント

| 用途 | フォント | 配布元 | ローカル配置 | ライセンス | 商用利用 | クレジット |
| --- | --- | --- | --- | --- | --- | --- |
| 日本語UI本文/見出し | Zen Kaku Gothic New | Fontsource / Google Fonts | `public/assets/fonts/` / `src/assets/fonts/` | SIL Open Font License 1.1 | 可 | 必須ではないが本ファイルに出典記録 |
| 英数字/HUD/SF表示 | Oxanium | Fontsource / Google Fonts | `public/assets/fonts/` / `src/assets/fonts/` | SIL Open Font License 1.1 | 可 | 必須ではないが本ファイルに出典記録 |

## 出典

- Zen Kaku Gothic New
  - Fontsource: https://fontsource.org/fonts/zen-kaku-gothic-new
  - Google Fonts: https://fonts.google.com/specimen/Zen+Kaku+Gothic+New
  - npm/CDN package: `@fontsource/zen-kaku-gothic-new@5.2.7`
- Oxanium
  - Fontsource: https://fontsource.org/fonts/oxanium
  - Google Fonts: https://fonts.google.com/specimen/Oxanium
  - npm/CDN package: `@fontsource/oxanium@5.2.8`
- SIL Open Font License 1.1
  - https://openfontlicense.org/open-font-license-official-text/

## 運用ルール

- 外部CDNから直接読み込まず、同梱ファイルだけを参照する。`public/assets/fonts/` は配布物として保持し、CSSはViteのビルド解決用に `src/assets/fonts/` の同一ファイルを参照する。
- CSSの `@font-face` は `font-display: swap` を使い、フォント読み込み失敗時は `Noto Sans JP` / `sans-serif` へフォールバックする。
- PixiJS の `TextStyle.fontFamily` も `Zen Kaku Gothic New, Oxanium, Noto Sans JP, sans-serif` に統一する。
- HUDなど英数字が主体の箇所でも、日本語混在時の欠けを避けるため同じフォントスタックを使う。
- フォントファイル単体の再販売や、ライセンス/著作権表示を削除した再配布は行わない。
