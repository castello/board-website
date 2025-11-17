# Vercel 배포 가이드

이 프로젝트를 Vercel에 배포하는 방법입니다.

## 1. GitHub 저장소 준비

코드가 이미 GitHub에 올라가 있습니다:
https://github.com/castello/board-website

## 2. Vercel 계정 준비

1. [Vercel](https://vercel.com)에 접속
2. GitHub 계정으로 로그인

## 3. 프로젝트 Import

1. Vercel 대시보드에서 "Add New..." → "Project" 클릭
2. GitHub 저장소에서 `board-website` 선택
3. "Import" 클릭

## 4. Vercel Postgres 데이터베이스 추가

### 방법 1: 프로젝트 설정 중 추가
1. Import 화면에서 "Storage" 탭 클릭
2. "Create Database" 클릭
3. "Postgres" 선택
4. 데이터베이스 이름 입력 (예: board-db)
5. "Create" 클릭

### 방법 2: 배포 후 추가
1. Vercel 대시보드에서 프로젝트 선택
2. "Storage" 탭 클릭
3. "Connect Store" → "Create New" → "Postgres" 선택
4. 데이터베이스 이름 입력 후 생성

## 5. 환경 변수 자동 설정

Vercel Postgres를 추가하면 다음 환경 변수가 자동으로 설정됩니다:
- `POSTGRES_URL`
- `POSTGRES_PRISMA_URL`
- `POSTGRES_URL_NON_POOLING`

## 6. 환경 변수 매핑

Vercel 대시보드에서 "Settings" → "Environment Variables"로 이동하여 다음을 추가:

```
DATABASE_URL = $POSTGRES_PRISMA_URL
DIRECT_URL = $POSTGRES_URL_NON_POOLING
```

## 7. 데이터베이스 마이그레이션

배포 후 처음 한 번만 실행:

### 옵션 1: Vercel CLI 사용
```bash
# Vercel CLI 설치
npm i -g vercel

# 로그인
vercel login

# 프로젝트 연결
vercel link

# 환경 변수 가져오기
vercel env pull

# 마이그레이션 실행
npx prisma migrate deploy
```

### 옵션 2: Vercel 대시보드 사용
1. 프로젝트 → "Settings" → "Functions"
2. Serverless Function에서 다음 명령 실행:
```bash
npx prisma migrate deploy
```

## 8. 배포 완료

배포가 완료되면 Vercel이 제공하는 URL로 접속할 수 있습니다.
예: `https://board-website.vercel.app`

## 로컬 개발 시 주의사항

로컬에서는 SQLite 대신 PostgreSQL을 사용해야 합니다:

1. 로컬 PostgreSQL 설치 또는 Vercel Postgres 사용
2. `.env` 파일에 데이터베이스 URL 설정:
```bash
# Vercel Postgres 사용 시
vercel env pull .env.local

# 또는 로컬 PostgreSQL 사용
DATABASE_URL="postgresql://user:password@localhost:5432/board"
DIRECT_URL="postgresql://user:password@localhost:5432/board"
```

3. 마이그레이션 실행:
```bash
npx prisma migrate dev
```

## 문제 해결

### 빌드 에러 발생 시
1. Vercel 대시보드 → "Deployments" → 실패한 배포 클릭
2. 로그 확인
3. 환경 변수가 올바르게 설정되었는지 확인

### 데이터베이스 연결 오류 시
1. 환경 변수 `DATABASE_URL`과 `DIRECT_URL` 확인
2. Vercel Postgres가 정상적으로 생성되었는지 확인
3. 마이그레이션이 실행되었는지 확인
