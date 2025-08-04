# Slack to Jira Automation Proxy

Slack 이벤트를 Make.com으로 전달하는 프록시 서버입니다.

## 기능

- Slack 이벤트 검증
- Make.com으로 이벤트 전달
- 헬스체크 엔드포인트

## 배포 방법

### Railway 배포 (추천)

1. [Railway](https://railway.app)에 가입
2. GitHub 저장소 연결
3. 환경 변수 설정:
   - `SLACK_SIGNING_SECRET`: Slack 앱의 Signing Secret
   - `MAKE_WEBHOOK_URL`: Make.com 웹훅 URL
4. 자동 배포 완료

### 로컬 실행

```bash
npm install
npm start
```

## 환경 변수

- `SLACK_SIGNING_SECRET`: Slack 앱의 Signing Secret
- `MAKE_WEBHOOK_URL`: Make.com 웹훅 URL
- `PORT`: 서버 포트 (기본값: 3000)

## 엔드포인트

- `POST /slack/webhook`: Slack 이벤트 수신
- `GET /health`: 헬스체크 