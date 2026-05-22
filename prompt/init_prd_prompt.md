당신은 한국의 시니어 시니어 풀스택 개발자이자 프로덕트 디자이너입니다.
한국의 기술 트렌드와 감성에 맞는 실서비스 수준의 MVP를 개발해주세요.

---

# 프로젝트 정보

- 프로젝트 이름: MemoStack
- 한 줄 설명: 개인 지식과 개발 기록을 빠르게 저장하고 쉽게 다시 찾을 수 있는 개인 저장형 블로그
- 해결하려는 문제:
  - 기존 블로그는 발행 중심이라 기록 속도가 느림
  - 메모 앱은 검색과 구조화 기능이 부족함
  - 개발 기록/공부 기록을 체계적으로 관리하기 어려움
- 주요 타겟 사용자:
  - 개발자
  - 공부 기록 사용자
  - 개인 위키 사용자
  - Obsidian 스타일 기록을 원하는 사용자
- 핵심 가치:
  - 빠른 기록
  - 빠른 검색
  - 단순한 구조
  - 유지보수 용이성
  - 실서비스 수준 UX

---

# 핵심 기능

1. 게시글 CRUD
   - 글 작성
   - 수정
   - 삭제
   - 상세 조회

2. Markdown 에디터
   - 실시간 미리보기
   - 코드 하이라이팅
   - 자동 저장

3. 태그 시스템
   - 다중 태그
   - 태그별 글 목록

4. 전체 검색
   - 제목 검색
   - 본문 검색
   - 태그 검색

5. 관리자 인증
   - 단일 관리자 로그인
   - 관리자 페이지 보호

---

# 기술 스택

- 프론트엔드:
  - Vite
  - React (최신 버전)
  - JavaScript
  - React Router
  - TailwindCSS (4버전 이상)
  - Material UI (Material Design 3 기반)

- 백엔드:
  - Express.js
  - Node.js

- 데이터베이스:
  - Oracle Database

- 인증:
  - Session 기반 인증
  - express-session

- 전역 상태 관리:
  - Redux Toolkit

- 배포:
  - Vercel (Frontend)
  - Render 또는 EC2 (Backend)

- 기타 사용 라이브러리:
  - React Markdown
  - React Hook Form
  - Zod
  - Redux Toolkit
  - Axios
  - highlight.js

---

# JWT 사용 여부 판단

## 결론
이번 MVP에서는 JWT를 사용하지 않음.

## 이유

현재 서비스 구조상:
- 로그인 사용자는 본인 1명
- 외부 사용자 인증 없음
- 멀티 디바이스 세션 관리 불필요
- OAuth 불필요
- 모바일 앱 연동 없음

따라서 JWT 기반 인증보다:

- express-session
- HttpOnly Cookie

조합이 더 단순하고 안정적임.

## 선택 이유

### Session 기반 인증 장점
- 구현 단순
- 보안 설정 쉬움
- 토큰 만료 관리 불필요
- 로그아웃 처리 간단
- 서버에서 인증 상태 직접 관리 가능

## 추후 JWT 전환 시점

다음 조건이 생기면 JWT 고려:
- 다중 사용자
- 모바일 앱 연동
- 외부 API 제공
- OAuth 로그인
- 마이크로서비스 구조

---

# UI/UX 스타일

- 원하는 분위기:
  - 미니멀
  - 집중형
  - 개발자 친화적
  - 빠른 인터랙션

- 참고 서비스:
  - Obsidian
  - Notion
  - Medium

- 컬러 스타일:
  - Neutral 기반
  - Gray + Indigo 포인트

- 디자인 시스템:
  - Material Design 3 기반 버튼 사용
  - Rounded UI
  - 명확한 Elevation 사용

- 모바일 우선 여부:
  - YES

- 다크모드 여부:
  - YES

---

# 개발 요구사항

- 타입 안정성 최대한 유지
- 유지보수 쉬운 구조
- 재사용 가능한 컴포넌트 설계
- 에러 처리 포함
- 로딩 상태 처리
- 빈 상태 처리
- 반응형 디자인 적용
- 접근성 고려

---

# 코드 스타일 요구사항

- 함수는 짧고 명확하게 작성
- 불필요한 추상화 금지
- 주석은 꼭 필요한 경우만 작성
- 기존 컨벤션 유지
- 하드코딩 최소화

---

# 작업 방식

다음 순서로 진행합니다.

1. 전체 아키텍처 설명
2. 폴더 구조 제안
3. 필요한 패키지 설명
4. 기능 단위 단계별 구현
5. 각 단계별 설명 포함

---

# 전체 아키텍처 설명

```txt
Frontend
 └─ React
     ├─ React Router
     ├─ Redux Toolkit
     ├─ TailwindCSS
     └─ Material UI

Backend
 └─ Express.js
     ├─ REST API
     ├─ Session Auth
     └─ Service Layer

Database
 └─ Oracle Database
```

---

# 아키텍처 선택 이유

## React + React Router
- 라우팅 구조 단순
- 자유도 높음
- 유지보수 쉬움
- SPA 구현 최적화

## Express.js
- 가볍고 단순함
- 커스터마이징 쉬움
- MVP 구현 속도 빠름

## Oracle Database
- 안정성 높음
- 기업형 DB 경험 가능
- 대용량 데이터 처리 강점

## Redux Toolkit
- 전역 상태 관리 최소 비용
- 보일러플레이트 감소
- 유지보수성 우수

---

# 폴더 구조 제안

```txt
frontend/
├─ src/
│  ├─ api/
│  ├─ assets/
│  ├─ components/
│  │  ├─ common/
│  │  ├─ editor/
│  │  ├─ layout/
│  │  └─ ui/
│  │
│  ├─ features/
│  │  ├─ auth/
│  │  ├─ posts/
│  │  ├─ tags/
│  │  └─ search/
│  │
│  ├─ hooks/
│  ├─ layouts/
│  ├─ pages/
│  ├─ router/
│  ├─ store/
│  ├─ styles/
│  ├─ utils/
│  └─ App.jsx
│
backend/
├─ src/
│  ├─ config/
│  ├─ controllers/
│  ├─ middlewares/
│  ├─ routes/
│  ├─ services/
│  ├─ repositories/
│  ├─ db/
│  ├─ utils/
│  └─ server.js
```

---

# 필요한 패키지 설명

## Frontend

```bash
npm install react-router-dom
npm install @reduxjs/toolkit react-redux
npm install axios
npm install react-hook-form
npm install zod
npm install react-markdown
npm install highlight.js
npm install @mui/material
npm install @emotion/react
npm install @emotion/styled
```

---

## Backend

```bash
npm install express
npm install cors
npm install dotenv
npm install express-session
npm install bcrypt
npm install oracledb
npm install zod
```

---

# 기능 단위 단계별 구현

---

# STEP 1. 프로젝트 초기 세팅

## 목표
- React 프로젝트 생성
- Tailwind 설정
- Express 서버 생성
- Oracle 연결
- 기본 레이아웃 구성

---

## Frontend 생성

```bash
npm create vite@latest frontend
```

---

## Backend 생성

```bash
mkdir backend
cd backend
npm init -y
```

---

# STEP 2. 인증 구현

## 목표
- 단일 관리자 로그인
- 세션 인증
- 관리자 페이지 보호

---

## 인증 방식

```txt
Client
  ↓
Session Login
  ↓
Express Session
  ↓
HttpOnly Cookie
```

---

## Middleware 예시

```js
export const authMiddleware = (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).json({
      message: "Unauthorized",
    })
  }

  next()
}
```

---

# STEP 3. 게시글 CRUD

## 목표
- 작성
- 수정
- 삭제
- 상세 조회

---

## API 구조

```txt
GET    /posts
GET    /posts/:id
POST   /posts
PATCH  /posts/:id
DELETE /posts/:id
```

---

## Service Layer 구조

```txt
Controller
   ↓
Service
   ↓
Repository
   ↓
Oracle DB
```

---

# STEP 4. Markdown 에디터

## 목표
- 실시간 편집
- 코드 블록
- 미리보기

---

## 구조

```txt
Editor
 ├─ Toolbar
 ├─ MarkdownInput
 └─ Preview
```

---

## 자동 저장

```js
useDebounce(saveDraft, 1000)
```

---

# STEP 5. 검색 기능

## 목표
- 빠른 검색
- 태그 검색

---

## 검색 전략

### MVP
- Oracle LIKE 기반 검색

### 추후 확장
- Oracle Full Text Search

---

# STEP 6. 태그 시스템

## 목표
- 태그 연결
- 태그 페이지

---

## UI 예시

```txt
#react
#oracle
#express
```

---

# STEP 7. UI/UX 개선

## Material 3 버튼 적용

```jsx
<Button variant="contained">
  저장하기
</Button>
```

---

## Skeleton UI

```jsx
<Skeleton variant="rounded" />
```

---

## Empty State

```jsx
<EmptyState
  title="아직 글이 없습니다"
/>
```

---

# 데이터 흐름 설계

```txt
Client
   ↓
React Query / Redux
   ↓
Express API
   ↓
Service Layer
   ↓
Repository
   ↓
Oracle DB
```

---

# 상태 관리 전략

## 기본 전략
전역 상태 최소화

## 사용 범위

### Redux Toolkit 사용 대상
- 로그인 상태
- 사용자 정보
- 검색 상태
- 테마 상태

### 로컬 상태 사용 대상
- 입력값
- 모달
- UI 상태

---

# API 설계 원칙

## REST API 기반 설계

### 예시

```txt
/api/posts
/api/tags
/api/auth
```

---

# 환경 변수 예시

## frontend/.env

```env
VITE_API_URL=http://localhost:5000
```

---

## backend/.env

```env
PORT=5000

SESSION_SECRET=

ORACLE_USER=
ORACLE_PASSWORD=
ORACLE_CONNECTION_STRING=
```

---

# 실행 방법

## Frontend

```bash
npm run dev
```

---

## Backend

```bash
npm run start
```

---

# 배포 방법

## Frontend
- Vercel 배포

## Backend
- Render
- EC2
- Oracle Cloud VM

---

# 향후 개선 포인트

## HIGH Priority

### 1. Draft 시스템
- 자동 임시 저장 강화

### 2. 이미지 업로드
- S3
- Cloudflare R2

### 3. Full Text Search
- Oracle Text Search

### 4. 백링크 기능
- 문서 간 연결

### 5. AI 기능
- 태그 추천
- 글 요약
- 자연어 검색

---

# MVP 개발 우선순위

## LEVEL-1
- 프로젝트 세팅
- 인증
- CRUD

---

## LEVEL-2
- Markdown
- 태그
- 검색

---

## LEVEL-3
- UX 개선
- 반응형
- 배포

---

# 최종 결과물

- 전체 코드
- 실행 방법
- 환경변수 예시
- 배포 방법
- 향후 개선 포인트

---

# 추천 MVP 철학

이 프로젝트에서 중요한 것은:
- 예쁘게 만드는 것보다
- 매일 기록하게 만드는 것

입니다.

MVP 단계에서는:
- 빠른 작성
- 빠른 검색
- 안정적인 저장

여기에 집중합니다.

# 프로젝트 생성 도중 주의할 점
- LEVEL에 따라 천천히 진행하되, 어떤 LEVEL의 단계를 하려고 하기 전 미리 준비해야할 것들이 있다면 잠시 멈추고 준비할 수 있도록 사항을 나열할 것.(예시: Oracle DB의 테이블이 사전에 필요할 경우, 테이블 쿼리문을 작성하여 제공할 것.)

# 반드시 지켜야 할 규칙

- TODO 남기지 말 것
- 임시 mock 로직 남기지 말 것
- 의미 없는 주석 금지
- any 타입 남용 금지
- 하드코딩 최소화
- 에러 처리 생략 금지
- 로딩 상태 생략 금지
- 빈 상태 화면 생략 금지
- 함수 하나에 역할 하나만 부여
- 파일 책임 명확하게 유지
- 불필요한 라이브러리 추가 금지
