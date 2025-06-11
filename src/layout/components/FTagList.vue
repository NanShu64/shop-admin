<script setup>
import { ref } from 'vue'
//onBeforeRouteUpdate添加一个导航守卫，不论当前位置何时被更新都会触发。
import { useRoute, onBeforeRouteUpdate } from 'vue-router';
import { useCookies } from '@vueuse/integrations/useCookies';




const cookie = useCookies()
const route = useRoute()


const activeTab = ref(route.path)
const tabList = ref([
    {
        title: '后台首页',
        path: "/"
    },
])


//添加标签导航的方法
function addTab(tab) {
    let noTab = tabList.value.findIndex(t => t.path == tab.path) == -1
    if (noTab) {
        tabList.value.push(tab)
    }
    cookie.set("tabList", tabList.value)
}

// 初始化标签导航列表
function initTabList() {
    //从cookie当中拿tabList
    let tbs = cookie.get("tabList")
    //如果有的话，赋值给tbs
    if (tbs) {
        tabList.value = tbs
    }
}
//执行 
initTabList()
onBeforeRouteUpdate((to, from) => {
    //点击标签，标签处于激活状态
    activeTab.value = to.path
    addTab({
        title: to.meta.title,
        path: to.path
    })
})
const changeTab = (t) => {
    //改变当前激活标签为‘t’
    activeTab.value = t
    router.push(t)
}
const removeTab = (targetName) => {
    //点击关闭执行的方法
    // const tabs = editableTabs.value
    // let activeName = editableTabsValue.value
    // if (activeName === targetName) {
    //     tabs.forEach((tab, index) => {
    //         if (tab.name === targetName) {
    //             const nextTab = tabs[index + 1] || tabs[index - 1]
    //             if (nextTab) {
    //                 activeName = nextTab.name
    //             }
    //         }
    //     })
    // }

    // editableTabsValue.value = activeName
    // editableTabs.value = tabs.filter((tab) => tab.name !== targetName)
}
</script>
<template>
    <div class="f-tag-list" :style="{ left:$store.state.asideWidth }">

        <el-tabs v-model="activeTab" type="card" class="flex-1" @tab-remove="removeTab" style="min-width:100px;"
            @tab-change="changeTab">
            <el-tab-pane v-for="item in tabList" :key="item.path" :label="item.title" :name="item.path"
                :closable="item.path != '/'"></el-tab-pane>
        </el-tabs>

        <span class=" tag-btn">
            <el-dropdown>
                <span class="el-dropdown-link">
                    <el-icon>
                        <arrow-down />
                    </el-icon>
                </span>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item>Action 1</el-dropdown-item>
                        <el-dropdown-item>Action 2</el-dropdown-item>
                        <el-dropdown-item>Action 3</el-dropdown-item>
                        <el-dropdown-item disabled>Action 4</el-dropdown-item>
                        <el-dropdown-item divided>Action 5</el-dropdown-item>
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