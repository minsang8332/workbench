import _ from 'lodash'
import { ref, computed, defineComponent, type PropType, watch } from 'vue'
import TextField from '@/components/form/TextField'
import './DataTable.scoped.scss'
export interface IDataTableColumn {
    field: string
    label: string | null
    width?: string
}
export interface IDataTableRow {
    [field: string]: number | string | boolean | IDataTableRow['onClick']
    onClick?: () => void
}
export default defineComponent({
    name: 'DataTable',
    components: {
        TextField
    },
    props: {
        columns: {
            type: Array as PropType<IDataTableColumn[]>,
            default: () => []
        },
        rows: {
            type: Array as PropType<IDataTableRow[]>,
            default: () => []
        },
        perPage: {
            type: Number as PropType<number>,
            default: 10
        },
        selectPerPages: {
            type: Array as PropType<number[]>,
            default: () => [10]
        }
    },
    setup(props) {
        const searchQuery = ref<string>('')
        const sortKey = ref<string | ''>('')
        const sortOrder = ref<1 | -1>(1)
        const curPage = ref<number>(1)
        const rowsPerPage = ref<number>(10)
        const filteredRows = computed(() => {
            let rows = [...props.rows]
            if (searchQuery.value) {
                const query = searchQuery.value.toLowerCase()
                rows = _.filter(rows, (item) =>
                    Object.values(item).join(' ').toLowerCase().includes(query)
                )
            }
            if (sortKey.value) {
                rows = _.orderBy(rows, [sortKey.value], [sortOrder.value === 1 ? 'asc' : 'desc'])
            }
            return rows
        })
        const paginatedRows = computed(() => {
            const start = (curPage.value - 1) * rowsPerPage.value
            return _.slice(filteredRows.value, start, start + rowsPerPage.value)
        })
        const emptyRows = computed(() => {
            const remainingRows = rowsPerPage.value - paginatedRows.value.length
            return _.times(remainingRows, () => ({}))
        })
        const totalPages = computed(() => Math.ceil(filteredRows.value.length / rowsPerPage.value))
        const sortTable = (key: string) => {
            if (sortKey.value === key) {
                sortOrder.value = sortOrder.value === 1 ? -1 : 1
            } else {
                sortKey.value = key
                sortOrder.value = 1
            }
        }
        const onPrev = () => {
            if (curPage.value > 1) {
                curPage.value--
            }
        }
        const onNext = () => {
            if (curPage.value < totalPages.value) {
                curPage.value++
            }
        }
        watch(rowsPerPage, () => {
            curPage.value = 1
        })
        return () => (
            <div class="data-table flex flex-col h-full w-full">
                <div class="data-table__header flex justify-between">
                    <text-field v-model={searchQuery.value} placeholder="검색하기" />
                    <select v-model={rowsPerPage.value} class="flex items-center box-shadow">
                        {props.selectPerPages.map((count) => (
                            <option value={count}>{count}개 씩</option>
                        ))}
                    </select>
                </div>
                <div class="data-table__content">
                    <table class="box-shadow">
                        <colgroup>
                            {props.columns.map((column) => (
                                <col width={column.width} />
                            ))}
                        </colgroup>
                        <thead>
                            <tr>
                                {props.columns.map((column) => (
                                    <th onClick={() => sortTable(column.field)}>
                                        {column.label ?? column.field}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedRows.value.map((row, i) => (
                                <tr key={`row-${i}`}>
                                    {props.columns.map((column) => (
                                        <td>{row[column.field]}</td>
                                    ))}
                                </tr>
                            ))}
                            {emptyRows.value.map((row, i) => (
                                <tr>
                                    {props.columns.map(() => (
                                        <td>&nbsp;</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {totalPages.value > 0 && (
                    <div class="data-table__actions flex justify-center items-center gap-4">
                        <button
                            class="btn-pagination"
                            onClick={onPrev}
                            disabled={curPage.value === 1}
                        >
                            이전
                        </button>
                        <span>
                            {curPage.value} / {totalPages.value} 페이지
                        </span>
                        <button
                            class="btn-pagination"
                            onClick={onNext}
                            disabled={curPage.value === totalPages.value}
                        >
                            다음
                        </button>
                    </div>
                )}
            </div>
        )
    }
})
