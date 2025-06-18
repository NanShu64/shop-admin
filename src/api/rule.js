import axios from '@/axios'

export function getRuleList(page) {
    return axios.get(`/admin/rule/${page}`)
}
export function createRule(data) {
    return axios.post("/admin/rule", data)
}
export function updateRule(id, data) {
    return axios.post("/admin/rule/" + id, data)
}
export function updateRuleStatus(id, status) {
    return axios.post(`/admin/rule/${id}/update_status`, {
        // 需要传一个对象
        status
    })
}
export function deleteRule(id) {
    return axios.post(`/admin/rule/${id}/delete`)
}