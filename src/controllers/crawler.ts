import _ from 'lodash'
import { controller } from '@/utils/ipc'
import WorkerRepository from '@/repositories/crawler/WorkerRepository'
import HistoryRepository from '@/repositories/crawler/HistoryRepository'
import CrawlerService from '@/services/CrawlerService'
import { IPCError } from '@/errors/ipc'
import Worker from '@/models/crawler/Worker'
import { IPC_CRAWLER_CHANNEL } from '@/constants/ipc'
import type { IPCRequest, IPCResponse } from '@/types/ipc'
import { CursorCommand } from '@/models/crawler/Command'

// 웹 자동화 목록
controller(
    IPC_CRAWLER_CHANNEL.LOAD_WORKERS,
    async (request: IPCRequest.Crawler.ILoadWorkers, response: IPCResponse.IBase) => {
        const workerRepository = new WorkerRepository()
        response.data.workers = workerRepository.findAll()
        return response
    }
)

// 웹 자동화 생성 및 편집
controller(IPC_CRAWLER_CHANNEL.SAVE_WORKER, (request: IPCRequest.Crawler.ISaveWorker, response: IPCResponse.IBase) => {
    const workerRepository = new WorkerRepository()
    const worker = new Worker({
        id: request.id,
        label: request.label,
        commands: request.commands,
    })
    const id = request.id ? workerRepository.update(worker) : workerRepository.insert(worker)
    response.data.id = id
    return response
})

// 웹 자동화 라벨 편집
controller(
    IPC_CRAWLER_CHANNEL.SAVE_WORKER_LABEL,
    (request: IPCRequest.Crawler.ISaveWorkerLabel, response: IPCResponse.IBase) => {
        const workerRepository = new WorkerRepository()
        const worker = workerRepository.findOne(request.id)
        if (!(worker && worker.id)) {
            throw new IPCError('자동화 세트를 식별 할 수 없습니다')
        }
        const id = workerRepository.update(
            new Worker({
                ...worker,
                label: request.label,
            })
        )
        response.data.id = id
        return response
    }
)

// 웹 자동화 명령배열 저장
controller(
    IPC_CRAWLER_CHANNEL.SAVE_WORKER_COMMANDS,
    (request: IPCRequest.Crawler.ISaveWorkerCommands, response: IPCResponse.IBase) => {
        const workerRepository = new WorkerRepository()
        const worker = workerRepository.findOne(request.id)
        if (!(worker && worker.id)) {
            throw new IPCError('자동화 세트를 식별 할 수 없습니다')
        }
        const id = workerRepository.update(
            new Worker({
                ...worker,
                commands: request.commands,
            })
        )
        response.data.id = id
        return response
    }
)

// 웹 자동화 제거
controller(
    IPC_CRAWLER_CHANNEL.DELETE_WORKER,
    (request: IPCRequest.Crawler.IDeleteWorker, response: IPCResponse.IBase) => {
        const workerRepository = new WorkerRepository()
        response.result = workerRepository.delete(request.id)
        return response
    }
)

// 웹 자동화 히스토리 내역
controller(
    IPC_CRAWLER_CHANNEL.LOAD_HISTORIES,
    async (request: IPCRequest.Crawler.ILoadHistories, response: IPCResponse.IBase) => {
        const historyRepository = new HistoryRepository()
        response.data.histories = historyRepository.findAll()
        return response
    }
)
// 웹 자동화 화면에서 사용자가 HTML 선택자를 클릭 할 수 있도록 윈도우 화면을 띄움
/*
controller(
    IPC_CRAWLER_CHANNEL.SCRAPING_SELECTOR,
    async (request: IPCRequest.Crawler.IScrapingSelector, response: IPCResponse.IBase) => {
        const crawlerService = new CrawlerService()
        const window = crawlerService.createWindow()
        // 사용자가 스크래핑 하기위한 윈도우 화면을 연다.
        const detectScraping = new Promise((resolve, reject) => {
            window.show()
            crawlerService
                .cursor(window, new CursorCommand())
                .then((selector) => resolve(selector))
                .catch((e) => reject(e))
                .finally(() => window.hide())
        })
        // 사용자가 스크래핑 하거나 창을 닫을 수 있어 이를 감지하도록 함
        const selector = await Promise.race([detectScraping, crawlerService.detectClose(window)])
        response.data.selector = selector
        return response
    }
)
*/
