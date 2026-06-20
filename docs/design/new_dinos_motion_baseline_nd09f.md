# ND09f 新恐竜進化先Spriteモーション基準修正：アンキロサウルス先行対応

## 対象

- `ankylosaurus` base
- `ankylosaurus_speed`
- `ankylosaurus_hunting`
- `ankylosaurus_attack`
- `ankylosaurus_zero`

## 問題原因

ユーザー実機確認で、アンキロサウルスbaseが跳ねて見えること、進化先が小さく浮いて見えること、進化先のmove/actionが弱いことを確認した。

調査結果:

- Player runtime anchor は `ENTITY_VISUAL_RULES.player.anchor.y = 0.62`。
- base sheet は下端こそ揃っていたが、move/action内に分離片があり、目視では跳ねや混入に見えやすかった。
- 進化先sheetは `512x512` cell の中央付近に本体が配置されており、anchor基準では足元が高すぎて浮いて見えた。
- 進化先sheetのmanifest animation名が `move` / `action` / `special` で、Playerが参照する `run` / `attack` / `death` と一致していなかった。
- 進化先sheetには `displayWidth` / `displayHeight` がなく、Player defaultの `116x92` で表示されて小さく見えていた。

## baseline修正内容

`tools/nd09f_fix_ankylosaurus_motion.py` を作成し、対象5sheetを固定baselineで再レイアウトした。

- base: `384x384` cell、foot line `330`
- evolution: `512x512` cell、foot line `440`
- idle / move / action / death fallback の全フレームで下端をfoot lineへ統一
- idle / move / death fallback 行は最大コンポーネントのみ残し、分離片を除去
- action行は尾ハンマー軌跡や粒子を許容しつつ、セル端に触れない範囲で再配置

after report:

| asset | row bottom range | min margin | edge issue |
| --- | ---: | ---: | ---: |
| `ankylosaurus_base` | 0 px | 39 px | 0 |
| `ankylosaurus_speed` | 0 px | 60 px | 0 |
| `ankylosaurus_hunting` | 0 px | 55 px | 0 |
| `ankylosaurus_attack` | 0 px | 49 px | 0 |
| `ankylosaurus_zero` | 0 px | 47 px | 0 |

## 表示サイズ調整

進化先はmanifest側でアンキロサウルス系だけ表示サイズを明示した。

| branch | display size |
| --- | --- |
| `ankylosaurus_speed` | `178x134` |
| `ankylosaurus_hunting` | `180x136` |
| `ankylosaurus_attack` | `188x142` |
| `ankylosaurus_zero` | `190x144` |

base `ankylosaurus` は既存の `160x122` を維持した。

## move/action再生成内容

今回のアンキロ基準対応では、ND09dで生成済みのモーション単位フレームを元に、baseline-safe cellへ再配置した。

- move行: 接地点固定、左右脚差が見えるフレームを維持
- action行: 尾ハンマーの構え、振り、打撃、戻りが読めるフレームを維持
- attack / zero: 尾ハンマーやZERO発光の大きなaction差分を維持

加えてmanifestのanimation名をPlayer runtimeに合わせた。

- `move` -> `run`
- `action` -> `attack`
- `special` -> `death`

これにより、PlaySceneで移動時にrow 1、攻撃時にrow 2が使われる。

## before/after成果物

- `docs/assets/nd09f_ankylosaurus_motion_contact.png`
- `docs/assets/nd09f_ankylosaurus_before_after_contact.png`
- `docs/assets/nd09f_ankylosaurus_motion_report.json`

## 他5体へ横展開する場合の基準

1. Runtime anchorを先に確認する。
2. Subjectをcell中央に置かず、足元/接地点をanchorに合う下寄りfoot lineへ固定する。
3. `rowBottomRange` は各行0pxを目標にする。
4. `minMargin` は最低24px、できれば40px以上を目標にする。
5. manifest animation名はPlayer runtimeの `idle` / `run` / `attack` / `death` に合わせる。
6. `512x512` sheetは `displayWidth` / `displayHeight` を必ず明示し、default `116x92` に落ちないようにする。
7. idle / run / deathには分離片を残さない。actionのみ攻撃軌跡や粒子を許容する。

## QA結果

- 5sheetのedge issue: 0
- 5sheetのrow bottom range: 0
- 5sheetのcell contamination: 目視contact上で隣接セル混入なし
- `ankylosaurus_speed` / `hunting` / `attack` / `zero`: 表示サイズをbaseよりやや大きい自然な進化先サイズへ調整
- `run` / `attack` animation名をruntime参照名に修正

## 残課題

- 他5体にも同じfoot line / display size / runtime animation名基準を横展開するか、ND10以降の目視QAで判断する。
