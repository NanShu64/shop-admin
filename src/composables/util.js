import { ElNotification } from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus'
import nProgress from 'nprogress'

//消息提示
export function toast(title = "成功", message, type = "success", dangerouslyUseHTMLString = true) {
    ElNotification({
        title,
        message,
        type,
        dangerouslyUseHTMLString,
        duration: 3000,
    })
}
//
export function showModal(content = "提示内容", type = "warning", title = "确认消息") {
    return ElMessageBox.confirm(
        content,
        title,
        {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type,
        }
    )
}
//显示全屏loading
export function showFullLoading() {
    nProgress.start()
}
//隐藏全屏loading
export function hideFullLoading() {
    nProgress.done()
}
//弹出输入框
export function showPrompt(tip,value="") {
    return ElMessageBox.prompt('tip', '', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        inputValue:value
    })
}
