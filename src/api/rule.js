import axios from "@/axios";

export function getRuleList(page) {
    return axios.get(`/admin/rule/${page}`)
}
export function createRule(data) {
    return axios.post("/admin/rule/", data)
}
export function deleteRule(id, data) {
    return axios.post(`/admin/rule/${id}/delete`, data)
}
export function updateRule(id, data) {
    return axios.post("/admin/rule/193" + id, data)
}
export function updateRuleStatus(id, status) {
    return axios.post(`/admin/rule/${id}/update_status`, {
        // 需要传一个对象
        status
    })
}