# Oddmash UI

[English](../../README.md) · [한국어](../ko/README.md) · [日本語](../ja/README.md) · **简体中文**

Oddmash UI 是 Oddmash 产品共享的界面基础。它为小型 React 开发工具提供一致的视觉语言、无障碍交互模式和可主题化的设计令牌，同时不替产品决定具体布局。

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="../assets/playground-dark.png">
  <img alt="展示模式和组件目录的 Oddmash UI 文档" src="../assets/playground.png">
</picture>

## 提供什么

- 用于表单、反馈、导航、浮层和数据显示的无障碍 React 组件
- 定义颜色、排版、间距、圆角、阴影、边框和动效的 JSON 设计令牌
- 可应用于整个应用或局部区域的浅色与深色主题
- 包含实时示例、API 指南、无障碍说明和令牌浏览器的文档站点
- 在由组件组合而成的开发者工具界面中查看焦点、按键和点击事件的 Interaction Lab
- 链接卡片、代码示例、网站导航、已渲染 Markdown、平台及图标链接、复制反馈、通知管理、语言选择、滚动方向页眉和分组搜索组件及静态 HTML 类契约

## 适合谁

它面向 Interaction Inspector 这类小型工具：产品需要清晰的控件和可靠的行为，但没有必要各自重新发明组件系统。产品布局、信息层级和品牌表达仍由具体产品负责。

## 设计原则

- **默认一致。** 共享组件和语义令牌让 Oddmash 产品保持同一体系。
- **用颜色传达交互状态。** 界面和控件采用中性色，蓝色表示焦点，红色表示错误。
- **行为也要无障碍。** 键盘操作、焦点处理、减少动态效果和强制颜色都属于组件契约。
- **可主题化，但不强制。** 产品可以覆盖语义令牌，而无需复制组件。
- **刻意保持小而精。** 系统根据真实产品需求增长，而不是预先覆盖所有 UI 模式。

## 当前范围

Oddmash UI 正处于 1.0 之前的开发阶段。npm 0.6.0 新增语义状态徽章、统一的范围输入样式和本地化的命令关闭操作，并改进文档导航与代码复制。继续支持 React 18.3.1 和 React 19。

[Docs](https://oddmash.github.io/oddmash-ui/) · [npm](https://www.npmjs.com/package/@oddmash/ui) · [GitHub](https://github.com/Oddmash/oddmash-ui) · [贡献指南](../../CONTRIBUTING.md) · [MIT License](../../LICENSE)
