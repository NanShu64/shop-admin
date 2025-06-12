//注册一个全局自定义指令
import store from "@/store"
//注册方法判断是否有别名
function hasPermission(value, el = false) {
    if (!Array.isArray(value)) {
        throw new Error(`需要配置权限，例如 v-permission="['getStatistics3,GET']"`)
    }
    const hasAuth = value.findIndex(v => store.state.ruleNames.includes(v)) != -1
    //判断是否有权限
    if (el && !hasAuth) {
        el.parentNode && el.parentNode.removeChild(el)
    }
    return hasAuth
}

export default {
    // 导出一个install方法
    install(app) {
        //自定义指令需要通过 directives 选项注册
        app.directive("permission", {
            //mounted在组件被挂载之后调用
            mounted(el, binding) {
                // binding.value就是数组的值,也就是别名['getStatistics3,GET']
                // binding.value == rulername
                hasPermission(binding.value, el)
            }

        })
    }
}


