import axios from "@/axios";
import { queryParams } from "@/composables/util";
export function login(username, password) {
    return axios.post("/admin/login", {
        username,
        password
    })
}

export function getinfo() {
    return axios.post("/admin/getinfo")
}

export function logout() {
    return axios.post("/admin/logout")
}

export function updatepassword(data) {
    return axios.post("/admin/updatepassword", data)
}

export function getManagerList(page, query = {}) {
    //将对象转成url需要传递的参数，然后拼接
    let r = queryParams(query)
    return axios.get(`/admin/manager/${page}${r}`)
}
export function updateManagerStatus(id, status) {
    return axios.post(`/admin/manager/${id}/update_status`, {
        // 需要传一个对象
        status
    })
}
export function createManager(data) {
    return axios.post("/admin/manager", data)
}
export function deleteManager(id) {
    return axios.post(`/admin/manager/${id}/delete`)
}
export function updateManager(id, data) {
    return axios.post(`/admin/manager/${id}`, data)
}


