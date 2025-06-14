<script setup>
defineProps({
    active: {
        type: Boolean,
        default: false
    }
})
defineEmits(["edit", "delete"])
</script>
<template>
    <div class="aside-list" :class="{ 'active' : active }">
        <span class="truncate">
            <!-- truncate超出部分隐藏 -->
            <slot />
        </span>
        <el-button class="ml-auto px-1" text type="primary" size="small" @click="$emit('edit')">
            <el-icon :size="12">
                <Edit />
            </el-icon>
        </el-button>

        <el-popconfirm title="是否要删除该分类？" confirmButtonText="确认" cancelButtonText="取消" @confirm="$emit('delete')">
            <template #reference>
                <el-button text class="px-1" type="primary" size="small">
                    <el-icon :size="12">
                        <Close />
                    </el-icon>
                </el-button>
            </template>
        </el-popconfirm>
    </div>
</template>


<style scoped>
.aside-list {
    border-bottom: 1px solid #f4f4f4;
    cursor: pointer;
    @apply flex items-center p-3 text-sm text-gray-600;
}

.aside-list:hover,
.active {
    @apply bg-green-50;
}
</style>