<script setup>
import { computed } from 'vue';
const props = defineProps({
    layout: {
        type: String,
        default: "create,refresh"
    }
})
//接收到的值转成数组
const btns = computed(() => props.layout.split(","))

defineEmits(["create", "refresh", "delete", "download"])

</script>
<template>
    <!-- 新增|刷新 -->
    <div class="flex items-center justify-between mb-4">
        <div>
            <el-button v-if="btns.includes('create')" type="primary" size="small"
                @click="$emit('create')">新增</el-button>
            <el-popconfirm v-if="btns.includes('delete')" title="是否要删除选中记录？" confirmButtonText="确认"
                cancelButtonText="取消" @confirm="$emit('delete')">
                <template #reference>
                    <el-button size="small" type="danger" @click="">批量删除</el-button>
                </template>
            </el-popconfirm>
            <slot />
        </div>
        <div>
            <el-tooltip v-if="btns.includes('refresh')" effect="dark" content="刷新数据" placement="top">
                <el-button size="small" text @click="$emit('refresh')">
                    <el-icon :size="15">
                        <Refresh />
                    </el-icon>
                </el-button>
            </el-tooltip>
            <el-tooltip v-if="btns.includes('download')" effect="dark" content="导出数据" placement="top">
                <el-button size="small" text @click="$emit('download')">
                    <el-icon :size="15">
                        <Download />
                    </el-icon>
                </el-button>
            </el-tooltip>
        </div>
    </div>
</template>


<style scoped></style>