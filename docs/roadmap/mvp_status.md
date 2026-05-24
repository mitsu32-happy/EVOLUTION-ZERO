# EVOLUTION ZERO - MVP進捗管理 v0.2

## 目的

MVP実装の進捗と次工程を管理する。
Codex作業時の現在地確認用。

---

## 完了済みMVP

### MVP-001：プレイヤー移動基盤

状態：完了。

実装内容：

- PlayScene
- Player
- 画面内どこでもドラッグ移動
- 左下固定スティック表示
- カメラ追従
- 密林風背景

---

### MVP-002：ゲーム状態・EXP基盤

状態：完了。

実装内容：

- GameState
- HUD
- Pickup
- CollisionSystem
- EXP回収
- レベル数値上昇
- ステージ境界

修正済み：

- EXP結晶は一度吸着範囲に入ると取得まで追尾

---

### MVP-003：生存ループ基盤

状態：完了。

実装内容：

- HP
- 敵追跡
- 接触ダメージ
- 無敵時間
- ゲームオーバー
- ポーズ

---

### MVP-004：自動攻撃・敵撃破

状態：完了。

実装内容：

- CombatSystem
- 敵HP
- 自動攻撃
- 敵撃破
- EXPドロップ

---

### MVP-005：レベルアップ選択UI

状態：完了。

実装内容：

- レベルアップ停止
- 3択UI
- リロール
- attack_speed_up
- attack_range_up
- move_speed_up

---

### MVP-006：仮スキルシステム

状態：完了。

実装内容：

- skills.js
- スキルLv
- 所持スキル3枠
- 最大Lv5
- 適応タグ蓄積
- ビルドHUD
- 進化予兆表示

---

### MVP-007：進化予兆イベント

状態：完了。

実装内容：

- evolutionCandidateDetected
- タグ別進化候補検出
- 初回警告表示
- HUD継続メッセージ

---

### MVP-008：進化候補選択UI

状態：完了。

実装内容：

- canEvolve
- hasEvolved
- evolutionCandidates
- evolution_ready_ui
- selectedEvolution 保存

修正済み：

- 進化候補検出後、ゲーム停止だけしてUIが出ない問題を修正
- gameplay停止とUI進行を分離

---

### MVP-009：仮進化能力反映

状態：完了。

実装内容：

- speed / hunting / attack の仮進化能力
- 見た目アクセント
- HUD進化名表示
- 進化選択後の軽い停止と脈動

---

### MVP-010：進化後専用通常攻撃

状態：完了。

実装内容：

- normal：既存単体近距離斬撃
- speed：青系3連斬り
- hunting：琥珀系広域弧斬り、最大4体巻き込み
- attack：赤系重い牙撃、高ダメージ、強ノックバック、軽い画面揺れ

---

### MVP-011：敵バリエーション

状態：完了。

実装内容：

- swarm：低HP・低ダメージ・小型・緑系
- fast：高速移動・青系・追跡プレッシャー
- tank：高HP・高ダメージ・大型・重装系・ノックバック耐性
- SpawnSystem調整

---

### MVP-012：敵タイプ別報酬差分

状態：完了。

実装内容：

- enemyType別 expReward / scoreReward
- swarm：EXP 1 / score 60
- fast：EXP 2 / score 260
- tank：EXP 4 / score 340
- Pickupサイズ・色差分

修正済み：

- 初期配置EXP結晶を停止
- EXP結晶は敵撃破時のみドロップ

---

### MVP-013：簡易リザルト画面

状態：完了。

実装内容：

- result_ui.js
- HP0でリザルト表示
- 生存時間
- 撃破数
- スコア
- 獲得EXP
- 到達Lv
- 選択進化
- 主な適応タグ
- もう一度
- ホームへ

修正済み：

- 下部ボタン被りを修正
- ボタンを縦並び化

---

### MVP-014：タイトル・ホーム・選択画面仮導線

状態：実装中。

目的：

```text
タイトル
↓
ホーム
↓
ステージ選択
↓
恐竜選択
↓
プレイ
↓
リザルト
```

を成立させる。

予定内容：

- ScreenManager
- TitleScreen
- HomeScreen
- StageSelectScreen
- DinoSelectScreen
- selectedStage
- selectedDifficulty
- selectedDino
- リザルトのホーム戻り先修正

---

## 現在未実装の主要項目

- セーブ
- DNA研究連動
- 図鑑登録
- 実績
- 音声
- 本格進化演出
- 必殺技
- ボス
- ステージ効果反映
- 恐竜ごとの性能差
- 難易度バランス反映
- 本格アセット差分

---

## 次の推奨フェーズ

MVP-014完了後の候補：

### MVP-015：選択情報のプレイ反映

内容：

- selectedStage に応じた背景・敵比率
- selectedDifficulty に応じた敵HP・報酬倍率
- selectedDino に応じた初期性能差

### MVP-016：セーブ基盤

内容：

- LocalStorage
- save_version
- 所持DNA
- 解放済み恐竜
- 発見済み進化
- 設定保存
- JSONエクスポート / インポート

### MVP-017：DNA研究連動

内容：

- リザルト報酬を永続DNAへ反映
- DNA研究画面の仮実装
- 永続強化反映

---

## 開発方針

- 小さく積む
- 既存操作感を壊さない
- UIとゲーム性を交互に強化する
- スマホ縦を常に最優先にする
- 仕様変更は docs に反映する
