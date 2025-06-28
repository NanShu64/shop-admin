<script setup>
import { ref } from 'vue'
import { useInitTable, useInitForm } from '@/composables/useCommon.js'
import ListHeader from '@/components/ListHeader.vue'
import FormDrawer from '@/components/FormDrawer.vue'
import GoodsDrawer from "./components/GoodsDrawer.vue"
import {
    getCategoryList,
    createCategory,
    updateCategory,
    updateCategoryStatus,
    deleteCategory
} from "@/api/category.js"

//定义一个空数值,保存角色列表数据
const options = ref([])
const {
    loading,
    tableData,
    getData,
    handleDelete,
    handleStatusChange
} = useInitTable({
    getList: getCategoryList,
    onGetListSuccess: (res) => {
        tableData.value = res
        //拿到列表数据拿到一级节点的id赋值给defaultExpandedKeys.value
    },
    delete: deleteCategory,
    updateStatus: updateCategoryStatus
})
const {
    formDrawerRef,
    formRef,
    form,
    rules,
    drawerTitle,
    handleSubmit,
    handleCreate,
    handleEdit
} = useInitForm({
    form: {
        name: "",
    },
    rules: {},
    getData,
    update: updateCategory,
    create: createCategory,

})
// 创建响应式引用（ref），初始值为`null`
const GoodsDrawerRef = ref(null)
// 打开抽屉方法
const openGoodsDrawer = (data) => GoodsDrawerRef.value.open(data)
</script>
<template>
    <el-card shadow="never" class="border-0">
        <!-- 新增|刷新  -->
        <ListHeader @create="handleCreate" @refresh="getData" />
        <el-tree :data="tableData" :props="{ label:'name',children:'child' }" v-loading="loading" node-key="id">
            <template #default="{ node, data }">
                <div class="custom-tree-node">
                    <span>{{ data.name }}</span>
                    <div class="ml-auto">
                        <el-button text type="primary" size="small" @click.stop="openGoodsDrawer(data)">推荐商品</el-button>
                        <el-switch :modelValue="data.status" :active-value="1" :inactive-value="0"
                            @change="handleStatusChange($event,data)" />
                        <el-button text type="primary" size="small" @click.stop="handleEdit(data)">修改</el-button>
                        <el-popconfirm title="是否要删除该商品分类？" confirmButtonText="确认" cancelButtonText="取消"
                            @confirm="handleDelete(data.id)">
                            <template #reference>
                                <el-button text type="primary" size="small">删除</el-button>
                            </template>
                        </el-popconfirm>
                    </div>

                </div>
            </template>
        </el-tree>

        <FormDrawer ref="formDrawerRef" :title="drawerTitle" @submit="handleSubmit">
            <el-form ref="formRef" :model="form" :rules="rules" label-width="80px" :inline="false">
                <el-form-item label="分类名称" prop="name">
                    <el-input v-model="form.name" placeholder="分类名称" />
                </el-form-item>
            </el-form>
        </FormDrawer>

        <!-- 推荐商品抽屉 -->
        <GoodsDrawer ref="GoodsDrawerRef" />
    </el-card>
</template>


<style scoped>
.custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    font-size: 14px;
    padding-right: 8px;
}

.el-tree-node__content {
    padding: 20px 0;
}
</style>