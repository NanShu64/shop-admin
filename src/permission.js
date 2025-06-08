import router from "@/router"
import { getToken } from "@/composables/auth";
import { toast } from "@/composables/util";
import store from './store'
// 全局前置守卫
// const router = createRouter({})

router.beforeEach(async(to, from, next) => {
    // async 是一个通过异步执行并隐式返回 Promise 作为结果的函数
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
    if (token) {
        //获取用户相关信息
        //异步操作
        await store.dispatch("getinfo")
    //     getinfo().then(res1 => {
    //         store.commit("SET_USERINFO", res1)
    //         console.log(res1)
    //     })
    }

    //确保 next 在任何给定的导航守卫中都被严格调用一次。
    next()
})