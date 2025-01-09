import _ from 'lodash'
import { ref, unref, inject } from 'vue'
import { useAppStore } from '@/stores/app'
import { useDiaryStore } from '@/stores/diary'
import { useApp } from '@/composables/useApp'
import { useRouter } from 'vue-router'
export const useDiary = () => {
    const $toast = inject('toast') as IToastPlugin
    const router = useRouter()
    const appStore = useAppStore()
    const diaryStore = useDiaryStore()
    const app = useApp()
    const renameRef = ref<boolean>(false)
    const updateRename = (filename = false) => {
        renameRef.value = filename
    }
    // 메뉴창 열기
    const openContextMenu = (
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
                icon: 'mdi:mdi-refresh',
                color: app.scss('--dark-color'),
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
                icon: 'mdi:mdi-folder',
                color: app.scss('--folder-color'),
                cb() {
                    diaryStore
                        .mkdirDiary({
                            dirpath: path
                        })
                        .then((dirname) => $toast.success(`${dirname} 생성 되었습니다.`))
                        .then(() => diaryStore.loadDiaries())
                        .catch((e) => $toast.error(e))
                        .finally(() => appStore.toggleMenu(false))
                }
            },
            {
                name: 'add',
                desc: '새 문서',
                shortcut: 'N',
                icon: 'mdi:mdi-file-document-outline',
                color: app.scss('--dark-color'),
                cb() {
                    diaryStore
                        .saveDiary({
                            filepath: path
                        })
                        .then((filename) => $toast.success(`${filename} 생성 되었습니다.`))
                        .then(() => diaryStore.loadDiaries())
                        .catch((e) => $toast.error(e))
                        .finally(() => appStore.toggleMenu(false))
                }
            },
            {
                name: 'update-name',
                desc: '이름 바꾸기',
                shortcut: 'M',
                icon: 'mdi:mdi-pencil-box-outline',
                color: app.scss('--dark-color'),
                cb() {
                    if (diaryStore.isPreventRoute) {
                        return $toast.error(
                            new Error('문서에 변경사항이 있습니다. 저장 한 후 다시 시도해 주세요.')
                        )
                    }
                    renameRef.value = true
                    appStore.toggleMenu(false)
                }
            },
            {
                name: 'remove',
                desc: '삭제',
                shortcut: 'D',
                icon: 'mdi:mdi-trash-can-outline',
                color: app.scss('--dark-color'),
                cb() {
                    diaryStore
                        .rmDiary({ filepath: path })
                        .then((filename) => {
                            $toast.success(`${filename} 삭제되었습니다.`)
                            router
                                .replace({ name: 'diary' })
                                .catch((e) => e)
                                .finally(() => appStore.toggleMenu(false))
                        })
                        .then(() => diaryStore.loadDiaries())
                        .catch((e) => $toast.error(e))
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
        renameRef,
        updateRename,
        openContextMenu
    }
}
