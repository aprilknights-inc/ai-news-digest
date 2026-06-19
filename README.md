# ai-news-digest

April Knights CEO 三瀬向けの日次AIニュース・ダイジェスト。**自動運用** ── 中身は触らなくていい。

- 毎平日 **10:00 JST**、Claude Code のクラウド・ルーティンが起動
- メディア16ソース＋X重要アカ＋`news.smol.ai` を巡回 → 三瀬向けに6本前後へ絞り込み
- `YYYY-MM-DD.html` を生成して GitHub Pages に公開 → Google Chat にURL通知

## ファイル
| ファイル | 役割 | 触る？ |
|---|---|---|
| `sources.md` | 巡回する情報源・Xアカ・絞り込み方針の**正本** | ◎ ここを編集して好みに調整 |
| `style.css` | 全ページ共有のデザイン（崩さない） | △ 見た目を変えたい時だけ |
| `template.html` | 日次ページの雛形 | ✕ ルーティンが使う |
| `index.html` | バックナンバー一覧 | ✕ 自動更新 |
| `YYYY-MM-DD.html` | 毎日の生成物 | ✕ |

## 調整したいとき
- **情報源・Xアカを足す/減らす** → `sources.md` を編集（翌平日から反映）
- **見た目を変える** → `style.css`
- **配信時刻・頻度・通知文** → ルーティン側（claude.ai/code/routines）

GitHub Pages: Settings → Pages → Branch `main` / root。公開URLは `https://<user>.github.io/ai-news-digest/`。
