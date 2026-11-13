# Oddmash UI

[English](https://github.com/Oddmash/oddmash-ui#readme) · [한국어](https://github.com/Oddmash/oddmash-ui/blob/main/docs/ko/README.md) · [日本語](https://github.com/Oddmash/oddmash-ui/blob/main/docs/ja/README.md) · [简体中文](https://github.com/Oddmash/oddmash-ui/blob/main/docs/zh-CN/README.md)

Oddmash UI는 작은 React 개발 도구에 일관된 기본 UI를 제공합니다. Interaction Inspector 설정 패널처럼 새 도구를 만들 때 6개 컴포넌트와 CSS 하나로 시작할 수 있습니다. **Design less. Build more.**

## 빠른 시작

아래 화면은 샘플 프로젝트 데이터를 사용하는 실제 구현입니다. [라이브 데모](https://oddmash.github.io/oddmash-ui/)와 [Storybook](https://oddmash.github.io/oddmash-ui/storybook/)을 바로 사용해 보세요. main에 변경을 push하면 GitHub Actions가 둘 다 빌드하고 자동 배포합니다. 로컬 실행 명령은 아래와 같습니다.

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

## 다른 프로젝트에서 사용

빌드에는 Node 24 이상이 필요하고 React 18.3.1 및 React 19를 peer로 지원합니다. npm에는 아직 게시하지 않았습니다. 여기서 `npm pack`을 실행한 뒤 소비 프로젝트에서 `npm install /absolute/path/to/oddmash-ui-0.1.0.tgz`로 설치하세요. 스타일은 한 번 가져옵니다. ESM 전용이며 Tailwind, 아이콘 패키지, CSS-in-JS 런타임, 전역 reset이 없습니다.

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

## API와 접근성

Button은 `variant="primary|secondary|ghost"`, `size="sm|md"`, 네이티브 속성·ref를 지원하고 기본 type은 button입니다. Input, Card(div), Badge(span, `tone="neutral|accent"`)는 네이티브 속성·ref·className·style을 전달합니다. Tabs/Dialog는 Radix의 제어/비제어 API를 유지합니다. Tabs는 방향키·Home/End·비활성 항목을, Dialog는 Escape·포커스 가두기·트리거 복원을 지원합니다. Input에 보이는 label을 제공하고 오류 설명은 aria-describedby로 연결하세요. 오류는 aria-invalid로 표시하고 DialogTitle/Description을 제공하세요. 인터랙티브 요소를 중첩하지 마세요. 동작 줄이기와 강제 색상을 지원합니다. axe 자동 검사는 스크린리더 수동 검증을 대체하지 않습니다.

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

## 토큰 구조와 빌드 선택

JSON만 토큰 원본입니다. Primitive는 팔레트와 척도, semantic은 light/dark별 역할을 정의합니다. 색상·간격·글꼴·모서리·테두리·그림자·모션에 DTCG $type/$value, 구조화된 sRGB 색상/치수, alias를 사용합니다. 테마는 독자 modes 확장 대신 별도 파일로 구분합니다. Style Dictionary 5의 DTCG 지원·참조 해결·CSS 변환을 이용해 색상/복합 토큰 변환기를 직접 유지하지 않습니다. 빌드 시 개발 의존성으로만 사용합니다. 작은 TypeScript 빌드 스크립트가 CSS와 타입이 있는 변수 참조를 생성하고 깨진 참조·테마 키 불일치·오래된 생성물을 거절합니다. src/generated와 dist를 직접 수정하지 마세요. SCSS에서는 CSS 변수를 그대로 사용하며 중복 SCSS 값 테이블은 없습니다.

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

## 테마와 커스터마이징

기본 테마는 light입니다. html 또는 하위 영역에 data-om-theme="light"/"dark"를 지정하세요. 시스템 설정 감지와 저장은 앱 책임입니다. override는 패키지 CSS 다음에 로드하세요. 장기적으로 관리할 브랜드 값은 프로젝트 JSON에 저장하고 CSS로 생성하세요(Inspector 연결 참고). 아래 직접 작성한 CSS는 설명용이며 별도 원본이 아닙니다. 지역 커스터마이징에는 semantic 토큰을 재정의하세요. primitive와 semantic alias 식은 각 테마 경계에서 함께 생성됩니다. Dialog는 body로 포털되므로 부분 테마일 때 theme를 명시하고, 커스텀 브랜드는 해당 영역 내부 container를 제공하세요. Shadow DOM에서는 내부에 CSS를 주입하고 내부 포털 container를 제공해야 하며, 닫힌 Shadow DOM의 modal 동작은 이번 MVP의 검증 범위가 아닙니다.

```scss
.my-tool {
  --om-semantic-color-accent: #087c66;
  --om-semantic-color-accent-hover: #066451;
  --om-semantic-color-on-accent: #ffffff;
  --om-semantic-radius-sm: 4px;
}
```

## 개발과 기여

CI는 React 18/19 및 대응 타입 패키지로 타입·lint·테스트·토큰 일치·패키지/Storybook/데모 빌드·3개 브라우저 테스트를 실행합니다. 아래 명령으로 확인하세요. JSON을 수정한 뒤 생성물도 함께 커밋하고 API 변경에는 동작 테스트를 추가하세요. 4개 언어 README·링크·스크린샷을 동기화하세요. 조직 기여 정책을 따르며 여러 프로젝트에 영향을 주는 API는 먼저 이슈로 논의하세요. npm 게시는 소유자의 별도 릴리스 승인과 scope 권한 확인이 필요합니다.

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

## 범위와 실사용 연결

v0는 6개 컴포넌트 계열로 제한합니다. Select·Toast·폼 프레임워크·테마 provider·폰트 다운로드는 포함하지 않습니다. Inspector는 프로젝트 JSON override로 기존의 조밀한 다크 외형을 유지하며 Button을 도입합니다. 기록·개인정보·권한 동작은 변경하지 않습니다. 연결 브랜치와 검증 결과는 docs/VERIFICATION.md에 기록합니다. 다음 단계는 보조기술 수동 검증, 릴리스 담당자 결정, 실제 사용에 따른 확장입니다.

MIT. [Style Dictionary](https://styledictionary.com/reference/config/) · [Radix Dialog](https://www.radix-ui.com/primitives/docs/components/dialog) · [Contribution policy](https://github.com/Oddmash/.github/blob/main/CONTRIBUTING.md)
