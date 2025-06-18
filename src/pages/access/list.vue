<script setup>
import { ref } from 'vue';
import { useInitTable, useInitForm } from '@/composables/useCommon.js'
import ListHeader from '@/components/ListHeader.vue';
import {
    getRuleList,
    createRule,
    deleteRule,
    updateRule,
    updateRuleStatus
} from "@/api/rule.js"
const {
    tableData,
    loading,
    currentPage,
    total,
    limit,
    getData,
    handleDelete,
    handleStatusChange
} = useInitTable({
    getList: getRuleList,
    onGetListSuccess: (res) => {
        //总数赋值给total 
        tableData.value = res.list
        defaultExpandedkeys.value = res.list.map(o => o.id)
    },
    delete: deleteRule,
    updateStatus: updateRuleStatus,
})
const defaultExpandedkeys = ref([])
</script>
<template>
    <el-card shadow="never" class="border-0">
        <!-- 新增|刷新  -->
        <ListHeader @create="handleCreate" @refresh="getData" />
        <el-tree :data="tableData" :props="{ label:'name',children:'child' }" v-loading="loading" node-key="id"
            :default-expanded-keys="defaultExpandedKeys">
            <template #default="{ node, data }">

                <div class="custom-tree-node ">
                    <el-tag type="success" size="small" :type="data.menu ? '':'info'">{{ data.menu ?
                        "菜单":"权限"}}</el-tag>
                    <el-icon v-if="data.icon" :size="16" class="ml-2">
                        <component :is="data.icon" />
                    </el-icon>
                    <span>{{ data.name }}</span>
                    <div class="ml-auto">
                        <el-switch :modelValue="status" :active-value="1" :inactive-value="0" />
                        <!-- :loading="row.statusLoading"  @change="handleStatusChange($event,row)" -->
                        <el-button text type="primary" size="small" link @click="append(data)">修改</el-button>
                        <el-button text type="primary" size="small" link @click="remove(node, data)">增加</el-button>
                        <el-button text type="primary" size="small" link @click="remove(node, data)">删除</el-button>
                    </div>
                </div>
            </template>
        </el-tree>

    </el-card>


</template>


<style scoped>
.custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    font-size: 14px;
    padding-right: 8px;
    @apply
}

.el-tree-node__content {
    padding: 20px 0;
}
</style>