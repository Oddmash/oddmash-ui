# ドキュメントナビゲーションコントロール

SiteHeader、SiteNav、Prose と組み合わせる中立的なコントロールです。製品のルーティング、翻訳、文書データ、ブランド、レイアウトは利用側が管理します。

[English](../navigation-controls.md) · [한국어](../ko/navigation-controls.md) · [简体中文](../zh-CN/navigation-controls.md)

## ドキュメントナビゲーション

`DocsNavigation` はグループ化されたネイティブリンクを描画します。ランドマークのアクセシブルな名前と安定した項目 ID を指定します。`currentId` に一致するリンクを現在のページとして示します。ローカライズした `mobileLabel` を指定すると、48rem 以下で展開ボタンが利用できます。ハイドレーション前とデスクトップではリンクが表示されます。

```tsx
import { DocsNavigation } from '@oddmash/ui/docs-navigation';

<DocsNavigation aria-label="ドキュメント" mobileLabel="ドキュメントを閲覧"
  currentId="guide" groups={[{ id: 'start', label: 'はじめに', items: [
    { id: 'guide', label: '使用ガイド', href: '/ja/docs/guide' },
    { id: 'api', label: 'API', href: '/ja/docs/api' },
  ] }]} />
```

製品側が移動を処理する場合だけ `onNavigate(item, event)` を使います。修飾キー付きクリックとネイティブ動作のため、実際の href を維持してください。

## 目次

`TableOfContents` に見出し ID、ラベル、任意の見出しレベルと本文の `contentId` を渡します。ウィンドウのスクロール、サイズ変更、ハッシュ変更を追跡し、現在位置のリンクに `aria-current="location"` を指定します。制御された状態には `activeId`（明示的な null を含む）を使います。静的 HTML では `observeActiveHeading(content, ids, onActiveChange, { offset })` を使用し、返されるクリーンアップ関数を呼び出せます。

固定ヘッダーの分は `offset` で設定できます。実際の移動先 ID を見出しに維持し、モバイル選択後に見出しへフォーカスする場合は `tabIndex={-1}` を指定します。

## スクロールヘッダー

固定ヘッダーをスクロール方向に反応させる場合は SiteHeader の代わりに `ScrollHeader` を使います。下へ24px 移動すると隠れ、上へ8px 移動すると再表示されます。ページ上部、キーボードフォーカス、開いている子コントロール、`locked` 状態ではヘッダーが表示されます。`media="(max-width: 720px)"` などで範囲を制限できます。動きの軽減設定では常に表示されます。

静的 HTML には `om-site-header om-scroll-header` クラスを指定し、`observeScrollHeader(element, options)` を接続できます。要素を削除する際はクリーンアップ関数を呼び出します。拡張スクリプトがなくてもヘッダーは表示されます。

## 言語セレクター

`LocalePicker` は Select と SSR 用のネイティブ details・リンクのフォールバックを組み合わせます。ローカライズしたコントロール名、各言語の自己表記、`lang`、現在の文書に対応する実際の href を指定します。

```tsx
import { LocalePicker } from '@oddmash/ui/locale-picker';

<LocalePicker label="言語" value="ja" options={[
  { value: 'en', label: 'English', lang: 'en', href: '/en/docs' },
  { value: 'ja', label: '日本語', lang: 'ja', href: '/ja/docs' },
]} />
```

通常は指定された href に移動します。`onValueChange(value, option)` で利用側のルーティングに置き換えられます。言語パスの推測、文書言語の変更、設定保存は行いません。
