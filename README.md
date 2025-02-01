# 업무작업대 (Workbench)

_업무 능률 향상을 위한 다목적 기능을 담은 Mac 및 Window 어플리케이션_

![](./screenshot.png)

## 배포내역

| 버전                                                        | 변경사항                                | 상태   | 배포일자   |
| ----------------------------------------------------------- | --------------------------------------- | ------ | ---------- |
| [v1.0](https://github.com/minsang8332/workbench/releases)   | 문서 편집하기                           | 완료   | 2023.11.20 |
| [v1.1](https://github.com/minsang8332/workbench/releases)   | 목표 관리하기 기능, <br> Dock 메뉴 <br> | 완료   | 2024.09.20 |
| [v1.1.1](https://github.com/minsang8332/workbench/releases) | 환경설정                                | 완료   | 2025.01.11 |
| v1.2                                                        | 웹 자동화                               | 진행중 | 2025.01    |
| v1.2.1                                                      | SQLite 마이그레이션                     | 예정   | 2025.02    |

## 실행하기

> node 16.20.1^ 18.20.2^

```
// 패키지 설치
npm run setup

// 개발하기
npm run serve

// 윈도우 어플리케이션 빌드
npm run build

// 윈도우 어플리케이션 배포 (전역 환경변수 GH_TOKEN 값이 있어야 함)
npm run deploy

// electron 전용 아이콘들로 일괄 생성
npm run icon
```
