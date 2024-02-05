import { computed, reactive } from 'vue'
import { defineStore } from 'pinia'
import _ from 'lodash'
interface IDocumentState {
    documents: any[]
}
export const useDocumentStore = defineStore('document', () => {
    const state = reactive<IDocumentState>({
        documents: []
    })
    const getDocuments = computed(() => state.documents)
    const cntDocuments = computed(() => state.documents.filter((doc) => doc.isDir == false).length)
    const recentDocuments = computed(
        () => state.documents
        /*
            .filter((md) => md.isDir == false)
            .sort(
                (a: number, b: number) =>
                    new Date(b.updatedAt) - new Date(a.updatedAt) ||
                    new Date(b.createdAt) - new Date(a.createdAt)
            )
        */
    )
    // 문서 계층화
    const treeDocuments = computed(() => {
        let tree = []
        try {
            const docs = state.documents
            const docTable: any = {}
            // 관계 데이터 생성
            for (const document of docs) {
                const paths = document.path.split('/')
                for (let depth = 0; depth < paths.length; depth++) {
                    if (!paths[depth]) {
                        continue
                    }
                    const path = document.path
                    if (docTable[path] == undefined) {
                        docTable[path] = _.merge(document, {
                            title: paths[paths.length - 1],
                            path,
                            parent: null,
                            items: []
                        })
                    }
                    if (depth > 0) {
                        docTable[path].parent = paths.slice(0, paths.length - 1).join('/')
                    }
                }
            }
            const compare = (a: any, b: any) =>
                new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            // 트리 만들기
            for (const key in docTable) {
                const doc = docTable[key]
                // 부모가 있는 경우
                if (docTable[doc.parent]) {
                    docTable[doc.parent].items.push(doc)
                } else {
                    tree.push(doc)
                }
            }
            // 트리 정렬
            for (const key in docTable) {
                const doc = docTable[key]
                if (docTable[doc.parent] && docTable[doc.parent].items.length > 0) {
                    docTable[doc.parent].items = docTable[doc.parent].items.sort(compare)
                }
            }
            tree = tree.sort(compare)
        } catch (e) {
            console.error(e)
        }
        return tree
    })
    // 문서 목록 가져오기
    const loadDocuments = async () => {
        const response = await window.$native.document.readAll()
        const { documents } = response.data
        state.documents = documents
        return { documents }
    }
    // 문서 열기
    const loadDocument = async ({ target }: { target: string }) => {
        const response = await window.$native.document.read({ target })
        const { text } = response.data
        return { text }
    }
    // 문서 저장
    const saveDocument = async ({ target, text }: { target: string; text: string }) => {
        const response = await window.$native.document.write({ target, text })
        loadDocuments().catch((e) => e)
        const { writed } = response.data
        return { writed }
    }
    // 문서 이름 변경
    const renameDocument = async ({ target, rename }: { target: string; rename: string }) => {
        const response = await window.$native.document.rename({
            target,
            rename
        })
        loadDocuments().catch((e) => e)
        const { renamed } = response.data
        return { renamed }
    }
    // 문서 폴더 생성
    const mkdirDocument = async ({ target }: { target: string }) => {
        const response = await window.$native.document.writeDir({ target })
        loadDocuments().catch((e) => e)
        const { writed } = response.data
        return { writed }
    }
    // 문서 폴더 열기
    const dirDocument = () => window.$native.document.openDir()
    // 문서 삭제
    const rmDocument = async ({ target }: { target: string }) => {
        const response = await window.$native.document.remove({ target })
        loadDocuments().catch((e) => e)
        const { removed } = response.data
        return { removed }
    }
    // 문서 이동
    const mvDocument = async ({ target, dest }: { target: string; dest: string }) => {
        const response = await window.$native.document.move({ target, dest })
        loadDocuments().catch((e) => e)
        const { moved } = response.data
        return { moved }
    }
    return {
        state,
        getDocuments,
        cntDocuments,
        recentDocuments,
        treeDocuments,
        loadDocument,
        saveDocument,
        renameDocument,
        mkdirDocument,
        dirDocument,
        rmDocument,
        mvDocument
    }
})
