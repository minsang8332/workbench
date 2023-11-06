import _ from 'lodash'
export default {
    getMarkdowns(state) {
        return state.markdowns
    },
    // 배열 -> 계층트리
    getCategories(state, { getMarkdowns }) {
        let categories = []
        try {
            let map = {}
            // 관계 데이터 생성
            for (const md of getMarkdowns) {
                const paths = md.path.split('/')
                for (let depth = 0; depth < paths.length; depth++) {
                    if (!paths[depth]) {
                        continue
                    }
                    const path = md.path
                    if (map[path] == undefined) {
                        map[path] = _.merge(md, {
                            title: paths[paths.length - 1],
                            path,
                            parent: null,
                            items: [],
                        })
                    }
                    if (depth > 0) {
                        map[path].parent = paths
                            .slice(0, paths.length - 1)
                            .join('/')
                    }
                }
            }
            // 트리 만들기
            for (const key in map) {
                const md = map[key]
                // 부모가 있는 경우
                if (map[md.parent]) {
                    map[md.parent].items.push(md)
                } else {
                    categories.push(md)
                }
            }
            // 폴더순 정렬
            categories = categories.sort((a, b) => b.isDir - a.isDir)
        } catch (e) {
            console.error(e)
        }
        return categories
    },
}
