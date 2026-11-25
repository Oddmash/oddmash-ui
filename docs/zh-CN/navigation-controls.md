# 文档导航控件

这些中性控件可与 SiteHeader、SiteNav 和 Prose 组合使用。产品路由、翻译、文档数据、品牌及布局由使用方管理。

[English](../navigation-controls.md) · [한국어](../ko/navigation-controls.md) · [日本語](../ja/navigation-controls.md)

## 文档导航

`DocsNavigation` 渲染分组的原生链接。提供具有辨识度的可访问名称和稳定的项目 ID。`currentId` 对应的链接标记为当前页面。传入本地化的 `mobileLabel` 后，48rem 以下可使用展开按钮。激活前及桌面端仍可查看链接。

```tsx
import { DocsNavigation } from '@oddmash/ui/docs-navigation';

<DocsNavigation aria-label="文档" mobileLabel="浏览文档"
  currentId="guide" groups={[{ id: 'start', label: '开始', items: [
    { id: 'guide', label: '使用指南', href: '/zh-CN/docs/guide' },
    { id: 'api', label: 'API', href: '/zh-CN/docs/api' },
  ] }]} />
```

仅在使用方处理导航时使用 `onNavigate(item, event)`。保留真实 href 以支持修饰键点击和原生行为。

## 目录

`TableOfContents` 接收标题 ID、标签、可选标题层级及正文的 `contentId`。它跟踪窗口滚动、尺寸变化及哈希变化，并通过 `aria-current="location"` 标记当前位置。使用 `activeId`（包括明确的 null）控制状态。静态 HTML 可以使用 `observeActiveHeading(content, ids, onActiveChange, { offset })`，并调用返回的清理函数。

使用 `offset` 适配粘性页眉。保留标题的真实目标 ID；如果移动端选择后需要聚焦标题，则设置 `tabIndex={-1}`。

## 滚动页眉

需要响应滚动方向的粘性页眉时，使用 `ScrollHeader` 代替 SiteHeader。向下移动24px 后隐藏，向上移动8px 后重新显示。在页首、键盘焦点、打开的子控件及 `locked` 状态下保持可见。可通过 `media="(max-width: 720px)"` 限制范围。减少动态效果设置下页眉始终可见。

静态 HTML 可使用 `om-site-header om-scroll-header` 类并绑定 `observeScrollHeader(element, options)`。移除页眉时调用清理函数。未增强的标记仍然可见。

## 语言选择器

`LocalePicker` 将 Select 与 SSR 的原生 details 和链接回退组合使用。提供本地化控件名称、每种语言的本语言名称、`lang` 与当前文档对应的真实 href。

```tsx
import { LocalePicker } from '@oddmash/ui/locale-picker';

<LocalePicker label="语言" value="zh-CN" options={[
  { value: 'en', label: 'English', lang: 'en', href: '/en/docs' },
  { value: 'zh-CN', label: '简体中文', lang: 'zh-CN', href: '/zh-CN/docs' },
]} />
```

默认选择会导航至提供的 href。使用 `onValueChange(value, option)` 可由使用方处理路由。不推断语言路径、不改变文档语言、不保存偏好。
