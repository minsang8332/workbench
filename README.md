# markdown-editor

> 마크다운 문서를 작성하고 편집할 수 있는 win/mac 전용앱

## 설치 및 실행

```
// 개발하기
npm install && npm run dev

// 배포하기
npm run build
```

## 프로그램 기획 및 설계

```
📌 화면구성
- [] : page (📘) 클릭시 책장을 넘기는 듯이 화면이 전환
- [] : page 마크다운 카테고리별 통계 및 추이 차트
- [] : page 환경설정 (gitaction 관련 설정하기 위함)
- [] : component 좌측 계층형 카테고리
- [] : component 우측 상단 마크다운 문서 프리뷰
- [] : component 우측 하단 마크다운 문서 작성
- [] : layout 상단 '환경설정' 버튼
- [] : layout 하단 '작성하기/편집하기' 버튼
- [] : layout 하단 '삭제하기' 버튼
- [] : layout 하단 '통계보기' 버튼
- [] : layout 하단 '업로드하기' 버튼

📌 기능구성
- [] : hanlder 마크다운 파일목록
- [] : handler 마크다운 파일삭제
- [] : handler 마크다운 파일조회
- [] : handler 마크다운 파일 덮어쓰기 (자동저장시 백업 필요)
- [] : handler 마크다운 자동저장 폴링
- [] : tool 디버그 및 에러 로그
- [] : tool 마크다운 gitaction 업로드하기
```
