<script setup>
import { useTabList } from "@/composables/useTabList.js"

const {
    activeTab,
    tabList,
    changeTab,
    removeTab,
    handleClose
} = useTabList()
</script>
<template>
    <div class="f-tag-list" :style="{ left:$store.state.asideWidth }">

        <el-tabs v-model="activeTab" type="card" class="flex-1" @tab-remove="removeTab" style="min-width:100px;"
            @tab-change="changeTab">
            <el-tab-pane v-for="item in tabList" :key="item.path" :label="item.title" :name="item.path"
                :closable="item.path != '/'">
                <!-- 首页保护：意味着当标签的路径是首页（即路径为`'/'`）时，`closable`为`false`，因此首页标签的关闭按钮不会显示，用户也就无法关闭首页标签 -->
            </el-tab-pane>
        </el-tabs>

        <span class="tag-btn">
            <el-dropdown @command="handleClose">
                <span class="el-dropdown-link">
                    <el-icon>
                        <arrow-down />
                    </el-icon>
                </span>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item command="clearOther">关闭其他</el-dropdown-item>
                        <el-dropdown-item command="clearAll">全部关闭</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </span>
    </div>
    <div style="height:44px;"></div>
</template>


<style scoped>
.f-tag-list {
    @apply fixed bg-gray-100 flex items-center px-2;
    top: 64px;
    right: 0;
    height: 44px;
    z-index: 100;
}

.tag-btn {
    @apply bg-white rounded ml-auto flex items-center justify-center px-2;
    height: 32px;

}

.tag-btn .el-dropdown-link:focus-visible {
    /* 取消下拉框的悬停黑框*/
    outline: unset;
}

:deep(.el-tabs__header) {
    @apply mb-0;
    border: 0 !important;

}

:deep(.el-tabs__nav) {
    /* 边框粗细 */
    border: 0 !important;
}

:deep(.el-tabs__item) {
    /* 边框粗细 */
    border: 0 !important;
    height: 32px;
    /* 行高为32px */
    line-height: 32px;
    /* 左右间距为1 */
    @apply bg-white mx-1 rounded;
}

:deep(.el-tabs__nav-next),
:deep(.el-tabs__nav-prev) {
    line-height: 32px;
    height: 32px;
}

:deep(.is-disabled) {
    /* 鼠标指针显示为禁止 */
    cursor: not-allowed;
    @apply text-gray-300;
}
</style>