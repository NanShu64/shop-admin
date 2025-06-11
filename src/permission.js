import { router, addRoutes } from "@/router"
import { getToken } from "@/composables/auth";
import { toast, showFullLoading, hideFullLoading } from "@/composables/util";
import store from './store'
// 全局前置守卫
// const router = createRouter({})
//防止重复性加载getinfo
let hasGetInfo = false
router.beforeEach(async (to, from, next) => {
    // async 是一个通过异步执行并隐式返回 Promise 作为结果的函数

    //显示loading
    showFullLoading()
    const token = getToken()
    //没有登录且去往非登录页，强制跳转登录页
    if (!token && to.path != "/login") {
        toast("通知", "请先登录", "error")
        return next({ path: "/login" })
    }
    //防止重复登录,登录且跳转登录页
    if (token && to.path == "/login") {
        toast("通知", "已登录，请勿重复登录", "warning")
        return next({ path: from.path ? from.path : "/" })
    }
    //如果用户登录了，自动获取登录用户信息，并存储在vuex当中
    let hasNewRoutes = false
    if (token && !hasGetInfo) {
        //获取用户相关信息
        //异步操作
        let { menus } = await store.dispatch("getinfo")
        hasGetInfo = true
        //动态添加路由
        hasNewRoutes = addRoutes(menus)

    }
    //设置页面标题
    let title = (to.meta.title ? to.meta.title : "") + "-后台管理"
    document.title = title
    //确保 next 在任何给定的导航守卫中都被严格调用一次。
    hasNewRoutes ? next(to.fullPath) : next()
})
//全局后置守卫
router.afterEach((to, from) => hideFullLoading())