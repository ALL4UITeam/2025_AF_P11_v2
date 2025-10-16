# 📘 Vite Full Template (with Handlebars)

## 🔥 개요
이 프로젝트는 **Vite + Handlebars** 기반으로 만든 정적 템플릿 빌드 환경이다.  

- 레이아웃(`layouts/`) 지원 → `@layout` 주석으로 페이지별 레이아웃 지정  
- Partials(`partials/`), Components(`components/`) 분리 관리  
- `pageData.json` + 자동 수집 하이브리드 방식으로 페이지별 데이터 주입  
- 빌드시 `index.html`에 전체 페이지 목록 자동 생성  

---

## 📂 프로젝트 구조
```
src/
 ├ layouts/             # 레이아웃 파일
 │   ├ main.html
 │   └ sub.html
 ├ partials/            # 공통 UI 조각
 │   ├ Header.html
 │   ├ Footer.html
 │   ├ Banner.html
 │   └ Breadcrumb.html
 ├ components/          # 재사용 UI 컴포넌트
 │   ├ Modal.html
 │   └ Pagination.html
 ├ pageData.json        # 페이지별 데이터 (제목, 배너, breadcrumb 등)
 ├ index.html           # 페이지 목록 (자동 생성됨)
 └ about.html           # 예시 서브 페이지
vite.config.mjs
```

---

## ⚙️ vite.config.mjs 핵심

- **pageData.json** → 페이지별 추가 데이터 (title, banner, breadcrumb, created, updated 등)  
- **자동 수집 + 덮어쓰기** → `src/*.html` 파일을 전부 읽고, pageData.json에 정의된 값이 있으면 그걸로 덮어씀  
- **applyLayoutPlugin** → 페이지 본문을 레이아웃(`{{{body}}}`)에 주입  
- **Handlebars 플러그인** → Partials(`partials/`), Components(`components/`) 치환

---

## 📝 HTML 페이지 작성법

### 1) 레이아웃 지정
각 페이지 최상단에 `@layout` 주석을 달아준다.

```html
<!-- @layout layouts/main.html -->
<!-- @pageTitle 홈 -->
<section class="home">
  <h2>홈 컨텐츠</h2>
</section>
```

```html
<!-- @layout layouts/sub.html -->
<!-- @pageTitle 회사 소개 -->
<section class="about">
  <h2>회사 소개</h2>
</section>
```

### 2) Partials 사용
`src/partials/` 안의 파일은 `{{> Header}}`, `{{> Footer}}`처럼 불러올 수 있다.

```html
<body>
  {{> Header }}
  <main>
    {{{body}}}
  </main>
  {{> Footer }}
</body>
```

### 3) Components 사용
`src/components/` 안의 파일은 재사용 UI 컴포넌트로 관리.

```html
{{> Modal title="알림" message="내용입니다." }}
```

---

## 📘 pageData.json

페이지별로 추가 데이터가 필요할 때 정의한다.  
없으면 자동 수집된 값이 쓰인다.

```json
{
  "about.html": {
    "title": "회사 소개",
    "banner": { "title": "회사 소개 배너", "subtitle": "우리는..." },
    "breadcrumb": [
      { "href": "/", "label": "홈" },
      { "label": "회사 소개" }
    ],
    "note": "회사 설명 페이지",
    "created": "2025-01-01",
    "updated": "2025-02-15"
  }
}
```

---

## 📑 index.html (자동 생성 페이지 목록)

`index.html`에는 빌드시 전체 페이지 목록이 자동으로 출력된다.  

검색 기능이 포함되어 있으며, `pageData.json`에서 내려준 `title`, `created`, `updated`, `note` 값도 함께 표시된다.

```html
<tbody>
  {{#each pages}}
  <tr>
    <td><a href="./{{name}}" target="_blank">{{name}}</a></td>
    <td>{{title}}</td>
    <td>{{created}}</td>
    <td>{{updated}}</td>
    <td>{{note}}</td>
  </tr>
  {{/each}}
</tbody>
```

---

## 🚀 사용법

### 1. 설치
```bash
npm install
```

### 2. 개발 서버 실행
```bash
npm run dev
```
- `http://localhost:5173` 접속

### 3. 빌드
```bash
npm run build
```
- 결과물은 `dist/`에 생성됨
- `index.html`에 전체 페이지 목록 자동 생성

### 4. 배포 (GitHub Pages)
```bash
npm run deploy
```

---

## ✅ 요약
- **자동 수집**: 파일 추가만 해도 index에 반영  
- **세부 제어**: `pageData.json`에서 제목/배너/브레드크럼프/날짜 관리 가능  
- **레이아웃**: `@layout` 주석으로 main/sub 구분  
- **partials/components**: UI 조각 단위 재사용 가능  
