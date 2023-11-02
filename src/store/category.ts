import _ from 'lodash'
import store from '@/store'
const getCategory = (): Category | false => {
    const category = store.get('category')
    if (!(category instanceof Category)) {
        return false
    }
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
