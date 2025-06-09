<script setup>
import handleLogout from '@/pages/index.vue'
</script>
<template>
    <div class="f-header">
        <span class="logo">
            <el-icon>
                <Setting />
            </el-icon>
            后台管理
        </span>

        <el-icon>
            <Fold />
        </el-icon>
        <el-icon>
            <RefreshRight />
        </el-icon>

        <div class="ml-auto">
            <!-- ml-auto 相当与margin-left:auto -->
            <el-icon>
                <FullScreen />
            </el-icon>
            <el-dropdown size="large" split-button type="primary">
                <span class="el-dropdown-link">
                    <el-avatar :size="25" :src="$store.state.user.avatar" />
                    {{ $store.state.user.username }}
                    <el-icon class="el-icon-right">
                        <arrow-down />
                    </el-icon>
                </span>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item>修改密码</el-dropdown-item>
                        <el-dropdown-item>handleLogout()退出登录</el-dropdown-item>
                        <el-dropdown-item>Action 3</el-dropdown-item>
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
    @apply flex justify-center items-center text-light-50 text-xl;
    width:280px;
}
</style>