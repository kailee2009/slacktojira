const express = require('express');
const crypto = require('crypto');
require('dotenv').config();

const app = express();
app.use(express.json());

// Slack 이벤트 검증 함수
function verifySlackRequest(req) {
  const signature = req.headers['x-slack-signature'];
  const timestamp = req.headers['x-slack-request-timestamp'];
  const body = JSON.stringify(req.body);
  
  const baseString = `v0:${timestamp}:${body}`;
  const expectedSignature = 'v0=' + crypto
    .createHmac('sha256', process.env.SLACK_SIGNING_SECRET)
    .update(baseString)
    .digest('hex');
    
  return crypto.timingSafeEqual(
    Buffer.from(expectedSignature, 'utf8'),
    Buffer.from(signature, 'utf8')
  );
}

// Slack 웹훅 엔드포인트
app.post('/slack/webhook', async (req, res) => {
  try {
    // Slack URL 검증 요청 처리
    if (req.body.type === 'url_verification') {
      return res.json({ challenge: req.body.challenge });
    }
    
    // Slack 이벤트 검증
    if (!verifySlackRequest(req)) {
      console.log('Slack 요청 검증 실패');
      return res.status(401).send('Unauthorized');
    }
    
    // Make.com으로 이벤트 전달
    const makeWebhookUrl = process.env.MAKE_WEBHOOK_URL;
    const response = await fetch(makeWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(req.body)
    });
    
    if (!response.ok) {
      console.error('Make.com 전달 실패:', response.status);
      return res.status(500).send('Internal Server Error');
    }
    
    console.log('Slack 이벤트를 Make.com으로 전달 완료');
    res.status(200).send('OK');
    
  } catch (error) {
    console.error('에러 발생:', error);
    res.status(500).send('Internal Server Error');
  }
});

// 헬스체크 엔드포인트
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
}); 