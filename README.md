# nb04-How-Do-I-Look-team4
코드잇 초급 프로젝트

{팀 이름}
(팀 협업 문서 링크 게시)

팀원 구성
이하영 (개인 Github 링크)
이서진 (개인 Github 링크)
송창준 (개인 Github 링크)
조재후 (개인 Github 링크)
김혜연 (개인 Github 링크)
최홍기 (개인 Github 링크)


프로젝트 소개
프론트엔트로 구현된 사이트의 백엔드 시스템 구축
프로젝트 기간: 2024.08.11 ~ 2024.08.29
기술 스택
Backend: Express.js, PrismaORM
Database: PostgreSql
공통 Tool: Git & Github, Discord
팀원별 구현 기능 상세
이하영: 스타일 API
송창준,김혜연: 큐레이팅 API
이서진: 댓글 API 
조재후: 이미지 / tags API
최홍기: 랭킹 API

nb04-How-Do-I-Look-team4/
├── src/
│   ├── client/                  # Prisma 클라이언트 설정
│   │   └── prisma-client.js
│   │
│   ├── controllers/             # 컨트롤러 (요청/응답 처리)
│   │   ├── comment-controller.js
│   │   ├── curating-controller.js
│   │   ├── ranking-controller.js
│   │   └── style-controller.js
│   │
│   ├── middlewares/             # 미들웨어 (요청 전처리)
│   │   ├── error-handler.js
│   │   └── errors.js
│   │
│   ├── routers/                 # 라우터 (API 엔드포인트)
│   │   ├── comment-router.js
│   │   ├── curating-router.js
│   │   ├── image-router.js
│   │   ├── ranking-router.js
│   │   ├── style-router.js
│   │   └── tag-router.js
│   │
│   ├── services/                # 비즈니스 로직 처리
│   │   ├── curating-service.js
│   │   ├── ranking-service.js
│   │   └── style-service.js
│   │
│   ├── utils/                   # 유틸리티 함수
│   │   └── ranking-utils.js
│   │
│   ├── validators/              # 유효성 검사 스키마
│   │   └── style-validator.js
│   │
│   └── app.js                   # 메인 애플리케이션 파일
│
├── .env                         # 환경 변수 파일
├── .gitignore                   # Git 추적에서 제외할 파일 목록
├── .prettierrc                  # Prettier 설정
├── package.json                 # 프로젝트 정보 및 의존성
└── README.md


구현 홈페이지
(개발한 홈페이지에 대한 링크 게시)

https://www.codeit.kr/

프로젝트 회고록
(제작한 발표자료 링크 혹은 첨부파일 첨부)
