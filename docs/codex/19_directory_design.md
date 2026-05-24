# Directory Design v0.1

## Root
```text
EVOLUTION-ZERO/
├ docs/
├ references/
├ assets/
├ src/
├ public/
├ tools/
└ README.md
```

## docs
正式仕様。

```text
docs/
├ systems/
├ ui/
├ art/
├ audio/
├ roadmap/
└ codex/
```

## references
実装参考画像。ゲームには直接使わない。

```text
references/
├ hud/
├ ui/
├ effects/
├ dinos/
├ stages/
└ logos/
```

## assets
ゲーム実装用素材。

```text
assets/
├ dinos/
├ enemies/
├ bosses/
├ ui/
├ effects/
├ maps/
├ audio/
├ icons/
└ fonts/
```

## src
コード本体。

```text
src/
├ core/
├ scenes/
├ entities/
├ systems/
├ ui/
├ audio/
├ data/
├ save/
├ effects/
└ utils/
```

## tools
制作補助。

```text
tools/
├ sprite_tools/
├ image_crop/
├ json_builder/
└ audio_convert/
```

## Data
ロジックとデータは分ける。

```text
src/data/
├ dinosaurs.json
├ skills.json
├ evolutions.json
├ enemies.json
└ bosses.json
```

## Naming
小文字 + snake_case。
