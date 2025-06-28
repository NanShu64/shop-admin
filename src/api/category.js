import axios from "@/axios";
// import { queryParams } from "@/composables/util";

export function getCategoryList() {
    return axios.get(`/admin/category`)
}
export function createCategory(data) {
    return axios.post("/admin/category", data)
}
export function deleteCategory(id) {
    return axios.post(`/admin/category/${id}/delete`)
}
export function updateCategory(id, data) {
    return axios.post("/admin/category/" + id, data)
}
export function updateCategoryStatus(id, status) {
    return axios.post(`/admin/category/${id}/update_status`, {
        status
    })
}
// 分类关联产品列表
export function getCategoryGoods(id){
    return  axios.get(`/admin/app_category_item/list?category_id=${id}`)
}

export function deleteCategoryGoods(id){
    return axios.post(`/admin/app_category_item/${id}/delete`)
}
// 关联
export function connectCategoryGoods(data){
    return axios.post(`/admin/app_category_item`,data)
}
