import { reactive, ref } from 'vue'
import { logout, updatepassword } from '@/api/manager'
import { showModal, toast } from '@/composables/util'
import { useRouter } from 'vue-router'
import { useStore } from "vuex"



//修改密码
export function useRepassword() {
    const store = useStore()
    const router = useRouter()
    //修改密码
    //默认抽屉是关的
    const formDrawerRef = ref(null)
    const form = reactive({
        oldpassword: '',
        password: '',
        repassword: ''
    })
    //验证规则
    const rules = {
        oldpassword: [
            {
                required: true,
                message: '旧密码不能为空',
                trigger: 'blur'
            },
        ],
        password: [
            {
                required: true,
                message: '新密码不能为空',
                trigger: 'blur'
            },
        ],
        repassword: [
            {
                required: true,
                message: '确认密码不能为空',
                trigger: 'blur'
            },
        ]
    }
    const formRef = ref(null)

    const onSubmit = () => {
        formRef.value.validate((valid) => {
            //form表单节点当中的valuedata的回调，用valid来接收
            if (!valid) {
                return false
            }
            formDrawerRef.value.showLoading()
            updatepassword(form).then(res => {
                //提示修改密码成功
                toast("通知", "修改密码成功，请重新登录", "success")
                //移除cookie中的token清除当前用户状态->@/store/index.js
                store.dispatch("logout")
                //跳转到登录页
                router.push("/login")

            }).finally(() => {
                formDrawerRef.value.hideLoading()
            })
        })
    }
    const openRePasswordForm = () => formDrawerRef.value.open()


    return {
        formDrawerRef,
        form,
        rules,
        formRef,
        onSubmit,
        openRePasswordForm
    }
}

//退出登录
export function useLogout() {
    const store = useStore()
    const router = useRouter()
    function handleLogout() {
        showModal("是否要退出登录？").then(res => {
            logout()
                .finally(() => {
                    //移除cookie中的token清除当前用户状态->@/store/index.js
                    store.dispatch("logout")
                    //跳转回登录页
                    router.push("/login")
                    //提示退出登录成功
                    toast("通知", "退出登录成功", "success")
                })
        })
    }
    return {
        handleLogout
    }
}