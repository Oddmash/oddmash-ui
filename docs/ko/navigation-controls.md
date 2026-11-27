# 문서 탐색 컨트롤

SiteHeader, SiteNav, Prose와 함께 사용하는 중립적인 컨트롤입니다. 제품별 라우팅, 번역, 문서 데이터, 브랜드와 레이아웃은 제품에서 관리합니다.

[English](../navigation-controls.md) · [日本語](../ja/navigation-controls.md) · [简体中文](../zh-CN/navigation-controls.md)

## 문서 탐색

`DocsNavigation`은 그룹으로 분류된 기본 링크를 렌더링합니다. 탐색 영역의 접근 가능한 이름과 안정적인 항목 ID를 전달하세요. `currentId`에 해당하는 링크는 현재 페이지로 표시됩니다. 현지화한 `mobileLabel`을 전달하면 48rem 이하에서 펼침 버튼을 사용할 수 있습니다. 하이드레이션 전과 데스크톱에서는 링크를 그대로 볼 수 있습니다.

```tsx
import { DocsNavigation } from '@oddmash/ui/docs-navigation';

<DocsNavigation aria-label="문서" mobileLabel="문서 탐색"
  currentId="guide" groups={[{ id: 'start', label: '시작하기', items: [
    { id: 'guide', label: '사용 가이드', href: '/ko/docs/guide' },
    { id: 'api', label: 'API', href: '/ko/docs/api' },
  ] }]} />
```

제품에서 이동을 직접 처리할 때만 `onNavigate(item, event)`를 사용하세요. 보조 키 클릭과 기본 링크 동작을 위해 실제 href를 유지하세요.

## 목차

`TableOfContents`에는 제목 ID, 레이블, 선택적인 제목 깊이와 본문 영역의 `contentId`를 전달합니다. 창 스크롤, 크기 변경 및 해시 변경을 추적하여 현재 링크에 `aria-current="location"`을 지정합니다. 제어된 상태에는 `activeId`(명시적인 null 포함)를 사용하세요. 정적 HTML은 `observeActiveHeading(content, ids, onActiveChange, { offset })`을 사용하고 반환된 정리 함수를 호출할 수 있습니다.

고정 헤더를 고려하려면 `offset`을 설정하세요. 제목에는 실제 이동 ID를 유지하고, 모바일 선택 후 제목으로 포커스를 이동하려면 `tabIndex={-1}`을 지정하세요.

## 스크롤 헤더

고정 헤더가 스크롤에 반응하도록 하려면 SiteHeader 대신 `ScrollHeader`를 사용하세요. 아래로 24px 움직이면 숨고, 위로 8px 움직이거나 화면 상단에 도달하면 다시 보입니다. 키보드 포커스, 열린 하위 컨트롤, `locked` 상태에서는 헤더를 유지합니다. `media="(max-width: 720px)"`처럼 동작 범위를 제한할 수 있습니다. 동작 줄이기 설정에서는 헤더가 계속 표시됩니다.

정적 HTML에 `om-site-header om-scroll-header` 클래스를 지정하고 `observeScrollHeader(element, options)`를 연결할 수 있습니다. 헤더가 제거되면 정리 함수를 호출하세요. 향상 스크립트가 없어도 헤더는 표시됩니다.

## 언어 선택기

`LocalePicker`는 Select에 SSR용 details 및 링크 대체 경로를 조합합니다. 현지화한 컨트롤 레이블, 각 언어의 자체 이름, `lang`, 현재 문서에 대응하는 실제 href를 전달하세요.

```tsx
import { LocalePicker } from '@oddmash/ui/locale-picker';

<LocalePicker label="언어" value="ko" options={[
  { value: 'en', label: 'English', lang: 'en', href: '/en/docs' },
  { value: 'ko', label: '한국어', lang: 'ko', href: '/ko/docs' },
]} />
```

선택하면 기본적으로 전달된 href로 이동합니다. 제어된 `onValueChange(value, option)`으로 제품의 라우팅을 대신 처리할 수 있습니다. 언어 경로 추론, 문서 언어 변경 또는 환경 설정 저장은 수행하지 않습니다.
