import { documentationNavigationTranslations } from './docs-navigation-translations';
import { notificationTranslations } from './notification-translations';
import { previewTranslations } from './preview-translations';

type Translation = [ko: string, ja: string, simplifiedChinese: string];

export const translations: Record<string, Translation> = {
  ...documentationNavigationTranslations,
  ...notificationTranslations,
  ...previewTranslations,
  'Date Select': ['날짜 선택', '日時選択', '日期时间选择'],
  'Select a date and time through seconds.': ['초 단위까지 날짜와 시간을 선택합니다.', '秒単位まで日時を選択します。', '选择精确到秒的日期和时间。'],
  'Use a timezone-free local ISO value. An empty selection starts at today at midnight on the first edit. The consumer owns timezone conversion.': ['시간대가 없는 로컬 ISO 값을 사용하세요. 비어 있으면 첫 수정 시 오늘 자정에서 시작합니다. 시간대 변환은 사용하는 제품에서 담당합니다.', 'タイムゾーンなしのローカル ISO 値を使用します。空の場合は最初の編集時に今日の午前0時から始まります。タイムゾーン変換は利用側が行います。', '使用不含时区的本地 ISO 值。首次编辑空值时从当天零点开始。时区转换由使用方处理。'],
  'Each native select has a visible label. The group has a legend and supports keyboard and touch selection. Use required to prevent clearing.': ['각 기본 셀렉트에 표시되는 레이블이 있습니다. 그룹 이름이 있으며 키보드 및 터치 선택을 지원합니다. required로 지우기를 방지할 수 있습니다.', '各ネイティブ選択欄に表示ラベルがあります。グループには名前があり、キーボードとタッチ操作に対応します。required でクリアを防止します。', '每个原生选择框都有可见标签。分组具有名称，支持键盘和触屏选择。使用 required 可禁止清除。'],
  'Date and time': ['날짜 및 시간', '日時', '日期和时间'],
  Year: ['연도', '年', '年'],
  Month: ['월', '月', '月'],
  Day: ['일', '日', '日'],
  Hour: ['시', '時', '时'],
  Minute: ['분', '分', '分'],
  Second: ['초', '秒', '秒'],
  'Clear date and time': ['날짜 및 시간 지우기', '日時をクリア', '清除日期和时间'],
  "Link Controls": ["링크 컨트롤","リンクコントロール","链接控件"],
  "Style links, named icon controls and keyboard shortcuts without changing native behavior.": ["기본 동작을 유지하면서 링크, 이름이 있는 아이콘 컨트롤, 키보드 단축키를 꾸밉니다.","ネイティブの動作を保ったままリンク、名前付きアイコン操作、キーボードショートカットを装飾します。","在保留原生行为的同时为链接、具名图标控件和键盘快捷键提供样式。"],
  "Use ButtonLink for navigation, IconButton for an action, and IconLink or PlatformLink for a named icon destination. Supply href and localization yourself.": ["이동에는 ButtonLink, 동작에는 IconButton, 아이콘 이동 대상에는 IconLink 또는 PlatformLink를 사용하세요. href와 번역된 이름은 직접 제공하세요.","移動には ButtonLink、操作には IconButton、アイコンの移動先には IconLink または PlatformLink を使います。href と翻訳した名前は利用側が指定します。","导航使用 ButtonLink，操作使用 IconButton，图标链接目标使用 IconLink 或 PlatformLink。由使用方提供 href 和本地化标签。"],
  "Name each icon-only control, hide decorative icons, and use Kbd for shortcuts. Platform hover respects reduced motion.": ["아이콘 전용 컨트롤에는 접근 가능한 이름을 지정하고 장식 아이콘을 숨기며 단축키에는 Kbd를 사용하세요. 플랫폼 호버 효과는 동작 줄이기 설정을 따릅니다.","アイコンのみの操作には名前を付け、装飾アイコンを隠し、ショートカットには Kbd を使います。プラットフォームのホバー効果は動きの軽減設定に従います。","为纯图标控件提供可访问名称，隐藏装饰图标，快捷键使用 Kbd。平台悬停效果遵循减少动态效果设置。"],
  "Read guide": ["가이드 읽기","ガイドを読む","阅读指南"],
  "Open search example": ["검색 예제 열기","検索例を開く","打开搜索示例"],
  "Open reference example": ["참조 예제 열기","リファレンス例を開く","打开参考示例"],
  "Platform links": ["플랫폼 링크","プラットフォームリンク","平台链接"],
  "GitHub example": ["GitHub 예제","GitHub の例","GitHub 示例"],
  "npm example": ["npm 예제","npm の例","npm 示例"],
  "Open with an explicit trigger or an opt-in Mod+K shortcut. Supply descriptive grouped results and a consumer-owned filter when needed.": ["명시적인 트리거 또는 선택적으로 Mod+K 단축키로 열 수 있습니다. 설명이 있는 그룹 결과와 필요시 자체 검색 필터를 전달하세요.","明示的なトリガー、または任意の Mod+K ショートカットで開きます。説明付きのグループ結果と必要に応じた検索フィルターを渡します。","通过明确的触发器或可选的 Mod+K 快捷键打开，传入带描述的分组结果和所需的搜索过滤器。"],
  "Use arrow keys, Enter and Escape. Provide distinct result labels and descriptions.": ["화살표 키, Enter, Escape를 사용하세요. 명확한 결과 이름과 설명을 제공하세요.","矢印キー、Enter、Escape を使用します。明確な結果名と説明を提供します。","使用方向键、Enter 和 Escape。提供清晰的结果名称与描述。"],
  "Save current changes": ["현재 변경사항 저장","現在の変更を保存","保存当前更改"],
  "Project": ["프로젝트","プロジェクト","项目"],
  "Example options table": ["예제 옵션 표","オプション表の例","选项表示例"],
  "Link Card": ["링크 카드","リンクカード","链接卡片"],
  "Code Block": ["코드 블록","コードブロック","代码块"],
  "Site Layout": ["사이트 레이아웃","サイトレイアウト","网站布局"],
  "Prose": ["문서 본문","記事本文","文章正文"],
  "Present a document or destination as a single link.": ["문서나 이동 대상을 하나의 링크로 보여 줍니다.","文書や移動先を一つのリンクとして表示します。","将文档或目标呈现为一个链接。"],
  "Use LinkCard for a single destination. The same om-link-card class works in static HTML, and om-link-card-arrow is optional.": ["하나의 이동 대상에는 LinkCard를 사용하세요. 정적 HTML에서도 om-link-card 클래스를 사용할 수 있으며 om-link-card-arrow는 선택 사항입니다.","一つの移動先には LinkCard を使います。静的 HTML でも om-link-card を利用でき、om-link-card-arrow は任意です。","单个目标使用 LinkCard。静态 HTML 同样支持 om-link-card，om-link-card-arrow 为可选项。"],
  "Keep the destination clear, avoid nested controls and hide decorative arrows. Focus remains visible and the fill respects reduced motion.": ["이동 대상을 명확히 표시하고 중첩 컨트롤을 피하며 장식용 화살표는 숨기세요. 포커스는 선명하게 보이고 채움 효과는 동작 줄이기 설정을 따릅니다.","移動先を明確にし、操作要素の入れ子を避け、装飾矢印を隠します。フォーカスを可視化し、塗りつぶしは動きの軽減設定に従います。","明确链接目标，避免嵌套控件并隐藏装饰箭头。焦点保持可见，填充效果遵循减少动态效果设置。"],
  "Display readable code with an optional caption and action.": ["설명과 동작을 선택적으로 제공하는 읽기 쉬운 코드 영역입니다.","任意の説明や操作を持つ読みやすいコード領域です。","展示易读代码，支持可选标题和操作。"],
  "Compose CodeBlock with CodeBlockHeader, CodeBlockCaption and CodeBlockContent. CodeBlockCopy is a native button; the consumer owns copying and feedback.": ["CodeBlock에 CodeBlockHeader, CodeBlockCaption, CodeBlockContent를 조합하세요. CodeBlockCopy는 기본 버튼이며 복사와 피드백은 제품에서 관리합니다.","CodeBlock に CodeBlockHeader、CodeBlockCaption、CodeBlockContent を組み合わせます。CodeBlockCopy はネイティブボタンで、コピーとフィードバックは使用側が管理します。","将 CodeBlock 与 CodeBlockHeader、CodeBlockCaption 和 CodeBlockContent 组合使用。CodeBlockCopy 是原生按钮，复制及反馈由使用方管理。"],
  "Label copy actions and announce the result. A named, focusable code region lets keyboard users scroll long lines. Preserve whitespace and syntax markup.": ["복사 버튼에 이름을 지정하고 결과를 알리세요. 이름과 포커스가 있는 코드 영역은 키보드로 긴 줄을 스크롤할 수 있습니다. 공백과 구문 마크업을 보존하세요.","コピー操作に名前を付け、結果を通知します。名前付きのフォーカス可能なコード領域ならキーボードで長い行をスクロールできます。空白と構文マークアップを保持します。","为复制操作提供名称并播报结果。具名且可聚焦的代码区域允许键盘用户滚动长行。保留空白和语法标记。"],
  "Compose neutral headers, footers and navigation landmarks.": ["중립적인 헤더, 푸터, 탐색 영역을 조합합니다.","中立的なヘッダー、フッター、ナビゲーションランドマークを組み立てます。","组合中性页眉、页脚及导航地标。"],
  "Combine SiteHeader or SiteFooter with their Inner wrapper and SiteNav. Branding, responsive navigation choices and sticky behavior stay with the product.": ["SiteHeader 또는 SiteFooter에 Inner 래퍼와 SiteNav를 조합하세요. 브랜드, 반응형 탐색 방식, 고정 동작은 제품에서 정합니다.","SiteHeader または SiteFooter に Inner ラッパーと SiteNav を組み合わせます。ブランドやレスポンシブナビゲーション、固定表示は製品側で決めます。","将 SiteHeader 或 SiteFooter 与 Inner 容器和 SiteNav 组合。品牌、响应式导航方式和固定行为由产品决定。"],
  "Keep native header, footer and nav semantics. Name each navigation landmark when there is more than one, and mark the current link with aria-current.": ["header, footer, nav의 기본 의미를 유지하세요. 탐색 영역이 여러 개라면 각각 이름을 지정하고 현재 링크는 aria-current로 표시하세요.","header、footer、nav のネイティブな意味を維持します。ナビゲーションが複数ある場合は各ランドマークに名前を付け、現在のリンクを aria-current で示します。","保留 header、footer 和 nav 的原生语义。多个导航地标需要分别命名，并使用 aria-current 标记当前链接。"],
  "Style rendered Markdown without choosing a parser.": ["파서를 지정하지 않고 렌더링된 Markdown에 스타일을 적용합니다.","パーサーを選ばず、レンダリング済み Markdown をスタイルします。","无需选择解析器即可为已渲染的 Markdown 设置样式。"],
  "Wrap trusted rendered article markup with Prose or the om-prose class. Use ProseScroll around wide tables. The Markdown renderer remains a consumer choice.": ["신뢰할 수 있는 렌더링 본문을 Prose 또는 om-prose 클래스로 감싸세요. 넓은 표에는 ProseScroll을 사용합니다. Markdown 렌더러는 제품에서 선택합니다.","信頼できる描画済み記事を Prose または om-prose で包みます。幅の広い表には ProseScroll を使います。Markdown レンダラーは利用側が選びます。","使用 Prose 或 om-prose 包裹可信的已渲染文章。在宽表外使用 ProseScroll。Markdown 渲染器由使用方选择。"],
  "Preserve native headings, lists, tables and links. Use the document language and label focusable scroll regions. Code preserves whitespace.": ["기본 제목, 목록, 표, 링크 의미를 유지하세요. 문서 언어를 설정하고 포커스 가능한 스크롤 영역에 이름을 지정하세요. 코드 공백은 유지됩니다.","ネイティブの見出し、リスト、表、リンクを維持します。文書の言語を設定し、フォーカス可能なスクロール領域に名前を付けます。コードの空白は保持されます。","保留原生标题、列表、表格和链接。设置文档语言，并为可聚焦的滚动区域命名。代码保留空白。"],
  "Usage guide": ["사용 가이드","使用ガイド","使用指南"],
  "Learn how to use the library.": ["라이브러리 사용법을 알아보세요.","ライブラリの使い方を学びます。","了解如何使用库。"],
  "Terminal": ["터미널","ターミナル","终端"],
  "Terminal code": ["터미널 코드","ターミナルコード","终端代码"],
  "Header navigation example": ["헤더 탐색 예제","ヘッダーナビゲーションの例","页眉导航示例"],
  "Footer navigation example": ["푸터 탐색 예제","フッターナビゲーションの例","页脚导航示例"],
  "Docs": ["문서","ドキュメント","文档"],
  "Examples": ["예제","例","示例"],
  "Open source": ["오픈소스","オープンソース","开源"],
  "Install the package.": ["패키지를 설치하세요.","パッケージをインストールします。","安装软件包。"],
  "Name": ["이름","名前","名称"],
  'Command Palette': ['명령 팔레트', 'コマンドパレット', '命令面板'],
  Width: ['너비', '幅', '宽度'],
  Slider: ['슬라이더', 'スライダー', '滑块'],
  Commands: ['명령', 'コマンド', '命令'],
  'Choose an action': ['작업 선택', '操作を選択', '选择操作'],
  'Search commands': ['명령 검색', 'コマンドを検索', '搜索命令'],
  'No commands found': ['명령 없음', 'コマンドがありません', '没有命令'],
  'Adjust a numeric value.': ['숫자 값을 조절합니다.', '数値を調整します。', '调整数值。'],
  'Use a visible label and native range limits.': ['보이는 레이블과 기본 범위를 사용하세요.', 'ラベルと範囲を指定します。', '使用可见标签和原生范围。'],
  'Arrow keys adjust the value.': ['방향키로 값을 조절합니다.', '矢印キーで値を調整します。', '方向键调整数值。'],
  'Find and execute actions.': ['작업을 찾아 실행합니다.', '操作を検索して実行します。', '查找并执行操作。'],
  'Open with an explicit trigger.': ['명시적인 버튼으로 엽니다.', '明示的なボタンで開きます。', '使用明确按钮打开。'],
  'Use arrow keys, Enter and Escape.': ['방향키, Enter, Escape를 사용합니다.', '矢印キー、Enter、Escape を使います。', '使用方向键、Enter 和 Escape。'],
  Overview: ['개요', '概要', '概览'],
  'Start here': ['시작하기', 'はじめに', '开始'],
  Installation: ['설치', 'インストール', '安装'],
  Foundations: ['기반', '基盤', '基础'],
  Colors: ['색상', 'カラー', '颜色'],
  Typography: ['타이포그래피', 'タイポグラフィ', '排版'],
  Tokens: ['디자인 토큰', 'デザイントークン', '设计令牌'],
  Components: ['컴포넌트', 'コンポーネント', '组件'],
  'Core components': ['기본 컴포넌트', '基本コンポーネント', '基础组件'],
  Forms: ['폼', 'フォーム', '表单'],
  Feedback: ['피드백', 'フィードバック', '反馈'],
  Navigation: ['탐색', 'ナビゲーション', '导航'],
  'Data display': ['데이터 표시', 'データ表示', '数据展示'],
  Patterns: ['패턴', 'パターン', '模式'],
  'Interaction monitor': [
    '상호작용 모니터',
    'インタラクションモニター',
    '交互监视器',
  ],
  'Timeline filters': [
    '타임라인 필터',
    'タイムラインの絞り込み',
    '时间线筛选器',
  ],
  Language: ['언어', '言語', '语言'],
  'Skip to content': ['본문으로 건너뛰기', '本文へスキップ', '跳转到正文'],
  'Oddmash UI home': ['Oddmash UI 홈', 'Oddmash UI ホーム', 'Oddmash UI 首页'],
  'Search documentation': ['문서 검색', 'ドキュメントを検索', '搜索文档'],
  'Search docs…': ['문서 검색…', 'ドキュメントを検索…', '搜索文档…'],
  'Switch to dark theme': [
    '다크 테마로 전환',
    'ダークテーマに切り替え',
    '切换至深色主题',
  ],
  'Switch to light theme': [
    '라이트 테마로 전환',
    'ライトテーマに切り替え',
    '切换至浅色主题',
  ],
  'Toggle navigation': [
    '탐색 메뉴 열기 또는 닫기',
    'ナビゲーションの表示切替',
    '切换导航',
  ],
  Documentation: ['문서 탐색', 'ドキュメントのナビゲーション', '文档导航'],
  'No pages found.': [
    '검색 결과가 없습니다.',
    'ページが見つかりません。',
    '未找到页面。',
  ],
  'Small tools.': ['작은 도구.', '小さなツール。', '小工具。'],
  'Better flow.': ['더 나은 흐름.', 'もっと快適に。', '更顺畅的工作流。'],
  'Getting started': ['시작하기', 'はじめる', '快速开始'],
  'Browse components': [
    '컴포넌트 둘러보기',
    'コンポーネントを見る',
    '浏览组件',
  ],
  'Contribute to the system': [
    '디자인 시스템에 기여하기',
    'デザインシステムに貢献',
    '参与设计系统',
  ],
  'React components and design tokens for Oddmash developer tools.': [
    'Oddmash 개발 도구를 위한 React 컴포넌트와 디자인 토큰.',
    'Oddmash の開発ツール向け React コンポーネントとデザイントークン。',
    '用于 Oddmash 开发工具的 React 组件与设计令牌。',
  ],
  'Shared color, type, spacing, motion, and theme behavior.': [
    '색상, 글꼴, 간격, 모션과 테마의 공통 기준.',
    'カラー、書体、余白、モーション、テーマの共通基盤。',
    '共享颜色、字体、间距、动效和主题规则。',
  ],
  'Semantic roles for light and dark themes.': [
    '라이트·다크 테마의 의미 기반 색상.',
    'ライト・ダークテーマのセマンティックカラー。',
    '浅色和深色主题的语义颜色。',
  ],
  'Geist Sans for interfaces and Geist Mono for technical values.': [
    '인터페이스는 Geist Sans, 코드와 값은 Geist Mono.',
    'UI には Geist Sans、コードや値には Geist Mono。',
    '界面采用 Geist Sans，代码和值采用 Geist Mono。',
  ],
  'DTCG JSON compiled to CSS and TypeScript.': [
    'DTCG JSON에서 생성하는 CSS와 TypeScript.',
    'DTCG JSON から生成する CSS と TypeScript。',
    '由 DTCG JSON 生成的 CSS 和 TypeScript。',
  ],
  'Interaction Lab': ['상호작용 실험실', 'インタラクションラボ', '交互实验室'],
  'Clear events': ['이벤트 지우기', 'イベントを消去', '清除事件'],
  'Project name': ['프로젝트 이름', 'プロジェクト名', '项目名称'],
  'Save project': ['프로젝트 저장', 'プロジェクトを保存', '保存项目'],
  Events: ['이벤트', 'イベント', '事件'],
  Target: ['대상', '対象', '目标'],
  'Recent interactions': ['최근 상호작용', '最近の操作', '最近交互'],
  'Tab into the form or click a control to capture an event.': [
    'Tab으로 폼에 진입하거나 컨트롤을 클릭하면 이벤트가 기록됩니다.',
    'Tab でフォームへ移動するか操作すると、イベントが記録されます。',
    '按 Tab 进入表单或点击控件，即可记录事件。',
  ],
  Control: ['컨트롤', 'コントロール', '控件'],
  'Last event': ['마지막 이벤트', '最後のイベント', '最后一个事件'],
  'Interact with the form to inspect a control.': [
    '폼과 상호작용하면 컨트롤을 확인할 수 있습니다.',
    'フォームを操作して対象を確認します。',
    '与表单交互以查看控件。',
  ],
  'Interaction views': ['상호작용 보기', '操作ビュー', '交互视图'],
  'Show alert': ['알림 표시', 'アラートを表示', '显示警告'],
  'OK': ['확인', '確認', '确定'],
  'Require acknowledgment of an important message.': ['중요한 메시지의 확인을 요청합니다.', '重要なメッセージの確認を求めます。', '要求确认重要消息。'],
  'Use AlertDialog for acknowledgment and Alert for inline status.': ['확인이 필요한 경우 AlertDialog, 인라인 상태에는 Alert를 사용하세요.', '確認には AlertDialog、インラインの状態には Alert を使用します。', '使用 AlertDialog 确认消息，使用 Alert 显示行内状态。'],
  'The modal traps focus and restores it on confirmation. Inline alerts can use role="alert".': ['모달은 포커스를 유지하고 확인 후 복원합니다. 인라인 알림에는 role="alert"를 사용할 수 있습니다.', 'モーダルはフォーカスを保持し、確認後に戻します。インライン通知には role="alert" を使えます。', '模态框限制焦点并在确认后恢复。行内警告可使用 role="alert"。'],
  "Notice": ["알림","通知","通知"],
  "Loading": ["처리 중","処理中","处理中"],
  "Project updated": ["프로젝트 업데이트","プロジェクトを更新しました","项目已更新"],
  "The project has a new update.": ["프로젝트에 새로운 변경 사항이 있습니다.","プロジェクトに新しい更新があります。","项目有新的更新。"],
  "Saving project": ["프로젝트 저장 중","プロジェクトを保存中","正在保存项目"],
  "Your changes are being synchronized.": ["변경 사항을 동기화하고 있습니다.","変更を同期しています。","正在同步更改。"],
  "Use neutral, success, info, warning or loading for polite updates and danger or error for urgent errors. Keep the dismiss button available and restore focus to the next notification or trigger. Custom icons are decorative; use null to hide the icon.": ["일반 알림에는 neutral, success, info, warning, loading을, 긴급 오류에는 danger 또는 error를 사용하세요. 닫기 버튼과 포커스 복원을 제공하세요. 사용자 지정 아이콘은 장식용이며 null로 숨길 수 있습니다.","通常の通知には neutral、success、info、warning、loading、緊急エラーには danger または error を使います。閉じる操作とフォーカスの復帰を提供します。カスタムアイコンは装飾用で、null で非表示にできます。","普通通知使用 neutral、success、info、warning 或 loading，紧急错误使用 danger 或 error。提供关闭按钮和焦点恢复。自定义图标为装饰用途，使用 null 隐藏。"],
  "Notification tone": ["알림 상태","通知の種類","通知类型"],
  "Success": ["성공","成功","成功"],
  "Information": ["정보","情報","信息"],
  "Warning": ["주의","警告","警告"],
  "Error": ["오류","エラー","错误"],
  "Export ready": ["내보내기 완료","エクスポート完了","导出完成"],
  "Your export is available in the project history.": ["프로젝트 기록에서 내보낸 파일을 확인할 수 있습니다.","プロジェクト履歴からエクスポートを確認できます。","可以在项目历史中查看导出文件。"],
  "Connection interrupted": ["연결이 끊겼습니다","接続が中断されました","连接中断"],
  "Your changes are preserved locally. Reconnect before continuing.": ["변경 사항은 로컬에 보관됩니다. 다시 연결한 후 계속하세요.","変更はローカルに保持されています。再接続して続行してください。","您的更改已保存在本地，请重新连接后继续。"],
  "Save failed": ["저장 실패","保存に失敗しました","保存失败"],
  "Your changes could not be synchronized. Check your network connection and retry when you are ready.": ["변경 사항을 동기화하지 못했습니다. 네트워크 연결을 확인하고 준비되면 다시 시도해 주세요.","変更を同期できませんでした。ネットワーク接続を確認してから再試行してください。","无法同步更改。请检查网络连接，准备就绪后重试。"],
  'Mount Toasts within ToastViewport before the action runs to stack notifications. Keep newer items last; hover or focus expands the stack.': ['동작 전에 ToastViewport 안에 Toast를 렌더링하세요. 새 알림은 마지막에 배치하고, 마우스를 올리거나 포커스를 이동하면 스택이 펼쳐집니다.', '操作前に ToastViewport 内に Toast を配置し、新しい通知を最後に追加します。ホバーやフォーカスで展開します。', '在操作前将 Toast 渲染到 ToastViewport 内。新通知放在最后，悬停或聚焦时展开。'],
  'Use neutral, success, info or warning for polite updates and danger or error for urgent errors. Keep the dismiss button available and restore focus to the next notification or trigger.': ['일반 알림에는 neutral, success, info, warning을, 긴급 오류에는 danger 또는 error를 사용하세요. 닫기 버튼을 제공하고 다음 알림이나 실행 버튼으로 포커스를 복원하세요.', '通常の通知には neutral、success、info、warning、緊急のエラーには danger または error を使います。閉じるボタンを配置し、次の通知か起動ボタンへフォーカスを戻します。', '普通通知使用 neutral、success、info 或 warning，紧急错误使用 danger 或 error。提供关闭按钮并将焦点还给下一条通知或触发按钮。'],
  'Mount Toasts within ToastViewport before the action runs to stack notifications.': ['알림을 쌓으려면 동작 전에 ToastViewport 안에 Toast를 렌더링하세요.', '通知を重ねるには、操作前に ToastViewport 内に Toast を配置します。', '在操作前将 Toast 渲染到 ToastViewport 内以堆叠通知。'],
  'Hide alert': ['알림 숨기기', 'アラートを隠す', '隐藏警告'],
  'Recording stopped': [
    '기록이 중지되었습니다',
    '記録が停止しました',
    '记录已停止',
  ],
  'Reconnect the inspector to continue capturing events.': [
    '이벤트 기록을 계속하려면 검사기를 다시 연결하세요.',
    'イベント記録を続けるにはインスペクターを再接続してください。',
    '请重新连接检查器以继续记录事件。',
  ],
  'Show toast': ['토스트 표시', 'トーストを表示', '显示通知'],
  'Project saved': [
    '프로젝트를 저장했습니다',
    'プロジェクトを保存しました',
    '项目已保存',
  ],
  'Your changes are ready.': [
    '변경 사항을 반영했습니다.',
    '変更が反映されました。',
    '更改已就绪。',
  ],
  'Dismiss notification': ['알림 닫기', '通知を閉じる', '关闭通知'],
  'Example breadcrumb': ['경로 탐색 예제', 'パンくずリストの例', '面包屑示例'],
  Playground: ['플레이그라운드', 'プレイグラウンド', '演练场'],
  Preview: ['미리보기', 'プレビュー', '预览'],
  Code: ['코드', 'コード', '代码'],
  Usage: ['사용법', '使い方', '用法'],
  'API reference': ['API 참고', 'API リファレンス', 'API 参考'],
  'API reference table': ['API 참고 표', 'API 参照表', 'API 参考表'],
  Prop: ['속성', 'プロパティ', '属性'],
  Type: ['타입', '型', '类型'],
  Default: ['기본값', '既定値', '默认值'],
  Accessibility: ['접근성', 'アクセシビリティ', '无障碍'],
  'Close commands': ['명령 닫기', 'コマンドを閉じる', '关闭命令'],
  'Copy code': ['코드 복사', 'コードをコピー', '复制代码'],
  Copied: ['복사했습니다', 'コピーしました', '已复制'],
  'Select the code to copy': [
    '코드를 선택해 복사하세요',
    'コードを選択してコピーしてください',
    '请选择代码进行复制',
  ],
  Variant: ['변형', 'バリエーション', '变体'],
  Size: ['크기', 'サイズ', '尺寸'],
  Disabled: ['비활성', '無効', '禁用'],
  'Create project': ['프로젝트 만들기', 'プロジェクトを作成', '创建项目'],
  Cancel: ['취소', 'キャンセル', '取消'],
  'Learn more': ['자세히 보기', '詳しく見る', '了解更多'],
  'Edit project': ['프로젝트 편집', 'プロジェクトを編集', '编辑项目'],
  'Project settings': ['프로젝트 설정', 'プロジェクト設定', '项目设置'],
  'Save changes': ['변경 사항 저장', '変更を保存', '保存更改'],
  'Give your project a name.': [
    '프로젝트 이름을 정하세요.',
    'プロジェクト名を付けてください。',
    '请为项目命名。',
  ],
  Activity: ['활동', 'アクティビティ', '活动'],
  Settings: ['설정', '設定', '设置'],
  'Project views': ['프로젝트 보기', 'プロジェクトビュー', '项目视图'],
  'No new events.': [
    '새 이벤트가 없습니다.',
    '新しいイベントはありません。',
    '没有新事件。',
  ],
  'Release notes': ['릴리스 노트', 'リリースノート', '发行说明'],
  'Describe what changed': [
    '변경 내용을 설명하세요',
    '変更内容を記入',
    '描述更改内容',
  ],
  Environment: ['환경', '環境', '环境'],
  Staging: ['스테이징', 'ステージング', '预发布'],
  Production: ['프로덕션', '本番', '生产'],
  'Capture keyboard events': [
    '키보드 이벤트 기록',
    'キーボードイベントを記録',
    '记录键盘事件',
  ],
  'Event order': ['이벤트 순서', 'イベント順序', '事件顺序'],
  'Newest first': ['최신순', '新しい順', '最新优先'],
  'Oldest first': ['오래된 순', '古い順', '最早优先'],
  'Capture interactions': ['상호작용 기록', '操作を記録', '记录交互'],
  'Events to capture': ['기록할 이벤트', '記録するイベント', '要记录的事件'],
  Focus: ['포커스', 'フォーカス', '焦点'],
  Pointer: ['포인터', 'ポインター', '指针'],
  'Exporting events (65%)': [
    '이벤트 내보내는 중 (65%)',
    'イベントをエクスポート中（65%）',
    '正在导出事件（65%）',
  ],
  'Connecting to inspector': [
    '검사기에 연결 중',
    'インスペクターに接続中',
    '正在连接检查器',
  ],
  'Loading event details': [
    '이벤트 상세 불러오는 중',
    'イベント詳細を読み込み中',
    '正在加载事件详情',
  ],
  'No events captured': [
    '기록된 이벤트가 없습니다',
    'イベントが記録されていません',
    '没有已记录的事件',
  ],
  'Interact with the page to start filling the timeline.': [
    '페이지와 상호작용하면 타임라인에 표시됩니다.',
    'ページを操作するとタイムラインに表示されます。',
    '与页面交互后，事件会显示在时间线中。',
  ],
  'Open Interaction Lab': [
    '상호작용 실험실 열기',
    'インタラクションラボを開く',
    '打开交互实验室',
  ],
  'Keyboard shortcuts': [
    '키보드 단축키',
    'キーボードショートカット',
    '键盘快捷键',
  ],
  'Example pagination': ['페이지 이동 예제', 'ページ切り替えの例', '分页示例'],
  'Page 1': ['1페이지', '1 ページ', '第 1 页'],
  'Page 2': ['2페이지', '2 ページ', '第 2 页'],
  'Page 3': ['3페이지', '3 ページ', '第 3 页'],
  'Design team': ['디자인 팀', 'デザインチーム', '设计团队'],
  'Recording settings': ['기록 설정', '記録設定', '记录设置'],
  'Export options': ['내보내기 옵션', 'エクスポート設定', '导出选项'],
  'Recorded events': ['기록된 이벤트', '記録したイベント', '已记录事件'],
  Event: ['이벤트', 'イベント', '事件'],
  'Monochrome palette': ['모노크롬 팔레트', 'モノクロパレット', '单色调色板'],
  'Semantic palette': [
    '의미 기반 팔레트',
    'セマンティックパレット',
    '语义调色板',
  ],
  'Make it your own': [
    '프로젝트에 적용하기',
    'プロジェクトに合わせる',
    '按项目定制',
  ],
  'A practical type scale': [
    '실용적인 글자 크기',
    '実用的な文字サイズ',
    '实用字号',
  ],
  'Readable by default': ['읽기 쉬운 기본값', '読みやすい基本設定', '默认易读'],
  'Token explorer': ['토큰 탐색기', 'トークンエクスプローラー', '令牌浏览器'],
  'Filter tokens': ['토큰 필터', 'トークンを絞り込む', '筛选令牌'],
  'Filter by name or type…': [
    '이름 또는 타입으로 검색…',
    '名前または型で検索…',
    '按名称或类型筛选…',
  ],
  'Design tokens table': [
    '디자인 토큰 표',
    'デザイントークンの表',
    '设计令牌表',
  ],
  Light: ['라이트', 'ライト', '浅色'],
  Dark: ['다크', 'ダーク', '深色'],
  'Space to breathe': ['간격 스케일', '余白スケール', '间距标尺'],
  'Package and source': ['패키지와 소스', 'パッケージとソース', '软件包与源码'],
  'Install from npm': ['npm에서 설치', 'npm からインストール', '从 npm 安装'],
  'Build from GitHub': [
    'GitHub 소스로 빌드',
    'GitHub ソースからビルド',
    '从 GitHub 源码构建',
  ],
  'Make something small': [
    '첫 컴포넌트 만들기',
    '最初のコンポーネントを作る',
    '构建第一个组件',
  ],
  'Choose a theme': ['테마 선택', 'テーマを選ぶ', '选择主题'],
  'Explore the palette': ['팔레트 보기', 'パレットを見る', '查看调色板'],
  'Use the pattern': ['패턴 사용하기', 'パターンの使用方法', '使用此模式'],
  'Try the filters': ['필터 체험하기', 'フィルターを試す', '试用筛选器'],
  'Use in your tool': [
    '내 도구에 적용하기',
    '自分のツールで使う',
    '在工具中使用',
  ],
  'Event type': ['이벤트 종류', 'イベントの種類', '事件类型'],
  'All events': ['모든 이벤트', 'すべてのイベント', '所有事件'],
  'Selected element': ['선택한 요소', '選択した要素', '所选元素'],
  'Filtered event timeline': [
    '필터링된 타임라인',
    '絞り込んだタイムライン',
    '筛选后的时间线',
  ],
  'matching events': ['일치하는 이벤트', '件の一致', '条匹配事件'],
  code: ['코드', 'コード', '代码'],
  'Your next idea': ['새로운 아이디어', '次のアイデア', '你的新想法'],
  'Use a short, memorable name.': [
    '짧고 기억하기 쉬운 이름을 사용하세요.',
    '短く覚えやすい名前を使ってください。',
    '请使用简短易记的名称。',
  ],
  'Repository URL': ['저장소 URL', 'リポジトリ URL', '仓库 URL'],
  'Enter a valid repository URL.': [
    '유효한 저장소 URL을 입력하세요.',
    '有効なリポジトリ URL を入力してください。',
    '请输入有效的仓库 URL。',
  ],
  Active: ['활성', 'アクティブ', '启用'],
  'A clearer view of every interaction.': [
    '상호작용을 더 선명하게 확인하세요.',
    'すべての操作を見やすく。',
    '更清晰地查看每次交互。',
  ],
  'Updated just now': ['방금 업데이트됨', 'たった今更新', '刚刚更新'],
  Draft: ['초안', '下書き', '草稿'],
  Running: ['실행 중', '実行中', '正在运行'],
  Waiting: ['대기 중', '待機中', '等待中'],
  Succeeded: ['성공', '成功', '成功'],
  Failed: ['실패', '失敗', '失败'],
  'Attention required': ['확인 필요', '確認が必要', '需要关注'],
  Unknown: ['알 수 없음', '不明', '未知'],
  'A little context. No extra noise.': [
    '필요한 맥락만 간단히 표시합니다.',
    '必要な情報だけを簡潔に表示します。',
    '简洁地展示必要信息。',
  ],
  Members: ['멤버', 'メンバー', '成员'],
  'Project created': [
    '프로젝트를 만들었습니다',
    'プロジェクトを作成しました',
    '项目已创建',
  ],
  'Ready for your next idea.': [
    '새로운 아이디어를 시작하세요.',
    '次のアイデアを始めましょう。',
    '开始你的新想法。',
  ],
  'Just now': ['방금', 'たった今', '刚刚'],
  Press: ['누르기:', 'キーを押す:', '按'],
  'to move to the next control and': [
    '다음 컨트롤로 이동하고',
    'で次のコントロールへ移動し、',
    '移至下一个控件，然后按',
  ],
  'to activate it.': [
    '선택한 컨트롤을 실행합니다.',
    'で実行します。',
    '激活控件。',
  ],
  'Use neutral colors for surfaces and actions. Blue marks keyboard focus, and red marks errors.':
    [
      '표면과 동작에는 중립색을 사용합니다. 키보드 포커스는 파란색, 오류는 빨간색입니다.',
      '面と操作には無彩色を使い、キーボードフォーカスは青、エラーは赤で示します。',
      '表面和操作采用中性色。蓝色标记键盘焦点，红色标记错误。',
    ],
  'Override semantic variables on a scoped container. Store lasting brand choices in your project’s JSON source and generate the overrides.':
    [
      '특정 컨테이너에 의미 기반 변수를 재정의하세요. 브랜드 색상은 프로젝트 JSON에서 관리하고 재정의 값을 생성하세요.',
      '対象コンテナにセマンティック変数を上書きします。ブランドの値はプロジェクトの JSON で管理します。',
      '在指定容器中覆盖语义变量。将品牌选项保存在项目 JSON 中，再生成覆盖样式。',
    ],
  'This snippet is illustrative, not a second token source. Check text and focus contrast whenever you change a color pair.':
    [
      '예제의 색상 조합을 바꿀 때 텍스트와 포커스 대비를 확인하세요.',
      '例の色の組み合わせを変えるときは、テキストとフォーカスのコントラストを確認してください。',
      '修改示例颜色组合时，请检查文字与焦点的对比度。',
    ],
  'Small tools. Better flow.': [
    '작은 도구. 더 나은 흐름.',
    '小さなツール。もっと快適に。',
    '小工具，更顺畅的工作流。',
  ],
  'The details make the difference.': [
    '디테일이 차이를 만듭니다.',
    '細部が違いを生みます。',
    '细节带来差异。',
  ],
  'Use Geist Sans for interface labels, descriptions, and headings. Use Geist Mono for code, token values, and event logs. This site serves both fonts locally. Korean text uses a Korean font available on your device.':
    [
      '제목과 설명은 Geist Sans, 코드·토큰·이벤트는 Geist Mono로 표시합니다. 두 글꼴은 사이트에서 제공하며, 한글은 기기에 설치된 한글 글꼴을 사용합니다.',
      '見出しやラベルには Geist Sans、コードやトークン、ログには Geist Mono を使います。フォントはサイトから配信し、日本語は端末の日本語フォントを使います。',
      '标题及界面说明使用 Geist Sans，代码、令牌和日志使用 Geist Mono。网站直接提供这两种字体，中文使用设备的中文字体。',
    ],
  '01 / SOURCE': ['01 / 소스', '01 / ソース', '01 / 源码'],
  '02 / BUILD': ['02 / 빌드', '02 / ビルド', '02 / 构建'],
  '03 / CONSUME': ['03 / 사용', '03 / 利用', '03 / 使用'],
  'primitive + semantic': [
    '기본 + 의미 기반',
    'プリミティブ + セマンティック',
    '原始 + 语义',
  ],
  'one shared vocabulary': ['하나의 공통 기준', '共通の語彙', '统一约定'],
  'Token / CSS variable': [
    '토큰 / CSS 변수',
    'トークン / CSS 変数',
    '令牌 / CSS 变量',
  ],
  'No matching tokens': [
    '일치하는 토큰이 없습니다',
    '一致するトークンがありません',
    '没有匹配的令牌',
  ],
  'Change once. Update everywhere.': [
    '한 번 수정해 모든 곳에 반영하기',
    '一度の変更で全体に反映',
    '修改一次，全局更新',
  ],
  'Edit tokens/primitive.json and tokens/semantic/light.json or dark.json. Never edit src/generated directly. DTCG $type / $value and aliases keep the source portable.':
    [
      'tokens/primitive.json과 두 테마의 토큰을 수정하세요. src/generated는 자동으로 생성합니다. DTCG 타입, 값, 별칭을 사용합니다.',
      'tokens/primitive.json とテーマのトークンを編集します。src/generated は自動生成されます。DTCG の型、値、エイリアスを使います。',
      '编辑 tokens/primitive.json 和主题令牌。src/generated 由工具自动生成。使用 DTCG 类型、值和别名。',
    ],
  'See published versions on': [
    '게시된 버전 확인:',
    '公開バージョンを確認:',
    '查看已发布版本：',
  ],
  'Clone the': ['복제할 저장소:', 'クローン先:', '克隆地址：'],
  'GitHub repository': ['GitHub 저장소', 'GitHub リポジトリ', 'GitHub 仓库'],
  'Build with Node 24 or later. React 18.3.1 and React 19 are supported peers.':
    [
      'Node 24 이상에서 빌드하세요. React 18.3.1 및 React 19를 지원합니다.',
      'Node 24 以降でビルドします。React 18.3.1 と React 19 に対応します。',
      '请使用 Node 24 或更高版本构建，支持 React 18.3.1 和 React 19。',
    ],
  'Set light or dark on the document or a subtree. Your application owns persistence. Dialog portals inherit the document theme; for a local override, provide a themed container or the theme prop.':
    [
      '문서나 특정 영역에 light 또는 dark를 설정하세요. 테마 저장은 앱에서 처리합니다. Dialog는 문서 테마를 상속하며, 다르게 설정하려면 테마 컨테이너나 theme 속성을 지정하세요.',
      '文書または部分ツリーに light / dark を設定します。永続化はアプリが担当します。Dialog は文書のテーマを継承し、個別指定にはテーマ付きコンテナまたは theme プロパティを使います。',
      '在文档或子树上设置 light 或 dark。持久化由应用负责。Dialog 继承文档主题，如需局部覆盖，请传入带主题的容器或 theme 属性。',
    ],
  'Explore the palette ↗': [
    '팔레트 보기 ↗',
    'パレットを見る ↗',
    '查看调色板 ↗',
  ],
  'Pair a keyboard-operable form with a separate, bounded event history. Keep the event list in chronological order and keep focus on the control the user is operating.':
    [
      '키보드로 조작할 수 있는 폼 옆에 크기가 제한된 이벤트 기록을 두세요. 이벤트는 시간순으로 정렬하고 포커스를 사용 중인 컨트롤에 유지합니다.',
      'キーボード操作できるフォームの横に件数を制限した履歴を置きます。イベントは時系列で並べ、操作中のコントロールにフォーカスを保ちます。',
      '将可用键盘操作的表单与条数有限的事件历史配对。按时间排序，并将焦点保留在当前控件上。',
    ],
  'Use a status message for a completed action. Keep routine focus and key events out of live regions so they do not interrupt screen reader announcements.':
    [
      '완료된 작업은 상태 메시지로 알리세요. 일반적인 포커스·키 이벤트는 라이브 영역에서 제외해 스크린리더 안내가 끊기지 않게 합니다.',
      '操作の完了はステータスメッセージで通知します。通常のフォーカスやキーイベントはライブ領域から除き、読み上げを妨げないようにします。',
      '用状态消息通知操作完成。将常规焦点和按键事件排除在实时区域之外，避免打断屏幕阅读器。',
    ],
  'Choose an event type or limit the list to the selected button. The filters work together and keep the original event list available.':
    [
      '이벤트 종류를 고르거나 선택한 버튼의 이벤트만 표시하세요. 두 필터를 함께 쓸 수 있고 원본 목록은 유지됩니다.',
      'イベントの種類を選ぶか、選択中のボタンに絞り込みます。両条件を組み合わせても元の一覧は保持されます。',
      '选择事件类型，或仅显示所选按钮的事件。两个条件可组合使用，原始列表保持不变。',
    ],
  'Replace the sample events with your own list. Keep the filter values beside the timeline and derive the visible rows from that state.':
    [
      '샘플을 실제 이벤트 목록으로 바꾸세요. 필터 상태를 타임라인과 함께 관리하고 표시할 행을 계산합니다.',
      'サンプルを実際のイベントに差し替えます。フィルターの状態をタイムラインと一緒に管理し、表示する行を算出します。',
      '将示例事件换成自己的列表。将筛选状态与时间线一起管理，并从状态计算可见行。',
    ],
  'The shared design system for Oddmash developer tools.': [
    'Oddmash 개발 도구를 위한 공통 디자인 시스템.',
    'Oddmash の開発ツール向け共通デザインシステム。',
    'Oddmash 开发工具的共享设计系统。',
  ],
  'Install the package and load its styles.': [
    '패키지를 설치하고 스타일을 불러옵니다.',
    'パッケージをインストールし、スタイルを読み込みます。',
    '安装软件包并加载样式。',
  ],
  'Neutral surfaces with distinct focus and error states.': [
    '중립색 표면과 명확한 포커스·오류 상태.',
    '無彩色の面と明確なフォーカス・エラー状態。',
    '中性色表面与清晰的焦点、错误状态。',
  ],
  'Font families, sizes, and line heights.': [
    '글꼴, 크기, 줄 높이를 확인합니다.',
    '書体、文字サイズ、行の高さを確認できます。',
    '查看字体、字号和行高。',
  ],
  'Browse the design tokens and their CSS variables.': [
    '디자인 토큰과 대응하는 CSS 변수를 확인합니다.',
    'デザイントークンと対応する CSS 変数を確認できます。',
    '查看设计令牌及对应的 CSS 变量。',
  ],
  'Compose a form and a live event history for a keyboard-friendly developer tool.':
    [
      '키보드로 사용할 수 있는 폼과 실시간 이벤트 기록을 구성합니다.',
      'キーボードで操作できるフォームとイベント履歴を組み合わせます。',
      '为支持键盘操作的开发工具组合表单和实时事件历史。',
    ],
  'Filter captured events by type and by the selected element.': [
    '이벤트 종류와 선택한 요소를 기준으로 기록을 필터링합니다.',
    'イベントの種類と選択中の要素で記録を絞り込みます。',
    '按类型和所选元素筛选已记录事件。',
  ],
  'Trigger an action or submit a form.': [
    '동작을 실행하거나 폼을 제출합니다.',
    '操作の実行やフォームの送信に使います。',
    '触发操作或提交表单。',
  ],
  'Use one primary action per section. Secondary actions sit alongside it; ghost buttons keep repeated utility actions light.':
    [
      '영역마다 기본 동작은 하나를 두고 보조 동작을 그 옆에 배치하세요.',
      '各セクションに主操作を一つ置き、補助操作を隣に配置します。',
      '每个区域只放一个主操作，并把次要操作放在旁边。',
    ],
  'Use a clear action label. Native disabled blocks interaction. The default type is button; opt into type="submit" for forms. Icon-only buttons need an aria-label.':
    [
      '동작을 설명하는 레이블을 쓰세요. 아이콘만 쓰면 aria-label을 지정하고 폼 제출에는 type="submit"을 사용하세요.',
      '操作を明示し、アイコンだけの場合は aria-label、送信には type="submit" を指定します。',
      '使用清晰的标签。纯图标按钮需设置 aria-label，提交表单时使用 type="submit"。',
    ],
  'Collect a single line of text.': [
    '한 줄의 텍스트를 입력받습니다.',
    '一行のテキストを入力します。',
    '输入单行文本。',
  ],
  'Keep labels visible. Explain constraints before submission and connect error messages to their input.':
    [
      '레이블을 항상 표시하고 제출 전에 입력 조건을 안내하세요.',
      'ラベルを常に表示し、送信前に入力条件を伝えます。',
      '始终显示标签，并在提交前说明输入要求。',
    ],
  'Pair htmlFor and id. Use aria-invalid for errors and aria-describedby for hints. A placeholder is not a replacement for a label.':
    [
      'htmlFor와 id로 연결하세요. 오류에는 aria-invalid, 도움말에는 aria-describedby를 사용합니다.',
      'htmlFor と id で結び付け、エラーには aria-invalid、補足には aria-describedby を使います。',
      '用 htmlFor 和 id 关联标签，错误用 aria-invalid，提示用 aria-describedby。',
    ],
  'Group related content and controls.': [
    '관련 정보와 컨트롤을 한곳에 묶습니다.',
    '関連する情報と操作をまとめます。',
    '归组相关内容和控件。',
  ],
  'Group related content with a subtle boundary. Cards are div elements: add your own heading hierarchy and explicit actions.':
    [
      '연관된 내용과 동작을 묶고 적절한 제목을 추가하세요.',
      '関連する内容と操作をまとめ、適切な見出しを付けます。',
      '组合相关信息和操作，并使用合适的标题。',
    ],
  'Do not make an entire card clickable when it contains other controls. Keep headings in the document outline and use descriptive links.':
    [
      '카드 안에 컨트롤이 있다면 카드 전체를 누르게 만들지 마세요.',
      '内部に操作がある場合、カード全体をクリック対象にしないでください。',
      '卡片中已有控件时，避免令整张卡片可点击。',
    ],
  'Label a status or category.': [
    '상태나 분류를 표시합니다.',
    '状態や分類を示します。',
    '标记状态或分类。',
  ],
  'Describe status or category in a few words. Use semantic tones for meaningful operational states and neutral for unknown or ordinary categories.':
    [
      '상태나 분류를 짧게 표현하세요. 의미 있는 운영 상태에는 의미 기반 색상을, 알 수 없거나 일반적인 분류에는 neutral을 사용하세요.',
      '状態や分類を短く示します。意味のある運用状態にはセマンティックな色調を、不明または通常の分類には neutral を使います。',
      '简短描述状态或分类。对有意义的运行状态使用语义色调，对未知或普通分类使用 neutral。',
    ],
  'Always include meaningful text; color alone should not communicate status. Badge is non-interactive. Use a button for an action.':
    [
      '색상과 함께 의미 있는 텍스트를 제공합니다. 조작에는 버튼을 사용하세요.',
      '色と意味のあるテキストを併用し、操作にはボタンを使います。',
      '同时提供颜色和明确文字，操作使用按钮。',
    ],
  'Switch between panels on the same page.': [
    '같은 페이지 안에서 패널을 전환합니다.',
    '同じページ内でパネルを切り替えます。',
    '在同一页面切换面板。',
  ],
  'Switch between related views, not different destinations. Use links for site navigation. Keep tab names short and distinct.':
    [
      '관련 화면 간 전환에 사용하고 탭 이름은 짧게 유지하세요.',
      '関連するビューに使用し、タブ名は短くします。',
      '用于切换相关视图，并保持标签简短。',
    ],
  'Label TabsList. Arrow keys move between enabled tabs; Home and End jump to the edges. Radix manages selection, focus, and panel relationships.':
    [
      'TabsList에 이름을 붙이세요. 방향키로 이동하고 Home과 End로 양끝에 갈 수 있습니다.',
      'TabsList に名前を付けます。矢印キーで移動し、Home と End で端に移動できます。',
      '为 TabsList 命名。方向键移动，Home 和 End 跳至两端。',
    ],
  'Open a modal for editing or confirmation.': [
    '편집이나 확인을 위한 모달을 엽니다.',
    '編集や確認のためにモーダルを開きます。',
    '打开用于编辑或确认的模态框。',
  ],
  'Use a dialog for a focused task that needs the current page as context. Keep the title specific and provide a clear way to leave.':
    [
      '현재 화면의 맥락이 필요한 작업에 사용하고 닫는 방법을 제공하세요.',
      '現在の画面が文脈となる操作に使い、閉じる手段を用意します。',
      '用于依赖当前页面上下文的操作，并提供关闭方法。',
    ],
  'Include DialogTitle and DialogDescription. Escape closes and restores trigger focus. Focus stays inside while open. Use container for a locally themed portal.':
    [
      'DialogTitle과 DialogDescription을 넣으세요. Escape로 닫으면 포커스가 트리거로 돌아갑니다.',
      'DialogTitle と DialogDescription を付けます。Escape で閉じるとフォーカスが戻ります。',
      '提供 DialogTitle 和 DialogDescription，按 Escape 关闭后焦点回到触发器。',
    ],
  'Collect multiline notes and descriptions.': [
    '여러 줄의 메모와 설명을 받습니다.',
    '複数行のメモや説明を入力します。',
    '输入多行备注或说明。',
  ],
  'Use rows to show the expected amount of text.': [
    '예상 분량에 맞춰 rows를 지정하세요.',
    '想定される長さに合わせて rows を指定します。',
    '根据预计长度设置 rows。',
  ],
  'Keep a persistent label and associate any hint or error with aria-describedby.':
    [
      '레이블을 항상 표시하고 도움말과 오류는 aria-describedby로 연결하세요.',
      'ラベルを表示し、補足やエラーは aria-describedby で関連付けます。',
      '始终显示标签，并用 aria-describedby 关联提示或错误。',
    ],
  'Choose from a compact list of options.': [
    '목록에서 옵션을 선택합니다.',
    '一覧から項目を選びます。',
    '从列表选择一个选项。',
  ],
  'Use Select for a styled single choice. Use the HTML select element for native validation, optgroups, or multiple selection.':
    [
      '단일 선택에는 Select를 사용하세요. 기본 검증, 그룹, 다중 선택에는 HTML select 요소를 사용합니다.',
      '単一選択は Select、標準の検証、グループ、複数選択は HTML select 要素を使います。',
      '单选使用 Select，原生校验、选项分组和多选使用 HTML select 元素。',
    ],
  'Provide a visible label. Use arrow keys to move, type to search by label, Enter to select, and Escape to dismiss.':
    [
      '레이블을 표시하세요. 방향키로 이동하고 글자로 검색하며 Enter로 선택하고 Escape로 닫습니다.',
      'ラベルを表示します。矢印で移動し、文字で検索、Enter で選択、Escape で閉じます。',
      '显示标签。方向键移动，输入字符搜索，Enter 选择，Escape 关闭。',
    ],
  'Enable options independently.': [
    '옵션을 독립적으로 선택합니다.',
    '項目を個別に選択します。',
    '独立选择各个选项。',
  ],
  'Use a checkbox when options can be selected independently or submitted together.':
    [
      '여러 옵션을 각각 켜고 끌 수 있을 때 사용하세요.',
      '複数の項目を個別に選べるときに使います。',
      '适用于可以单独启用或禁用的选项。',
    ],
  'Wrap the checkbox in a label or link the label with htmlFor.': [
    'label로 감싸거나 htmlFor로 연결하세요.',
    'label で囲むか htmlFor で関連付けます。',
    '用 label 包裹或用 htmlFor 关联。',
  ],
  'Choose one option from a group.': [
    '그룹에서 하나를 선택합니다.',
    'グループから一つ選びます。',
    '从一组选项中选择一个。',
  ],
  'Give mutually exclusive options the same name and distinct values.': [
    '같은 name을 쓰고 value는 서로 다르게 지정하세요.',
    'name を揃え、value を別々に指定します。',
    '相同组使用同一个 name 和不同的 value。',
  ],
  'Use a fieldset and legend to announce the group. Arrow keys select within the group.':
    [
      'fieldset과 legend로 그룹 이름을 제공하세요. 방향키로 선택할 수 있습니다.',
      'fieldset と legend でグループを命名します。矢印キーで選択できます。',
      '用 fieldset 和 legend 命名分组，方向键可切换选项。',
    ],
  'Toggle a setting on or off.': [
    '설정을 켜거나 끕니다.',
    '設定のオンとオフを切り替えます。',
    '开启或关闭设置。',
  ],
  'Use a switch for settings that take effect immediately.': [
    '즉시 반영되는 설정에 사용하세요.',
    '即時反映される設定に使います。',
    '用于立即生效的设置。',
  ],
  'Keep the accessible name stable as the value changes. Space toggles the native control.':
    [
      '켜고 꺼도 이름을 유지하세요. Space 키로 전환합니다.',
      '状態が変わっても名前は固定します。Space キーで切り替えます。',
      '状态变化时保持名称不变，按空格切换。',
    ],
  'Group related controls with a shared label.': [
    '관련 컨트롤을 공통 레이블로 묶습니다.',
    '関連コントロールを共有ラベルでまとめます。',
    '使用共享标签组合相关控件。',
  ],
  'Use a fieldset for related controls. Supply an individual label for each control.':
    [
      '관련 입력을 fieldset으로 묶고 각 입력에도 레이블을 주세요.',
      'fieldset でまとめ、各入力にもラベルを付けます。',
      '用 fieldset 分组，并为每个控件提供独立标签。',
    ],
  'The legend names the group. Disabled fieldsets disable their descendant form controls.':
    [
      'legend로 그룹 이름을 제공합니다. 그룹을 비활성화하면 하위 컨트롤도 비활성화됩니다.',
      'legend で名前を付けます。無効なグループの子コントロールも無効になります。',
      'legend 为分组命名，禁用分组时其子控件也会被禁用。',
    ],
  'Surface a status or a problem in context.': [
    '해당 맥락에서 상태나 문제를 알립니다.',
    'その場で状態や問題を伝えます。',
    '在相关场景中提示状态或问题。',
  ],
  'Lead with the outcome and tell the user what they can do next.': [
    '결과를 먼저 알려주고 다음에 할 수 있는 일을 안내하세요.',
    '結果を最初に伝え、次の行動を案内します。',
    '先说明结果，再告诉用户下一步可做什么。',
  ],
  'Include text that describes the state. Use role="alert" for urgent messages added dynamically.':
    [
      '상태를 텍스트로 표시하세요. 동적으로 표시되는 긴급 알림에 role="alert"를 사용합니다.',
      '状態を文で示します。動的な緊急通知には role="alert" を使います。',
      '用文字描述状态，动态出现的紧急提示使用 role="alert"。',
    ],
  'Confirm a completed action in a dismissible notification.': [
    '완료한 작업을 닫을 수 있는 알림으로 확인합니다.',
    '操作の完了を閉じられる通知で伝えます。',
    '以可关闭的通知确认操作完成。',
  ],
  'Mount Toast before the action runs and control its open state. Give each notification a short title.':
    [
      '동작 전 Toast를 렌더링해 두고 open으로 상태를 제어하세요.',
      '操作前から Toast を置き、open で表示を制御します。',
      '操作前渲染 Toast，并使用 open 控制显示。',
    ],
  'Use neutral for confirmations and danger for urgent errors. Keep the dismiss button available and restore focus when it is used.':
    [
      '일반 확인은 neutral, 긴급 오류는 danger를 사용하세요. 닫은 후 포커스를 복원합니다.',
      '確認は neutral、緊急エラーは danger を使い、閉じた後にフォーカスを戻します。',
      '普通确认用 neutral，紧急错误用 danger，关闭后恢复焦点。',
    ],
  'Show completion of an ongoing task.': [
    '진행 중인 작업의 완료 정도를 표시합니다.',
    '進行中の作業の完了度を示します。',
    '显示进行中任务的完成程度。',
  ],
  'Provide value and max for known progress. Omit value when completion cannot be estimated.':
    [
      '진행률을 알면 value와 max를 지정하고, 알 수 없으면 value를 생략하세요.',
      '進捗が分かるときは value と max を指定し、不明なら value を省略します。',
      '进度已知时设置 value 和 max，未知时省略 value。',
    ],
  'Use an accessible name. Show the percentage in visible text when progress is determinate.':
    [
      '접근 가능한 이름을 제공하고 진행률을 알면 퍼센트도 표시하세요.',
      'アクセシブルな名前を付け、進捗が分かるときは比率を表示します。',
      '提供无障碍名称，并在进度已知时显示百分比。',
    ],
  'Show that an action is running.': [
    '작업이 진행 중임을 보여줍니다.',
    '処理中であることを示します。',
    '表示任务正在进行。',
  ],
  'Use a spinner alongside the name of the task, or supply a label for a standalone status.':
    [
      '작업 이름을 옆에 표시하거나 label을 전달하세요.',
      '作業名を隣に表示するか label を指定します。',
      '显示任务名称或传入 label。',
    ],
  'Provide either visible status text or the spinner label. Animation stops when reduced motion is enabled.':
    [
      '화면에 상태를 표시하거나 이름을 제공하세요. 모션 감소 설정에서는 회전하지 않습니다.',
      '表示テキストか名前を用意します。動きの軽減設定では回転を止めます。',
      '提供可见状态文字或标签，减少动态效果时停止旋转。',
    ],
  'Reserve space while content loads.': [
    '콘텐츠가 로드될 공간을 확보합니다.',
    '読み込み中に表示領域を確保します。',
    '在加载时预留内容空间。',
  ],
  'Match the expected layout so loaded content does not shift the surrounding interface.':
    [
      '최종 배치와 크기를 비슷하게 맞추세요.',
      '最終レイアウトと大きさを揃えます。',
      '尽量匹配最终内容的布局和大小。',
    ],
  'Skeleton shapes are decorative. Announce loading separately if the user needs feedback.':
    [
      '모양은 장식이며 필요하면 로딩 상태를 따로 알립니다.',
      '形状は装飾です。必要なら読み込み状態を別途通知します。',
      '形状仅用于装饰，必要时单独通报加载状态。',
    ],
  'Explain why a view has no content.': [
    '내용이 없는 이유를 설명합니다.',
    '内容が空である理由を説明します。',
    '解释视图为何没有内容。',
  ],
  'Name what is missing and include one next action when there is something the user can do.':
    [
      '무엇이 없는지 밝히고 가능한 다음 동작 하나를 안내하세요.',
      '何がないかを示し、可能な次の操作を一つ案内します。',
      '说明缺少什么，并在合适时提供一个后续操作。',
    ],
  'Use a heading appropriate to the page hierarchy and a descriptive action label.':
    [
      '제목 구조를 지키고 구체적인 동작 레이블을 사용하세요.',
      '適切な見出し階層と具体的な操作名を使います。',
      '遵循标题层级，并使用描述性的操作标签。',
    ],
  'Reveal optional details inline.': [
    '필요한 상세 내용을 펼칩니다.',
    '必要な詳細をその場で展開します。',
    '在原位展开可选详情。',
  ],
  'Use one component per disclosure. Keep the summary short and meaningful.': [
    '펼침 영역마다 하나씩 쓰고 제목은 짧게 유지하세요.',
    '開閉領域ごとに一つ使い、見出しは短くします。',
    '每个折叠区域使用一个组件，标题保持简短。',
  ],
  'The summary is keyboard operable natively. Keep interactive elements in the panel body.':
    [
      '제목에서 키보드로 펼칠 수 있습니다. 다른 컨트롤은 본문에 두세요.',
      '見出しはキーボードで操作でき、他のコントロールは本文に置きます。',
      '展开标题可通过键盘操作，其他控件放在正文中。',
    ],
  'Show the current page within a hierarchy.': [
    '계층 구조에서 현재 위치를 보여줍니다.',
    '階層内の現在位置を示します。',
    '显示当前页面在层级中的位置。',
  ],
  'Render list items with links to parent pages. Use aria-current on the current item.':
    [
      '상위 페이지를 링크로 표시하고 현재 항목에 aria-current를 설정하세요.',
      '親ページにリンクを置き、現在の項目に aria-current を設定します。',
      '为上级页面添加链接，并给当前项设置 aria-current。',
    ],
  'Give the landmark a distinct accessible name when the page has multiple navigation regions.':
    [
      '탐색 영역이 여러 개라면 각각 고유한 이름을 지정하세요.',
      'ナビゲーション領域が複数ある場合は個別に名前を付けます。',
      '页面有多个导航区域时请分别命名。',
    ],
  'Move between pages of results.': [
    '여러 결과 페이지를 오갑니다.',
    '結果ページ間を移動します。',
    '在结果页之间切换。',
  ],
  'Use links when each page has a URL. Set aria-current="page" on the active item.':
    [
      'URL이 있는 페이지는 링크로 구성하고 현재 페이지에 aria-current="page"를 씁니다.',
      'URL がある場合はリンクを使い、現在ページに aria-current="page" を付けます。',
      '有独立 URL 时使用链接，当前页设置 aria-current="page"。',
    ],
  'Label page links and omit or disable unavailable previous and next actions.':
    [
      '페이지 링크를 설명하고 이동할 수 없는 동작은 비활성화하세요.',
      'リンクに名前を付け、移動できない操作は無効にします。',
      '为链接命名，并禁用无法执行的翻页操作。',
    ],
  'Identify people with an image or initials.': [
    '이미지나 이니셜로 사람을 표시합니다.',
    '画像またはイニシャルで人物を示します。',
    '用图片或姓名首字母标识用户。',
  ],
  'Pass initials as children. They stay visible until the image loads and serve as a fallback.':
    [
      '이니셜을 자식으로 전달하면 이미지가 준비되기 전이나 실패 시 표시합니다.',
      'イニシャルを子要素にすると画像の読み込み前と失敗時に表示します。',
      '将首字母作为子元素，图片加载前和失败时会显示。',
    ],
  'Supply label when the avatar carries identity. Omit it when adjacent text already names the person.':
    [
      '이름이 다른 곳에 없다면 label을 전달하세요.',
      '他に名前が表示されない場合は label を指定します。',
      '附近没有姓名时，请设置 label。',
    ],
  'Mark a thematic break in a view.': [
    '화면에서 주제가 바뀌는 지점을 표시합니다.',
    '画面の話題の区切りを示します。',
    '标记内容主题之间的分隔。',
  ],
  'Use a separator between related sections with different purposes.': [
    '목적이 다른 영역 사이에 배치하세요.',
    '目的の異なる領域の間に配置します。',
    '放在用途不同的区域之间。',
  ],
  'Use an hr for meaningful separation. Set aria-hidden for a purely decorative line.':
    [
      '의미 있는 구분에는 hr을 쓰고 장식이라면 aria-hidden을 지정하세요.',
      '意味のある区切りには hr を使い、装飾なら aria-hidden を指定します。',
      '用 hr 表示有意义的分隔，纯装饰时设置 aria-hidden。',
    ],
  'Compare structured data by row and column.': [
    '행과 열로 구조화된 데이터를 비교합니다.',
    '行と列で構造化データを比較します。',
    '按行和列比较结构化数据。',
  ],
  'Use native table sections. Wrap wide tables in a scrollable region when needed.':
    [
      '기본 테이블 요소를 사용하고 폭이 넓으면 스크롤 영역을 제공하세요.',
      '標準のテーブル要素を使い、幅が広ければスクロール領域を用意します。',
      '使用原生表格元素，宽表格放入可滚动区域。',
    ],
  'Give the table a caption and use scope on its column or row headers.': [
    'caption으로 이름을 지정하고 헤더에는 scope를 주세요.',
    'caption で名前を付け、見出しに scope を指定します。',
    '用 caption 命名表格，并为表头设置 scope。',
  ],
  'Reset demo': ['데모 초기화', 'デモをリセット', '重置演示'],
  'Show loading state': [
    '로딩 상태 보기',
    '読み込み状態を表示',
    '显示加载状态',
  ],
  'Dialog controls state. Put native attributes, className, style, and refs on DialogContent or the other rendered parts.':
    [
      'Dialog가 상태를 관리합니다. 기본 속성, className, style, ref는 DialogContent 등 렌더링되는 요소에 전달하세요.',
      'Dialog が状態を管理します。ネイティブ属性、className、style、ref は DialogContent などの描画要素に渡します。',
      'Dialog 管理状态。将原生属性、className、style 和 ref 传给 DialogContent 等渲染元素。',
    ],
  'Native attributes, className, style, and refs pass through to the underlying element.':
    [
      '기본 속성, className, style, ref는 내부 DOM 요소에 전달됩니다.',
      'ネイティブ属性、className、style、ref は内部 DOM 要素に渡されます。',
      '原生属性、className、style 和 ref 会传给底层 DOM 元素。',
    ],
};
