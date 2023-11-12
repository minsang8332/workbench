# Markdown Editor

> 마크다운 문서 관리를 위한 Mac 및 Windows용 데스크톱 앱

![](./screenshot.png)

## 업데이트

2023/11/08 문서 관리 기능 완성. 버그 수정 및 UX 개선중 ([0.9.0-alpha](https://github.com/yuu2dev/markdown-editor/releases))  
2023/11/09 파일 및 폴더명 바꾸기, 최근작성목록 추가 ([0.9.1-alpha](https://github.com/yuu2dev/markdown-editor/releases))

## 설치 및 실행

```
// 패키지 설치하기
npm run setup

// 개발하기
npm run serve

// 빌드하기
npm run build
```

그 외 부가 명령어

```
// input 경로의 아이콘을 electron 전용 아이콘들로 일괄 생성 해줌
npm run icon

// 출시하는 단말기 환경변수 GH_TOKEN 이 선언되어 있어야함
npm run deploy
```

## 프로그램 기획 및 설계

```
📌 화면구성
- [✓] : 앱 레이아웃
- [✓] : 마크다운 파일 시스템 UI
- [✓] : 마크다운 문서 작성 및 편집 그리고 프리뷰
- [✓] : 마크다운 최근 작성 목록

📌 기능구성
- [✓] : 마크다운 CRUD 핸들러
- [✓] : documents 백업 폴더
- [✓] : 디버그 및 에러 로그
- [✓] : 자동업데이트
```
