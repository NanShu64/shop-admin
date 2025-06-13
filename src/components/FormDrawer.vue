<script setup>
import { ref } from 'vue'

//默认抽屉是关的     
const showDrawer = ref(false)

//打开
const open = () => showDrawer.value = true
//关闭
const close = () => showDrawer.value = false
//暴露方法
const prop = defineProps({
    title: String,
    size: {
        type: String,
        default: "45%",
    },
    destroyOnClose: {
        type: Boolean,
        default: false
    },
    confirmText: {
        type: String,
        default: "提交"
    },
})
//加载 
const loading = ref(false)
const showLoading = () => loading.value = true
const hideLoading = () => loading.value = false
//提交
const emit = defineEmits(['submit'])
const submit = () => emit("submit")
// 使用 <script setup> 的组件是默认关闭的,可以通过 defineExpose 编译器宏来显式指定在 <script setup> 组件中要暴露出去的属性
defineExpose({
    open,
    close,
    showLoading,
    hideLoading
})
</script>
<template>
    <el-drawer v-model="showDrawer" :title="title" :size="size " :destroy-on-close="destroyOnClose"
        :close-on-click-modal="false">
        <div class="formDrawer">
            <div class="body">
                <slot>

                </slot>
            </div>
            <div class="actions">
                <el-button type="primary" @click="submit" :loading="loading">
                    {{confirmText}}
                </el-button>
                <el-button type="default" @click="close">
                    取消
                </el-button>
            </div>

        </div>
    </el-drawer>
</template>


<style>
.formDrawer {
    width: 100%;
    height: 100%;
    position: relative;
    @apply flex flex-col;
}

.formDrawer .body {
    flex: 1;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 50px;
    overflow-y: auto;
}

.formDrawer .actions {
    height: 50px;
    @apply mt-auto flex items-center;
}
</style>