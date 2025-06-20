<script setup>
import { reactive, ref, onMounted, onBeforeMount } from 'vue'
// reactive作用:创建一个响应式对象（通常是对象或数组）。ref作用：创建一个响应式引用（可以用于任何数据类型，包括基本类型）。onMounted 作用：注册一个回调函数，在组件挂载完成后执行（相当于 Vue 2 的 `mounted` 生命周期钩子）。onBeforeMount作用：注册一个回调函数，在组件挂载之前执行（相当于 Vue 2 的 `beforeMount` 生命周期钩子）。
import { toast, } from '@/composables/util'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'


const store = useStore()
const router = useRouter()
// do not use same name with ref
const form = reactive({
    username: '',
    password: ''
})
const rules = {
    username: [
        {
            required: true,
            message: '用户名不能为空',
            trigger: 'blur'// trigger: 'blur' 失去焦点时
        },
    ],
    password: [
        {
            required: true,
            message: '密码不能为空',
            trigger: 'blur'
        },
    ]
}
const formRef = ref(null)
const loading = ref(false)
const onSubmit = () => {
    formRef.value.validate((valid) => {
        if (!valid) {
            return false
        }
        loading.value = true
        store.dispatch("login", form).then(res => {
            //提示成功
            toast("通知", "登录成功", "success")
            //跳转到后台首页
            router.push("/")
        }).finally(() => {
            loading.value = false
        })
    })
}
//监听回车事件
function onKeyup(e) {
    if(e.key == "Enter") onSubmit()
}
//添加键盘的监听
onMounted(() => {
    //页面加载完毕之后调用事件
    document.addEventListener("keyup", onKeyup)
})
//移除键盘监听
onBeforeMount(() => {
    //页面卸载之前移除事件
    document.removeEventListener("keyup", onKeyup)
})

</script>
<template>
    <!-- 行提供 gutter 属性来指定列之间的间距，其默认值为0 -->
    <el-row class="login-container">
        <el-col :lg="16" :md="12" class="left">
            <!-- items-center 用于垂直居中 flex 容器的子元素 justify-center用于水平居中 flex容器的子元素flex-col类用于将Flex容器的排列方向设为列（纵向）-->
            <div>欢迎光临</div>
        </el-col>
        <el-col :lg="8" :md="12" class="rigth">
            <h2 class="title">欢迎回来</h2>
            <div>
                <!-- space-x-2 水平间隔-->
                <span class="line"></span>
                <span>账号密码登录</span>
                <span class="line"></span>
            </div>
            <el-form ref="formRef" :rules="rules" :model="form" class="w-[250px]">
                <el-form-item prop="username">
                    <el-input v-model="form.username" placeholder="请输入用户名">
                        <template #prefix>
                            <el-icon>
                                <User />
                            </el-icon>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" v-model="form.password" placeholder="请输入密码" show-password>
                        <template #prefix>
                            <el-icon>
                                <Lock />
                            </el-icon>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item>
                    <el-button round class="w-[250px] bg-green-500" type="primary" @click="onSubmit"
                        :loading="loading">登 录</el-button>
                    <!-- <el-button round class="w-[250px] ">注 册</el-button> -->
                </el-form-item>
            </el-form>
        </el-col>
    </el-row>
</template>


<style scoped>
.login-container {
    @apply min-h-screen bg-green-500;
}

.login-container .left,
.login-container .rigth {
    @apply flex items-center justify-center;
}

.login-container .rigth {
    @apply bg-light-50 flex-col;
}

.left>div:first-child {
    @apply font-bold text-light-50 text-5xl mb-5;
}

.rigth .title {
    @apply font-bold text-3xl text-gray-800;
}

.rigth>div {
    @apply flex items-center justify-center my-5 text-gray-300 space-x-2;
}

.rigth .line {
    @apply h-[1px] w-16 bg-gray-200;
}
</style>