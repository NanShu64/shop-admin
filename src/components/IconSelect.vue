<script setup>
import { ref } from 'vue'
import * as iconList from '@element-plus/icons-vue'
defineProps({
    modelValue:String
})
const icons = ref(Object.keys(iconList))

const emit = defineEmits(["update:modelValue"])
const handleChange = (icon) => {
    // icon选中值 
    emit("update:modelValue",icon)
}

</script>
<template>
    <div class="flex items-center">
        <!-- 动态图标渲染-->
        <el-icon :size="20" v-if="modelValue" class="mr-2">
            <!-- 动态图标 -->
            <component :is="modelValue" />
        </el-icon>
        <el-select fillterable :methodValue="methodValue" placeholder="请选择图标" @change="handleChange">
            <el-option v-for=" item in icons" :key="item" :label="item" :value="item">
                <div class="flex items-center justify-between">
                    <el-icon>
                        <!-- 动态图标 -->
                        <component :is="item"/>
                    </el-icon>
                    <span class="text-gray-500">{{ item }}</span>
                </div>
            </el-option>
        </el-select>
    </div>
</template>


<style scoped></style>