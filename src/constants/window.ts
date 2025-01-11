export enum BROWSER_CRAWLER_COMMAND {
    REDIRECT = 'redirect',
    CLICK = 'click',
    WRITE = 'write',
    CURSOR = 'cursor',
}
export enum BROWSER_CRWALER_STATUS {
    PREPARE, // 준비
    WAITING, // 대기열
    RUNNING, // 실행중
    COMPLETE, // 완료
    FAILED, // 실패
}
