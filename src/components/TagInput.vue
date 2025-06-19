<script setup>
import { ref, watch } from 'vue'
const props = defineProps({
    modelValue: String
})
const emit = defineEmits(["update:modelValue"])
// 初始化标签数组
const dynamicTags = ref(props.modelValue ? props.modelValue.split(',') : [])
// 监听父组件传入的值变化
watch(() => props.modelValue, (newVal) => {
    dynamicTags.value = newVal ? newVal.split(',') : []
})
// 标签变化时触发更新
const handleTagsChange = () => {
    emit("update:modelValue", dynamicTags.value.join(","))
}
</script>
<template>
    <el-input-tag v-model="dynamicTags" placeholder="添加值" clearable @change="handleTagsChange" />
</template>


<style scoped>
/* 基本功能：
直接在输入框中输入内容，按回车添加标签
点击标签上的关闭按钮可删除标签
点击输入框右侧的清除按钮可清空所有标签 */
</style>