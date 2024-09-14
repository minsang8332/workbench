# 업무작업대 (Workbench)
_내 업무 능률 향상을 위한 Mac 및 Windows 데스크톱 앱_

![](./screenshot.png)

## 배포내역
| 버전 | 변경사항 | 상태 | 배포일자 |
|-------|-----------------------|-------|-------|
| [v1.0](https://github.com/minsang8332/workbench/releases)  | 문서 편집하기 | 완료 |  2023.11.20 |
| v1.1   |  목표 관리하기 기능, <br> Dock 메뉴  <br> | 진행중 | 2024.09.20 |
| v1.2   | 환경설정 기능 (백업하기 및 잠금 제공) |  |  |
| v1.3   | 백색소음 빗소리 음악 ASMR 기능 |  |  |
| v1.4   | 날씨 확인하기 기능 |  |  |

## 설치하기
> node 16.20.1^ 기준

```
// 설치하기
npm run setup
npm run setup:next

// 개발하기
npm run serve
npm run serve:next

// 빌드하기
npm run build
npm run build:next
```
💡**next** 는 webview-next (vite/vue3.ts) 프로젝트를 바라보도록 합니다.

### 그 외 부가 명령어
```
// input 경로의 아이콘을 electron 전용 아이콘들로 일괄 생성 해줌
npm run icon

// 출시하는 단말기 환경변수 GH_TOKEN 이 선언되어 있어야함
npm run deploy
```
