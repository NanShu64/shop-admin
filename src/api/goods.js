import axios from "@/axios";
import { queryParams } from "@/composables/util";

export function getGoodsList(page, query = {}) {
    let r = queryParams(query)
    return axios.get(`/admin/goods/${page}${r}`)
}
export function updateGoodsStatus(ids, status) {
    return axios.post(`/admin/goods/changestatus`, {
        ids,
        // 需要传一个对象
        status
    })
}
export function createGoods(data) {
    return axios.post("/admin/goods", data)
}
export function deleteGoods(id) {
    return axios.post(`/admin/goods/${id}/delete`)
}
export function updateGoods(id,data){
    return axios.post(`/admin/goods/${id}`,data)
}


