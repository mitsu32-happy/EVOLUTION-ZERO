# EVOLUTION ZERO 音声素材リスト

この一覧は音声素材を後から安全に差し替えるための受け皿です。素材を実際に入れる前に、各ファイルごとのライセンス、クレジット要否、商用利用可否を必ず確認してください。

## 配置ルール

- UI操作音: `assets/audio/ui/`
- 通常SE: `assets/audio/se/`
- 進化SE: `assets/audio/evolution/`
- 必殺SE: `assets/audio/ultimate/`
- ボスSE: `assets/audio/boss/`
- BGM: `assets/audio/bgm/`

## 必要SE

| ファイル | 用途 | 推奨雰囲気 | 候補素材サイト | ライセンス確認 | 備考 |
| --- | --- | --- | --- | --- | --- |
| `assets/audio/ui/ui_select.wav` | UI選択/タップ | 短い生体端末音、軽いクリック | Kenney Audio Assets / Pixabay Sound Effects | 未確認 | AudioManagerの`ui_click` |
| `assets/audio/ui/ui_cancel.wav` | 戻る/キャンセル | 低めで短いキャンセル音 | Kenney Audio Assets | 未確認 | 将来用 |
| `assets/audio/ui/ui_confirm.wav` | 決定 | 少し明るい確定音 | Kenney Audio Assets / Pixabay Sound Effects | 未確認 | 将来用 |
| `assets/audio/se/attack_slash.wav` | 通常攻撃 | 爪・斬撃、軽め | OpenGameArt CC0 Sound Effects / Pixabay Sound Effects | 未確認 | 鳴りすぎ注意 |
| `assets/audio/se/enemy_hit.wav` | 敵ヒット | 乾いた肉質ヒット | OpenGameArt CC0 Sound Effects | 未確認 | 小さめ音量推奨 |
| `assets/audio/se/enemy_defeat.wav` | 敵撃破 | 短い崩壊音、軽い達成感 | OpenGameArt CC0 Sound Effects / Pixabay Sound Effects | 未確認 | 敵数が多いため短め |
| `assets/audio/se/player_damage.wav` | プレイヤー被弾 | 危険感のある短い衝撃 | Pixabay Sound Effects | 未確認 | 連続再生を抑制 |
| `assets/audio/se/pickup_exp.wav` | EXP結晶取得 | 透明感のある吸収音 | Kenney Audio Assets / Pixabay Sound Effects | 未確認 | 高音を強くしすぎない |
| `assets/audio/evolution/evolution_warning.wav` | 進化候補/異常反応 | 警告、DNAスキャン、短い不穏音 | Pixabay Sound Effects | 未確認 | 赤警告演出と同期 |
| `assets/audio/evolution/evolution_burst.wav` | 進化決定/変異 | 生体発光、膨張、解放感 | OpenGameArt CC0 Sound Effects / Pixabay Sound Effects | 未確認 | 2〜4秒以内が理想 |
| `assets/audio/ultimate/ultimate_speed.wav` | 迅雷連斬 | 高速、青い電撃感、連続斬り | Pixabay Sound Effects | 未確認 | 短く鋭い |
| `assets/audio/ultimate/ultimate_hunting.wav` | 捕食領域 | 広域リング、狩猟感 | OpenGameArt CC0 Sound Effects | 未確認 | 群れ殲滅の気持ちよさ |
| `assets/audio/ultimate/ultimate_attack.wav` | 暴君牙撃 | 重撃、赤い衝撃波 | Pixabay Sound Effects | 未確認 | 低音を強めにしすぎない |
| `assets/audio/boss/boss_warning.wav` | ボス出現警告 | 危険アラート、短い緊張 | Pixabay Sound Effects | 未確認 | 長すぎ禁止 |
| `assets/audio/boss/boss_defeat.wav` | ボス撃破 | 重い崩壊、達成感 | OpenGameArt CC0 Sound Effects | 未確認 | EXP大量ドロップと同期 |
| `assets/audio/bgm/title_theme.mp3` | タイトルBGM | 静かで不穏、研究施設感 | Pixabay Sound Effects | 未確認 | MVP時点では未使用 |
| `assets/audio/bgm/battle_jungle.mp3` | 密林戦闘BGM | 緊張感、低音控えめ | OpenGameArt CC0 Sound Effects / Pixabay Sound Effects | 未確認 | 本格BGMは後続MVP |
| `assets/audio/bgm/boss_warning.mp3` | ボス出現中BGM | 短い緊張感、警告感 | Pixabay Sound Effects | 未確認 | MVP-029では一時切替用 |

## 候補素材サイト

- Kenney Audio Assets
- OpenGameArt CC0 Sound Effects
- Pixabay Sound Effects

## 注意

- CC0表記でも配布ページ単位で条件が変わる場合があります。
- 素材の加工可否、商用利用可否、クレジット要否を個別に確認してください。
- 音量は小さめから調整してください。スマホスピーカーで痛い高音にならないようにします。
