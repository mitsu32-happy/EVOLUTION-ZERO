# ND09e 新恐竜QA用デバッグモード

## 目的

ND10以降の新6体QAで、研究解放や通常レベル上げを毎回通さずに、プレイヤー恐竜・進化先・図鑑表示を短時間で目視確認できるようにする。

このデバッグ導線はURLパラメータ限定で、通常セーブへ解放状態を書き込まない。

## 追加・確認したdebugパラメータ

| parameter | 内容 | 保存影響 |
| --- | --- | --- |
| `debugNewDinoQa=1` | ND10向け統合QAモード。全恐竜QA解放、通常進化高速化、図鑑全解放、ZERO進化図鑑解放をまとめて有効にする。 | なし |
| `debugUnlockAllDinos=1` | 新6体を含む全プレイヤー恐竜をQAセッション中だけ解放扱いにする。既存の選択画面/ホーム/図鑑判定を利用。 | なし |
| `debugFastEvolution=1` | 適応を1つ取得した時点で、通常進化の `speed` / `hunting` / `attack` 候補を検出済みにする。 | なし |
| `debugForceEvolution={tag}` | 既存通り `speed` / `hunting` / `attack` / `zero` を直接適用する。 | なし |
| `debugForceEvolution={branchId}` | `ankylosaurus_speed` などの進化ID指定にも対応。対象恐竜と一致した分岐だけ適用する。 | なし |
| `debugUnlockCodex=1` | 図鑑で新6体と進化分岐を全確認可能にする。 | なし |
| `debugUnlockZeroEvolutions=1` | 図鑑でZERO進化分岐を確認可能にする。通常解放条件は変更しない。 | なし |

## URL例

統合QAモードを起動:

```text
http://localhost:5179/EVOLUTION-ZERO/?debugIntroSeen=1&debugNewDinoQa=1
```

全恐竜を解放扱いにして選択画面を確認:

```text
http://localhost:5179/EVOLUTION-ZERO/?debugIntroSeen=1&debugUnlockAllDinos=1
```

新恐竜の通常進化候補を短時間で確認:

```text
http://localhost:5179/EVOLUTION-ZERO/?debugIntroSeen=1&debugAutoPlay=1&debugUnlockAllDinos=1&debugFastEvolution=1&debugDino=ankylosaurus
```

進化IDで直接PlayScene確認:

```text
http://localhost:5179/EVOLUTION-ZERO/?debugIntroSeen=1&debugNewDinoQa=1&debugAutoPlay=1&debugInvincible=1&debugDino=ankylosaurus&debugForceEvolution=ankylosaurus_speed
```

ZERO進化を直接確認:

```text
http://localhost:5179/EVOLUTION-ZERO/?debugIntroSeen=1&debugNewDinoQa=1&debugAutoPlay=1&debugInvincible=1&debugDino=ornithomimus&debugForceEvolution=ornithomimus_zero
```

図鑑を全確認:

```text
http://localhost:5179/EVOLUTION-ZERO/?debugIntroSeen=1&debugNewDinoQa=1
```

## 実装メモ

- `debugNewDinoQa=1` は `debugUnlockAllDinos=1` / `debugFastEvolution=1` / `debugUnlockCodex=1` / `debugUnlockZeroEvolutions=1` 相当のQA表示・進化候補補助をまとめて有効にする。
- `debugFastEvolution` は `GameState.acquireSkill()` 内で適応スキル取得時だけ作用する。
- 通常進化候補の検出補助に限定し、ZERO進化の通常解放条件は変更しない。
- `debugForceEvolution` は従来のタグ指定に加え、`getEvolutionBranchById()` で分岐IDを解決する。
- 図鑑の `debugUnlockCodex` / `debugUnlockZeroEvolutions` は表示判定のみで、`SaveManager` には書き込まない。

## ND10での利用方法

1. `debugNewDinoQa=1` で新6体の選択画面と図鑑表示を確認する。
2. `debugNewDinoQa=1&debugForceEvolution={dinoId}_{speed|hunting|attack|zero}` で24分岐のPlayScene表示を個別確認する。
3. `debugNewDinoQa=1` で図鑑のbase/進化/ZERO表示を一括確認する。
4. `debugNewDinoQa=1` で通常カード取得導線から進化候補UIを確認する。

## QA結果

- `debugNewDinoQa=1`: 統合QAモードとして、個別QAフラグ相当の判定を追加。
- `debugUnlockAllDinos=1`: dino select / home / codex の既存QA解放判定を確認。
- `debugFastEvolution=1`: 適応取得後に通常3分岐候補を検出するコードパスを追加。
- `debugForceEvolution=ankylosaurus_speed`: 分岐ID指定をタグへ解決するコードパスを追加。
- `debugUnlockCodex=1`: 図鑑の恐竜/進化分岐表示を全解放扱いにする表示専用判定を追加。
- `debugUnlockZeroEvolutions=1`: ZERO進化分岐を図鑑で確認可能にする表示専用判定を追加。

## 残課題

- ND10では、実ブラウザで24分岐の `debugForceEvolution={branchId}` を一巡し、sprite / effect / ultimate の目視QAを実施する。
