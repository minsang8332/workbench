import VueRouter from 'vue-router'
const routes = [
    {
        name: 'root',
        path: '/',
        children: [],
    },
]
const router = new VueRouter({
    mode: 'history',
    routes,
})
export default router
