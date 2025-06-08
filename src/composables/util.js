import { ElNotification } from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus'

//消息提示
export function toast(title = "成功", message, type = "success", dangerouslyUseHTMLString = false) {
    ElNotification({
        title,
        message,
        type,
        dangerouslyUseHTMLString,
        duration: 3000,
    })
}
//
export function showModal(content="提示内容",type="warning",title="确认消息"){
return    ElMessageBox.confirm(
    content,
    title,
    {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type,
    }
)
}