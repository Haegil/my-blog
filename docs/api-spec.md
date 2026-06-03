# MemoStack API 명세

기본 경로: `/api`

인증은 HTTP-only 세션 쿠키를 사용한다. 게시글 생성, 수정, 삭제 API는 관리자 세션이 필요하다.

## 상태 확인

### GET `/health`

API 서버 상태를 반환한다.

응답 `200`:

```json
{
  "status": "OK",
  "message": "MemoStack API Server is healthy."
}
```

## 인증

### POST `/auth/login`

관리자 세션을 생성한다.

요청:

```json
{
  "username": "admin",
  "password": "admin1234"
}
```

### POST `/auth/logout`

현재 세션을 제거하고 세션 쿠키를 삭제한다.

### GET `/auth/check`

현재 세션의 인증 여부를 확인한다.

응답 `200`:

```json
{
  "authenticated": true,
  "user": {
    "id": 1,
    "username": "admin"
  }
}
```

## 게시글

### GET `/posts`

게시글 목록을 반환한다. 검색, 태그 필터링, 페이지네이션을 지원한다.

쿼리 파라미터:

- `q`: 제목/본문 검색어. `#`로 시작하면 태그 검색으로 처리한다.
- `tag`: 정확히 일치하는 태그 이름으로 필터링한다.
- `page`: 1부터 시작하는 페이지 번호.
- `limit`: 페이지당 게시글 수.
- `from`: `YYYY-MM-DD` 형식의 작성일 시작 범위.
- `to`: `YYYY-MM-DD` 형식의 작성일 종료 범위. 해당 날짜의 끝까지 포함한다.

페이지네이션 응답:

```json
{
  "posts": [],
  "totalCount": 0
}
```

### GET `/posts/:id`

ID에 해당하는 게시글 하나를 반환한다.

### POST `/posts`

관리자 세션이 필요하다. 새 게시글을 생성한다.

요청:

```json
{
  "title": "게시글 제목",
  "content": "마크다운 본문",
  "tags": ["react", "express"]
}
```

### PATCH `/posts/:id`

관리자 세션이 필요하다. 게시글을 수정하고 태그 목록을 새 값으로 교체한다.

### DELETE `/posts/:id`

관리자 세션이 필요하다. 게시글을 삭제한다.

## 태그

### GET `/tags`

모든 태그와 각 태그에 연결된 게시글 수를 반환한다.

```json
[
  {
    "id": 1,
    "name": "react",
    "count": 3
  }
]
```
