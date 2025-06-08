import router from "@/router"
import { getToken } from "@/composables/auth";
import { toast } from "@/composables/util";
// 全局前置守卫
// const router = createRouter({})

router.beforeEach((to, from, next) => {
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
    //确保 next 在任何给定的导航守卫中都被严格调用一次。
    next()
})