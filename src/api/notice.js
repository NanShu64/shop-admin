import axios from "@/axios";

export function getNoticeList(page) {
    return axios.get(`/admin/notice/${page}`)
}
export function updateNotice(id, name) {
    return axios.post(`/admin/notice/${id}`, { name })
}
export function deleteNotice(id) {
    return axios.post(`/admin/notice/{$id}/delete`,)
}
export const updateNoticeAction = "/api/admin/notice/upload"
