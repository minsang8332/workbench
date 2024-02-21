import { computed, reactive } from 'vue'
import { defineStore } from 'pinia'
import { marked } from 'marked'
import _ from 'lodash'
export const useDiaryStore = defineStore('diary', () => {
    const state = reactive<IDiaryState>({
        diaries: []
    })
    const getDiaries = computed(() => state.diaries)
    const cntDiaries = computed(() => state.diaries.filter((diary) => diary.isDir == false).length)
    const recentDiaries = computed(() =>
        state.diaries
            .filter((diary: IDiary) => diary.isDir == false)
            .sort((a: IDiary, b: IDiary) => b.updatedAt - a.updatedAt || b.createdAt - a.createdAt)
    )
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
    // 문서 목록 가져오기
    const loadDiaries = async () => {
        const response = await window.$native.diary.readAll()
        const { diaries } = response.data
        state.diaries = diaries
        return { diaries }
    }
    // 문서 열기
    const loadDiary = async ({ target }: { target: string }) => {
        const response = await window.$native.diary.read({ target })
        const { text } = response.data
        return { text }
    }
    // 문서 저장
    const saveDiary = async ({ target, text }: { target: string; text: string }) => {
        const response = await window.$native.diary.write({ target, text })
        loadDiaries().catch((e) => e)
        const { writed } = response.data
        return { writed }
    }
    // 문서 이름 변경
    const renameDiary = async ({ target, rename }: { target: string; rename: string }) => {
        const response = await window.$native.diary.rename({
            target,
            rename
        })
        loadDiaries().catch((e) => e)
        const { renamed } = response.data
        return { renamed }
    }
    // 문서 폴더 생성
    const mkdirDiary = async ({ target }: { target: string }) => {
        const response = await window.$native.diary.writeDir({ target })
        loadDiaries().catch((e) => e)
        const { writed } = response.data
        return { writed }
    }
    // 문서 폴더 열기
    const dirDiary = () => window.$native.diary.openDir()
    // 문서 삭제
    const rmDiary = async ({ target }: { target: string }) => {
        const response = await window.$native.diary.remove({ target })
        loadDiaries().catch((e) => e)
        const { removed } = response.data
        return { removed }
    }
    // 문서 이동
    const mvDiary = async ({ target, dest }: { target: string; dest: string }) => {
        const response = await window.$native.diary.move({ target, dest })
        loadDiaries().catch((e) => e)
        const { moved } = response.data
        return { moved }
    }
    const loadDiariesWithPreview = async () => {
        let diariesWithPreview: IDiaryWithPreview[] = []
        try {
            await loadDiaries()
            diariesWithPreview = await Promise.all(
                recentDiaries.value.map(async (d) => {
                    const diary = await loadDiary({
                        target: d.path
                    })
                    const preview = await marked(_.toString(diary.text))
                    return {
                        ...d,
                        preview
                    }
                })
            )
        } catch (e) {
            console.error(e)
        }
        return diariesWithPreview
    }
    return {
        state,
        getDiaries,
        cntDiaries,
        recentDiaries,
        treeDiaries,
        loadDiaries,
        loadDiary,
        saveDiary,
        renameDiary,
        mkdirDiary,
        dirDiary,
        rmDiary,
        mvDiary,
        loadDiariesWithPreview
    }
})
