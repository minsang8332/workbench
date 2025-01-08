import { computed, reactive } from 'vue'
import { defineStore } from 'pinia'
import _ from 'lodash'
interface IDiaryState {
    diaries: IDiary[]
}
export const useDiaryStore = defineStore('diary', () => {
    const state = reactive<IDiaryState>({
        diaries: []
    })
    const getDiaries = computed(() => state.diaries)
    const cntDiaries = computed(() => state.diaries.filter((diary) => diary.isDir == false).length)
    const recentDiaries = computed(() => {
        return state.diaries
            .map((diary: IDiary) => {
                let filename
                if (diary.path) {
                    const path = diary.path.split('/')
                    filename = _.last(path)
                }
                diary.filename = filename
                return diary
            })
            .filter((diary: IDiary) => diary.isDir == false)
            .sort((a: IDiary, b: IDiary) => b.updatedAt - a.updatedAt || b.createdAt - a.createdAt)
            .slice(0, 9)
    })
    // 문서 계층화
    const treeDiaries = computed(() => {
        let tree = []
        try {
            const diaryTable: any = {}
            const diaries = getDiaries.value
            for (const diary of diaries) {
                const paths = diary.path.split('/')
                for (let depth = 0; depth < paths.length; depth++) {
                    if (!paths[depth]) {
                        continue
                    }
                    const path = diary.path
                    if (diaryTable[path] == undefined) {
                        diaryTable[path] = _.merge({}, diary, {
                            title: paths[paths.length - 1],
                            path,
                            parent: null,
                            items: []
                        })
                    }
                    // 관계 데이터 생성
                    if (depth > 0) {
                        diaryTable[path].parent = paths.slice(0, paths.length - 1).join('/')
                    }
                }
            }
            const compare = (a: IDiary, b: IDiary) =>
                new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            // 트리 만들기
            for (const key in diaryTable) {
                const diary = diaryTable[key]
                // 부모가 있는 경우
                if (diaryTable[diary.parent]) {
                    diaryTable[diary.parent].items.push(diary)
                } else {
                    tree.push(diary)
                }
            }
            // 트리 정렬
            for (const key in diaryTable) {
                const diary = diaryTable[key]
                if (diaryTable[diary.parent] && diaryTable[diary.parent].items.length > 0) {
                    diaryTable[diary.parent].items = diaryTable[diary.parent].items.sort(compare)
                }
            }
            tree = tree.sort(compare)
        } catch (e) {
            console.error(e)
        }
        return tree
    })

    // Mutations
    const updateDiaries = (payload: IDiary[] = []) => {
        state.diaries = payload
    }
    // 문서 목록 가져오기
    const loadDiaries = async () => {
        updateDiaries([])
        const response = await window.$native.diary.load()
        updateDiaries(response.data.diaries)
        return getDiaries.value
    }
    // 문서 열기
    const readDiary = async ({ filepath }: { filepath: string }) => {
        const response = await window.$native.diary.read({ filepath })
        return response.data.text
    }
    // 문서 저장
    const saveDiary = async ({
        filepath,
        filename,
        ext,
        text
    }: {
        filepath: string
        filename?: string
        ext?: string
        text?: string
    }) => {
        const response = await window.$native.diary.write({ filepath, filename, ext, text })
        return response.data.filename
    }
    // 문서 이름 변경
    const renameDiary = async ({ filepath, filename }: { filepath: string; filename: string }) => {
        const response = await window.$native.diary.rename({
            filepath,
            filename
        })
        return response.data.filepath
    }
    // 문서 폴더 생성
    const mkdirDiary = async ({ dirpath }: { dirpath: string }) => {
        const response = await window.$native.diary.writeDir({ dirpath })
        return response.data.dirname
    }
    // 문서 삭제
    const rmDiary = async ({ filepath }: { filepath: string }) => {
        const response = await window.$native.diary.remove({ filepath })
        return response.data.filename
    }
    // 문서 이동
    const mvDiary = async ({ frompath, destpath }: { frompath: string; destpath: string }) => {
        const response = await window.$native.diary.move({ frompath, destpath })
        return response.data.filename
    }
    // 문서 폴더 열기
    const dirDiary = () => window.$native.diary.openDir()
    return {
        state,
        getDiaries,
        cntDiaries,
        recentDiaries,
        treeDiaries,
        loadDiaries,
        readDiary,
        saveDiary,
        renameDiary,
        mkdirDiary,
        dirDiary,
        rmDiary,
        mvDiary
    }
})
