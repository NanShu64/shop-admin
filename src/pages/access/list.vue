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
        <el-tree :data="tableData" :props="{lable:'name',children='child'}" v-loading="loading" node-key="id"
            :default-expanded-keys="defaultExpandedKeys" />
    </el-card>


</template>


<style scoped></style>