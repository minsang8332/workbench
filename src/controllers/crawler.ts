import _ from 'lodash'
import { controller } from '@/utils/ipc'
import WorkerRepository from '@/repositories/crawler/WorkerRepository'
import HistoryRepository from '@/repositories/crawler/HistoryRepository'
import ScheduleRepository from '@/repositories/crawler/ScheduleRepository'
import CrawlerService from '@/services/CrawlerService'
import { IPCError } from '@/errors/ipc'
import Worker from '@/models/crawler/Worker'
import Schedule from '@/models/crawler/Schedule'
import { IPC_CRAWLER_CHANNEL } from '@/constants/ipc'
import { CRAWLER_STATUS } from '@/constants/model'
import type { IPCRequest, IPCResponse } from '@/types/ipc'
import type { Crawler } from '@/types/model'
const crawlerService = new CrawlerService()
crawlerService.provideSchedules()
// 자동화 목록
controller(
    IPC_CRAWLER_CHANNEL.LOAD_WORKERS,
    async (request: IPCRequest.Crawler.ILoadWorkers, response: IPCResponse.IBase) => {
        const workerRepository = new WorkerRepository()
        response.data.workers = workerRepository.findAll()
        return response
    }
)
// 자동화 생성 및 편집
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
// 자동화 라벨 편집
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
// 자동화 명령배열 저장
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
// 자동화 스케줄링 가져오기
controller(
    IPC_CRAWLER_CHANNEL.LOAD_SCHEDULE,
    (request: IPCRequest.Crawler.ILoadSchedule, response: IPCResponse.IBase) => {
        const scheduleRepository = new ScheduleRepository()
        const schedule = scheduleRepository.findByWorker(request.workerId)
        response.data.schedule = schedule
        return response
    }
)
// 자동화 스케줄링 등록 및 편집
controller(
    IPC_CRAWLER_CHANNEL.SAVE_SCHEDULE,
    (request: IPCRequest.Crawler.ISaveSchedule, response: IPCResponse.IBase) => {
        const scheduleRepository = new ScheduleRepository()
        const schedule = new Schedule({
            id: request.id,
            workerId: request.workerId,
            active: request.active,
            expression: request.expression,
        })
        const id = request.id ? scheduleRepository.update(schedule) : scheduleRepository.insert(schedule)
        crawlerService.shutdownScheduler()
        crawlerService.provideSchedules()
        response.data.id = id
        response.message = '정상적으로 반영되었습니다.'
        return response
    }
)
// 자동화 명령 배열 실행
controller(
    IPC_CRAWLER_CHANNEL.RUN_WORKER,
    async (request: IPCRequest.Crawler.IRunWorker, response: IPCResponse.IBase) => {
        const worker = crawlerService.getWorker(request.id)
        if (_.isEmpty(worker)) {
            throw new IPCError(`유효하지 않은 자동화 세트 ID 입니다. (id: ${request.id})`)
        }
        const window = crawlerService.createWindow()
        const runner = new Promise((resolve, reject) => {
            const timeout = 2000
            window.show()
            crawlerService
                .run(worker, window)
                .then((history) => setTimeout(() => resolve(history), timeout))
                .catch((e) => setTimeout(() => reject(e), timeout))
        })
        // 실행 도중 창이 닫히면 에러가 발생함
        const history = (await Promise.race([runner, crawlerService.detectClose(window)])) as Crawler.IHistory
        // 실행 완료시 창을 종료한다.
        window.close()
        if (!(history.status === CRAWLER_STATUS.COMPLETE)) {
            throw new IPCError('자동화 실행 중 오류가 발생했습니다. 히스토리를 확인해 주세요.')
        }
        response.message = history.message
        response.data.history = history
        return response
    }
)
// 자동화 제거
controller(
    IPC_CRAWLER_CHANNEL.DELETE_WORKER,
    (request: IPCRequest.Crawler.IDeleteWorker, response: IPCResponse.IBase) => {
        const workerRepository = new WorkerRepository()
        response.result = workerRepository.delete(request.id)
        crawlerService.shutdownScheduler()
        crawlerService.provideSchedules()
        return response
    }
)
// 자동화 히스토리 내역
controller(
    IPC_CRAWLER_CHANNEL.LOAD_HISTORIES,
    async (request: IPCRequest.Crawler.ILoadHistories, response: IPCResponse.IBase) => {
        const historyRepository = new HistoryRepository()
        response.data.histories = historyRepository.findAll()
        return response
    }
)
