import axios from "@/axios";

export function getSkusList(page) {
    return axios.get(`/admin/skus/${page}`)
}
export function createSkus(data) {
    return axios.post("/admin/skus", data)
}
export function deleteSkus(ids) {
    //需要判断ids是否是数组,否则转化为数组
    ids = !Array.isArray(ids) ? [ids] : ids
    return axios.post(`/admin/skus/delete_all`, { ids })
}
export function updateSkus(id, data) {
    return axios.post("/admin/skus/" + id, data)
}
export function updateSkusStatus(id, status) {
    return axios.post(`/admin/skus/${id}/update_status`, {
        // 需要传一个对象
        status
    })
}