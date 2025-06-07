import { ElNotification } from 'element-plus'

//消息提示
export function toast(title = "成功",message, type = "success", dangerouslyUseHTMLString = false) {
    ElNotification({
        title,
        message,
        type,
        dangerouslyUseHTMLString,
        duration: 3000,
    })
}
