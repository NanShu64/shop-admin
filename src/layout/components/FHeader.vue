<script setup>
import { logout } from '@/api/manager'
import { showModal, toast } from '@/composables/util'
import { useRouter } from 'vue-router'
import { useStore } from "vuex"
import { useFullscreen } from '@vueuse/core'

const store = useStore()
const router = useRouter()
const {
    //是否全屏状态
    isFullscreen,
    toggle
    // 切换全屏 toggle是enter, exit的合体
} = useFullscreen()


const handleCommand = (c) => {
    switch (c) {
        case "logout":
            handleLogout()
            break;
        case "rePassword":
            console.log("修改密码");
            break;
    }
}
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
//刷新
const handleRefresh = () => location.reload()
//全屏

</script>
<template>
    <div class="f-header">
        <span class="logo">
            <el-icon class="mr-2">
                <Setting />
            </el-icon>
            后台管理
        </span>

        <el-icon class="icon-btn">
            <Fold />
        </el-icon>
        <el-tooltip effect="dark" content="刷新" placement="bottom-end">
            <el-icon class="icon-btn" @click="handleRefresh">
                <Refresh />
            </el-icon>
        </el-tooltip>
        <div class="ml-auto flex items-center">
            <!-- ml-auto 相当与margin-left:auto -->
            <el-tooltip effect="dark" content="全屏" placement="bottom-end">
                <el-icon class="icon-btn" @click="toggle">
                    <FullScreen v-if="!isFullscreen"/>
                    <Aim v-else/>
                </el-icon>
            </el-tooltip>
            <el-dropdown class="dropdown" @command="handleCommand">
                <span class="flex  items-center text-light-50">
                    <el-avatar class="mr-2 " :size="25" :src="$store.state.user.avatar" />
                    {{ $store.state.user.username }}
                    <el-icon class="el-icon-right">
                        <arrow-down />
                    </el-icon>
                </span>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item command="rePassword">修改密码</el-dropdown-item>
                        <el-dropdown-item command="logout">退出登录</el-dropdown-item>
                        <!-- <el-dropdown-item>Action 3</el-dropdown-item> -->
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
        <!-- {{ $store.state.user }} -->
    </div>
</template>


<style scoped>
.f-header {
    @apply flex items-center bg-green-500 text-light-50 fixed top-0 left-0 right-0;
    height: 64px;
}

.logo {
    @apply flex justify-center items-center text-light-50 text-xl font-sans;
    width: 280px;
}

.icon-btn {
    @apply flex justify-center items-center;
    width: 45px;
    height: 64px;
    cursor: pointer;
}

.icon-btn:hover {
    @apply bg-green-400;
}

.f-header .dropdown {
    @apply flex justify-center items-center mx-6;
    height: 64px;
    cursor: pointer;
}

.f-header .dropdown :hover {
    @apply bg-green-400;
}
</style>