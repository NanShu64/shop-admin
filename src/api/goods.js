import axios from "@/axios";
import { queryParams } from "@/composables/util";

export function getGoodsList(page, query = {}) {
    let r = queryParams(query)
    return axios.get(`/admin/goods/${page}${r}`)
}
//批量上架/下架
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

export function deleteGoods(ids) {
    return axios.post(`/admin/goods/delete_all`, {
        ids
    })
}
//批量恢复
export function restoreGoods(ids) {
    return axios.post(`/admin/goods/restore`, {
        ids
    })
}
// 彻底删除
export function destroyGoods(ids) {
    return axios.post(`/admin/goods/destroy`, {
        ids
    })
}
export function updateGoods(id, data) {
    return axios.post(`/admin/goods/${id}`, data)
}

export function readGoods(id) {
    return axios.get(`/admin/goods/read/${id}`)
}
export function setGoodsBanner(id, data) {
    return axios.post(`/admin/goods/banners/${id}`, data)
}
export function updateGoodsSkus(id, data) {
    return axios.post(`/admin/goods/updateskus/${id}`, data)
}
export function createGoodsSkusCard(data) {
    return axios.post(`/admin/goods_skus_card`, data)
}
export function updateGoodsSkusCard(id, data) {
    return axios.post(`/admin/goods_skus_card/${id}`, data)
}
export function deleteGoodsSkusCard(id) {
    return axios.post(`/admin/goods_skus_card/${id}/delete`)
}
// 排序
export function sortGoodsSkusCard(data) {
    return axios.post(`/admin/goods_skus_card/sort`, data)
}
// 添加规格选项
export function createGoodsSkusCardValue(data) {
    return axios.post(`/admin/goods_skus_card_value`, data)
}
// 修改规格选项
export function updateGoodsSkusCardValue(id, data) {
    return axios.post(`/admin/goods_skus_card_value/${id}`, data)
}
// 删除规格选项
export function deleteGoodsSkusCardValue(id, data) {
    return axios.post(`/admin/goods_skus_card_value/${id}/delete`, data)
}
// 选择设置商品规格选项和值
export function chooseAndSetGoodsSkusCard(id, data) {
    return axios.post(`/admin/goods_skus_card/${id}/set`, data)
}