import _ from 'lodash'
import store from '@/store'
import mock from '@/mock/category'
const getCategory = (): Category | false => {
    /** @Mock 카테고리 */
    const category = mock.getCategory()
    // const category = store.get('category')
    return category
}
const setCategory = (category: Category) =>
    store.set('category', null, category)
const removeCategory = () => store.remove('category')
export default {
    getCategory,
    setCategory,
    removeCategory,
}
