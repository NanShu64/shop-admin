import { createStore } from 'vuex'
import { login, getinfo } from '@/api/manager'
import { setToken, removeToken } from '@/composables/auth'
// 创建一个新的 store 实例
const store = createStore({
    state() {
        return {
            //用户信息
            user: {},
            //侧边宽度
            asideWidth: "250px"
        }
    },
    mutations: {
        //记录用户信息
        SET_USERINFO(state, use) {
            state.user = use
        },
        //展开/缩起侧边
        handleAsideWidth(state) {
            state.asideWidth = state.asideWidth == "250px"? "60px":"250px"
        }
    },
    actions: {
        // 登录 
        // 从login抽离-存储用户Token
        login({ commit }, { username, password }) {
            //获取的同时结构出来
            return new Promise((resolve, reject) => {
                login(username, password).then(res => {
                    setToken(res.token)
                    resolve(res)
                }).catch(err => reject(err))
            })
        },
        // 获取当前登录用户信息
        getinfo({ commit }) {
            return new Promise((resolve, reject) => {
                getinfo().then(res => {
                    commit("SET_USERINFO", res)
                    resolve(res)
                }).catch(err => reject(err))
            })
        },
        // 退出登录
        logout({ commit }) {
            // 移除cookie里的token
            removeToken()
            // 清除当前用户状态 vuex
            commit("SET_USERINFO", {})
        }
    }
})

export default store