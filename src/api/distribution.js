import axios from "@/axios"
import { queryParams } from "@/composables/util"


// 分销推广员列表
export function getAgentList(page, query = {}) {
    let r = queryParams(query)
    return axios.get(`/admin/agent/${page}${r}`)
}
// 分销推广人列表
export function getAgentOrderList(page, query = {}) {
    let r = queryParams(query)
    return axios.get(`/admin/user_bill/${page}${r}`)
}
// 卡片数据
export function getAgentStatistics() {
    return axios.get("/admin/agent/statistics")
}
// 获取配置
export function getConfig() {
    return axios.get(`/admin/distribution_setting/get`)
}
// 修改配置
export function setConfig(data) {
    return axios.post(`/admin/distribution_setting/set`, data)
}