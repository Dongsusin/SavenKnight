<h1 align="left">
  <img src="/public/logo.png" alt="Project Icon" width="40" style="vertical-align:middle;">
  세나위키
</h1>

![Project Main](/public/readme/메인.png)

세븐나이츠 기반 게임 커뮤니티 웹 애플리케이션입니다. 영웅·펫·장비 데이터 관리, 팀 시뮬레이션, 소환 시뮬레이터 등 다양한 기능을 React와 Vite를 기반으로 구현했습니다.

## 📌 주요 기능

- **데이터 관리**: JSON 파일 직접 작성·관리로 영웅/펫/장비 데이터 구축
- **도감 & 상세 페이지**: 검색, 필터, 팝업으로 상세 정보 제공
- **소환 시뮬레이터**: 실제 게임 확률 기반 구현, 위시리스트/확정 소환 기능 지원
- **팀 빌드 & 스탯 계산**: 영웅·펫 선택 후 팀 스탯 실시간 계산
- **UX 개선**: 페이지별 호버·강조 효과, 캘린더 이벤트 기능 제공

## 🛠 사용 기술

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white)
![React Calendar](https://img.shields.io/badge/React_Calendar-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![CSS Modules](https://img.shields.io/badge/CSS%20Modules-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=FFD62E)
![JSON](https://img.shields.io/badge/JSON-000000?style=for-the-badge&logo=json&logoColor=white)
![Fetch API](https://img.shields.io/badge/Fetch_API-35495E?style=for-the-badge&logo=javascript&logoColor=F7DF1E)
![NPM](https://img.shields.io/badge/NPM-CB3837?style=for-the-badge&logo=npm&logoColor=white)
![Netlify](https://img.shields.io/badge/Netlify-00C7B7?style=for-the-badge&logo=netlify&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=githubactions&logoColor=white)
![MIT License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

## 📂 폴더 구조

```
SavenKnight/
 ├─ public/       # 정적 파일, 이미지, 아이콘
 ├─ src/          # 메인 소스코드
 │  ├─ components # 공통 컴포넌트 (헤더, 팝업, 검색 등)
 │  ├─ pages      # 주요 페이지 (메인, 도감, 팀, 소환 등)
 │  ├─ data       # 영웅/펫/장비 JSON 데이터
 │  ├─ hooks      # 커스텀 훅
 │  ├─ styles     # CSS 모듈 및 전역 스타일
 │  └─ utils      # 공통 함수, 계산 로직
 ├─ package.json  # 의존성 및 스크립트
 └─ vite.config.js
```

## 🚀 실행 방법

```bash
git clone https://github.com/Dongsusin/SavenKnight.git
cd SavenKnight
npm install
npm run dev
```

## 🌟 프로젝트 성과

- 120개 이상의 영웅/펫 데이터 구축
- 페이지 평균 로딩 2초 이내
- 실제 확률 기반 소환 시뮬레이션 구현
- 검색 및 추천 기능으로 사용자 편의성 향상

## 🔗 배포

[sevenknightwiki.netlify.app](https://sevenknightwiki.netlify.app)
