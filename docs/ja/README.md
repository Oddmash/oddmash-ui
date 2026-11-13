# Oddmash UI

[English](https://github.com/Oddmash/oddmash-ui#readme) · [한국어](https://github.com/Oddmash/oddmash-ui/blob/main/docs/ko/README.md) · [日本語](https://github.com/Oddmash/oddmash-ui/blob/main/docs/ja/README.md) · [简体中文](https://github.com/Oddmash/oddmash-ui/blob/main/docs/zh-CN/README.md)

Oddmash UI は、小さな React 開発者ツールに一貫した UI の初期設定を提供します。Interaction Inspector の設定画面などを、6 種類のコンポーネントと CSS の読み込みだけで始められます。**Design less. Build more.**

## クイックスタート

下の画像はサンプルデータを使った実装画面です。[公開デモ](https://oddmash.github.io/oddmash-ui/)と [Storybook](https://oddmash.github.io/oddmash-ui/storybook/) をお試しください。main への push で GitHub Actions が両方をビルドして自動公開します。ローカル実行コマンドは以下のとおりです。

![Oddmash UI playground: dark project settings with tabs, input, buttons and badge; sample data](../assets/playground.png)

```sh
git clone https://github.com/Oddmash/oddmash-ui.git
cd oddmash-ui
npm ci
npm run demo
# http://localhost:5173
npm run storybook
# http://localhost:6006
```

## 別のプロジェクトで使う

ビルドには Node 24 以上が必要です。React 18.3.1 と React 19 を peer としてサポートします。npm には未公開です。ここで `npm pack` を実行し、利用側で `npm install /absolute/path/to/oddmash-ui-0.1.0.tgz` を実行してください。CSS は一度読み込みます。ESM 専用で、Tailwind、アイコンパッケージ、CSS-in-JS ランタイム、グローバル reset は不要です。

```tsx
import { Button, Input, Card, Badge, tokens } from '@oddmash/ui';
import '@oddmash/ui/styles.css';

export const Settings = () => (
  <section data-om-theme="dark">
    <Card>
      <Badge tone="accent">Active</Badge>
      <label htmlFor="project">Project name</label>
      <Input id="project" defaultValue="Interaction Inspector" />
      <Button onClick={() => console.log('Save')}>Save changes</Button>
      <p style={{ color: tokens['color.muted'] }}>Local sample project</p>
    </Card>
  </section>
);
```

## API とアクセシビリティ

Button は `variant="primary|secondary|ghost"`、`size="sm|md"`、ネイティブ属性と ref を受け取り、標準 type は button です。Input、Card(div)、Badge(span、`tone="neutral|accent"`) はネイティブ属性、ref、className、style を渡します。Tabs/Dialog は Radix の制御・非制御 API を維持します。Tabs は矢印、Home/End、無効な項目に対応し、Dialog は Escape、フォーカストラップ、トリガーへの復帰に対応します。Input に見える label を付け、エラー説明を aria-describedby で関連付け、aria-invalid を設定してください。DialogTitle/Description を用意し、操作要素を入れ子にしないでください。動きの軽減と強制カラーに対応します。axe 自動検査はスクリーンリーダーの手動検証を代替しません。

```tsx
import {
  Tabs, TabsList, TabsTrigger, TabsContent,
  Dialog, DialogTrigger, DialogContent, DialogTitle,
  DialogDescription, DialogClose, Button,
} from '@oddmash/ui';

export const Views = () => (
  <Tabs defaultValue="events">
    <TabsList aria-label="Inspector views">
      <TabsTrigger value="events">Events</TabsTrigger>
      <TabsTrigger value="focus">Focus</TabsTrigger>
    </TabsList>
    <TabsContent value="events">No events recorded.</TabsContent>
    <TabsContent value="focus">Select an element.</TabsContent>
  </Tabs>
);
export const SettingsDialog = () => (
  <Dialog>
    <DialogTrigger asChild><Button>Settings</Button></DialogTrigger>
    <DialogContent theme="dark">
      <DialogTitle>Settings</DialogTitle>
      <DialogDescription>Configure the local project.</DialogDescription>
      <DialogClose asChild><Button>Done</Button></DialogClose>
    </DialogContent>
  </Dialog>
);
```

## トークンとビルドの選択

JSON が唯一の原本です。Primitive は色と尺度、semantic は light/dark ごとの用途を定義します。色、余白、文字、角丸、境界線、影、動きは DTCG の $type/$value、構造化 sRGB 色・寸法、alias を使用します。テーマは独自 modes 拡張ではなく別ファイルです。Style Dictionary 5 の DTCG 対応、参照解決、CSS 変換を利用し、独自の色・複合トークン変換器を維持しません。開発依存のみです。小さな TypeScript スクリプトが CSS と型付き変数参照を生成し、壊れた参照、テーマキーの不一致、古い生成物を拒否します。src/generated と dist は直接編集しないでください。SCSS は CSS 変数を利用し、重複した値の表を持ちません。

```text
tokens/
  primitive.json
  semantic/light.json
  semantic/dark.json
scripts/tokens.ts
src/
  generated/tokens.css    ← generated
  generated/tokens.ts     ← generated
  button.tsx / input.tsx / card.tsx / badge.tsx
  tabs.tsx / dialog.tsx
  styles.scss
  foundations.stories.tsx
.storybook/
demo/                    ← consumes package exports
tests/                   ← behavior, hydration, tokens, browsers
.github/workflows/ci.yml
```

```json
{
  "semantic": {
    "color": {
      "accent": { "$type": "color", "$value": "{primitive.color.mint}" }
    }
  }
}
```

## テーマと上書き

既定値は light です。html または部分領域に data-om-theme="light"/"dark" を設定します。OS 設定や永続化はアプリ側の責任です。上書きはパッケージ CSS の後に読み込みます。継続管理するブランド値はプロジェクト JSON に保存し CSS を生成してください（Inspector を参照）。以下の CSS は説明用であり別原本ではありません。局所的な変更には semantic トークンを上書きします。primitive と semantic alias 式はテーマ境界ごとに生成されます。Dialog は body にポータルするため、部分テーマには theme を明示し、独自ブランドにはその領域内の container を渡します。Shadow DOM には内部 CSS とポータル container が必要です。閉じた Shadow DOM 内の modal 動作は MVP の検証対象外です。

```scss
.my-tool {
  --om-semantic-color-accent: #087c66;
  --om-semantic-color-accent-hover: #066451;
  --om-semantic-color-on-accent: #ffffff;
  --om-semantic-radius-sm: 4px;
}
```

## 開発と貢献

CI は React 18/19 と対応する型パッケージで型、lint、テスト、トークン一致、パッケージ・Storybook・デモのビルド、3 ブラウザーの検証を行います。以下のコマンドを実行してください。JSON と再生成ファイルを一緒にコミットし、API 変更には動作テストを追加します。4 言語の README、言語リンク、画像を同期してください。組織の貢献方針に従い、複数プロジェクトに影響する API は先に issue で相談します。npm 公開には所有者による別途承認と scope 権限の確認が必要です。

| Command | Purpose |
| --- | --- |
| `npm run tokens` | JSON → CSS + TypeScript |
| `npm run tokens:check` | Reject stale generated files / theme mismatch |
| `npm run typecheck` | TypeScript |
| `npm run lint` | ESLint |
| `npm test` | Behavior, SSR/hydration, token pipeline |
| `npm run build` | ESM, declarations, CSS |
| `npm run test:bundle` | Button-only bundle <= 2 kB; no Radix |
| `npm run build-storybook` | Static component explorer |
| `npm run build:demo` | Package-consuming demo |
| `npm run check` | All non-browser checks |
| `npx playwright install chromium firefox webkit` | Browser setup |
| `npm run test:browser` | Keyboard, focus trap, axe, responsive, motion |
| `npm pack` | Local installable archive; no publishing |

## 範囲と統合

v0 は 6 種類のみです。Select、Toast、フォーム基盤、テーマ provider、フォントダウンロードは含みません。Inspector はプロジェクト JSON の上書きで既存のコンパクトなダーク外観を保ち、Button を導入します。記録、プライバシー、権限は変更しません。統合ブランチと検証結果は docs/VERIFICATION.md に記録します。次は支援技術の手動検証、公開担当者の決定、実利用に応じた拡張です。

MIT. [Style Dictionary](https://styledictionary.com/reference/config/) · [Radix Dialog](https://www.radix-ui.com/primitives/docs/components/dialog) · [Contribution policy](https://github.com/Oddmash/.github/blob/main/CONTRIBUTING.md)
