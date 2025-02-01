import _ from 'lodash'
import { ref } from 'vue'
import { useAppStore } from '@/stores/app'
import { useDiaryStore } from '@/stores/diary'
import { useApp } from '@/composables/useApp'
import { useRoute, useRouter } from 'vue-router'
export const useDiary = () => {
    const router = useRouter()
    const route = useRoute()
    const appStore = useAppStore()
    const diaryStore = useDiaryStore()
    const { alert } = useApp()
    const isRenameRef = ref<boolean>(false)
    // Actions
    const onRename = async (filepath: string, filename: string) => {
        isRenameRef.value = false
        // 기존 파일명이 변경할 파일과 일치한다면
        if (filename == _.last(filepath.split('/'))) {
            return
        }
        diaryStore
            .renameDiary({
                filepath,
                filename
            })
            .then((path) => {
                if (route.name == 'diary-editor') {
                    router
                        .replace({
                            name: 'diary-editor',
                            params: { path }
                        })
                        .catch((e) => e)
                }
                alert.success(`${filename} (으/로) 변경되었습니다.`)
            })
            .finally(diaryStore.loadDiaries)
    }
    const onContextMenu = (
        event: MouseEvent,
        {
            path = '/',
            interceptItems = () => []
        }: {
            path: string
            interceptItems?: (items: IContextMenuItem[]) => IContextMenuItem[]
        }
    ) => {
        if (event.button != 2) {
            return
        }
        let items: IContextMenuItem[] = [
            {
                name: 'refresh',
                desc: '새로고침',
                shortcut: 'R',
                cb() {
                    diaryStore
                        .loadDiaries()
                        .catch((e) => console.error(e))
                        .finally(() => appStore.toggleMenu(false))
                }
            },
            {
                name: 'add-folder',
                desc: '새 폴더',
                shortcut: 'N',
                cb() {
                    diaryStore
                        .mkdirDiary({
                            dirpath: path
                        })
                        .then((dirname) => alert.success(`${dirname} 생성 되었습니다.`))
                        .then(() => diaryStore.loadDiaries())
                        .catch((e) => alert.error(e))
                        .finally(() => appStore.toggleMenu(false))
                }
            },
            {
                name: 'add',
                desc: '새 문서',
                shortcut: 'N',
                cb() {
                    diaryStore
                        .saveDiary({
                            filepath: path
                        })
                        .then((filename) => alert.success(`${filename} 생성 되었습니다.`))
                        .then(() => diaryStore.loadDiaries())
                        .catch((e) => alert.error(e))
                        .finally(() => appStore.toggleMenu(false))
                }
            },
            {
                name: 'update-name',
                desc: '이름 바꾸기',
                shortcut: 'M',
                cb() {
                    if (diaryStore.isPreventRoute) {
                        return alert.error(
                            new Error('문서에 변경사항이 있습니다. 저장 한 후 다시 시도해 주세요.')
                        )
                    }
                    isRenameRef.value = true
                    appStore.toggleMenu(false)
                }
            },
            {
                name: 'remove',
                desc: '삭제',
                shortcut: 'D',
                cb() {
                    diaryStore
                        .rmDiary({ filepath: path })
                        .then((filename) => {
                            alert.success(`${filename} 삭제되었습니다.`)
                            router
                                .replace({ name: 'diary' })
                                .catch((e) => e)
                                .finally(() => appStore.toggleMenu(false))
                        })
                        .then(() => diaryStore.loadDiaries())
                        .catch((e) => alert.error(e))
                }
            }
        ]
        if (interceptItems) {
            items = interceptItems(items)
        }
        appStore.toggleMenu(true, {
            pageX: event.pageX,
            pageY: event.pageY,
            items
        })
    }
    return {
        isRenameRef,
        onRename,
        onContextMenu
    }
}
