import { createRouter, createWebHashHistory } from "vue-router"

import Index from '@/pages/index.vue'
import About from '@/pages/about.vue'
import NotFound from '@/pages/404.vue'
import Login from '@/pages/login.vue'
import Admin from '@/layout/admin.vue'
import GoodList from '@/pages/goods/list.vue'
const routes = [
    {
        path: "/", // http://localhost:5173
        component: Admin,
        //子路由
        children: [{
            path: "/",
            component: Index,
            meta: {
                title: "后台首页"
            },
        }],
        children: [{
            path: "/goods/list",
            component: GoodList,
            meta: {
                title: "商品管理"
            },
        }],
        // children: [{
        //     path: "/",
        //     component: Index,
        //     meta: {
        //         title: "后台首页"
        //     },
        // }],
        // children: [{
        //     path: "/",
        //     component: Index,
        //     meta: {
        //         title: "后台首页"
        //     },
        // }]

    },
    {
        path: "/about", // http://localhost:5173/#/about
        component: About,
        meta: {
            title: "关于"
        }
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: NotFound
    },
    {
        path: "/login", // http://localhost:5173/#/login
        component: Login,
        meta: {
            title: "登录页"
        }
    },
]

const router = createRouter({
    //使用url的#符号之后的部分模拟url路径的变化,因为不会触发页面刷新,所以不需要服务端支持
    history: createWebHashHistory(),
    routes
})

export default router
