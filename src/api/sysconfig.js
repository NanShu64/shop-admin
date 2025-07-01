import axios from "@/axios"
// 获取原有系统配置
export function getSysconfig() {
    return axios.get(`/admin/sysconfig`)
}
// 修改系统配置
export function setSysconfig(data) {
    return axios.post(`/admin/sysconfig`, data)
}

export const uploadAction = "/api/admin/sysconfig/upload"