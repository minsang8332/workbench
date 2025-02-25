# 업무작업대 (Workbench)

_업무 능률 향상을 위한 다목적 기능을 담은 Mac 및 Window 어플리케이션_

![](./screenshot.png)

## 배포내역

| 버전                                                        | 변경사항                                | 상태 | 배포일자   |
| ----------------------------------------------------------- | --------------------------------------- | ---- | ---------- |
| [v1.0](https://github.com/minsang8332/workbench/releases)   | 문서 편집하기                           | 완료 | 2023.11.20 |
| [v1.1](https://github.com/minsang8332/workbench/releases)   | 목표 관리하기 기능, <br> Dock 메뉴 <br> | 완료 | 2024.09.20 |
| [v1.1.1](https://github.com/minsang8332/workbench/releases) | 환경설정                                | 완료 | 2025.01.11 |
| [v1.2.0](https://github.com/minsang8332/workbench/releases) | 웹 자동화                               | 점검 | 2025.02.18 |
| v1.2.1                                                      | SQLite 마이그레이션                     | 예정 |            |

## 안내사항

> **electron** 과 **vue**가 합쳐진 모노레포 기반 프로젝트입니다.

💡소스코드 변경점 감지 및 빌드 자동화가 커스터마이징 되어 있으니 상세 내용은 **webpack.config.js** 소스코드 확인해 주세요.

## 실행하기

1. NODE 버전은 `^18.20` 이상이여야 합니다. <br>
2. **.env.copy** 파일을 **.env** 로 변경해 주세요. <br>
3. `npm run setup` 을/를 실행합니다. <br>
   3-1. **c++로 작성된 네이티브 모듈을 빌드**해야 합니다. `npm install -g node-gyp@9` 명령어를 실행합니다. <br>
   3-2. **파이썬** 프로그램이 필요합니다. <a href="https://www.python.org/downloads/" target="_blank">공식 홈페이지</a>에서 설치해 주세요. <br>
   <br>
4. 네이티브 모듈 호환성 문제가 발생하지 않도록 `npm run rebuild` 명령어를 실행합니다.
5. `npm run serve` 명령어를 실행하여 개발 시작합니다.

## 부가명령어

```
// 모든 프로젝트의 모듈 설치
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
