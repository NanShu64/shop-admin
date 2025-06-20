import axios from "@/axios";

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
    let q = []
    for (const key in query) {
        if (query[key]) {
            q.push(`${key}=${encodeURIComponent(query[key])}`)
        }
    }
    let r = q.join("&")
    r = r ? ("?" + r) : ""
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


