<script setup>
import {
    getRoleList,
    createRole,
    updateRole,
    deleteRole,
    updateRoleStatus,
    setRoleRules
} from "@/api/role"
import {
    getRuleList
} from "@/api/rule"
import FormDrawer from '@/components/FormDrawer.vue';
import ListHeader from '@/components/ListHeader.vue';
import { useInitTable, useInitForm } from '@/composables/useCommon.js'
import { ref } from "vue";
import { toast } from "@/composables/util";

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
    getList: getRoleList,
    delete: deleteRole,
    updateStatus: updateRoleStatus
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
        desc: "",
        status: 1
    },
    rules: {
        name: [{
            required: true,
            message: '角色名不能为空',
            trigger: 'blur'
        }],
    },
    getData,
    update: updateRole,
    create: createRole

})
//绑定动态节点
const setRuleFormDrawerRef = ref(null)
const ruleList = ref(null)
//定义空数组
const defaultExpandedKeys = ref([])
//权限配置抽屉默认高度
const treeHeight = ref(0)
const roleId = ref(0)
//选中的节点
const elTreeRef = ref(null)
// 当前角色拥有的权限ID=默认选中的节点
const ruleIds = ref([])

//默认父子关联
const checkStrictly = ref(false)
const openSetRule = (row) => {
    //等于当前对象id
    roleId.value = row.id
    //权限配置抽屉高度=浏览器可视内容高度-170
    treeHeight.value = window.innerHeight - 180
    //拿到数据后，设置默认数据后，再父子关联
    checkStrictly.value = true


    // 传第一页数据
    getRuleList(1).then(res => {
        // roleId.value = row.id
        //拿到对应数据
        ruleList.value = res.list
        //拿到列表数据拿到一级节点的id赋值给defaultExpandedKeys.value
        defaultExpandedKeys.value = res.list.map(o => o.id)
        //拿完数据之后打开弹框
        setRuleFormDrawerRef.value.open()
        // 打开弹框之后，获取当前角色拥有的权限ID
        ruleIds.value = row.rules.map(o => o.id)
        setTimeout(() => {
            elTreeRef.value.setCheckedKeys(ruleIds.value)
            //父子关联
            checkStrictly.value = false
        }, 150);
    })
}
//配置权限方法
const handleSetRuleSubmit = () => {
    //打开弹框
    setRuleFormDrawerRef.value.showLoading()
    setRoleRules(roleId.value, ruleIds.value).then(res => {
        // 提示
        toast("通知", "配置成功", "success")
        //刷新页面数据
        getData()
        //关闭弹框
        setRuleFormDrawerRef.value.close()
    }).finally(() => {
        setRuleFormDrawerRef.value.hideLoading()
    })
}
const handleTreeCheck = (...e) => {
    //将checkedKeys, halfCheckKeys解构出来
    const { checkedKeys, halfCheckedKeys } = e[1]
    ruleIds.value = [...checkedKeys, ...halfCheckedKeys]
}

</script>
<template>
    <el-card shadow="never" class="border-0">
        <!-- 新增|刷新 -->
        <ListHeader @create="handleCreate" @refresh="getData" />

        <el-table :data="tableData" stripe style="width: 100%;" v-loading="loading">
            <el-table-column prop="name" label="角色名称" />
            <el-table-column prop="desc" label="角色描述" width="380" />
            <el-table-column label="状态" width="120" align="center">
                <template #default="{ row }">
                    <el-switch :modelValue="row.status" :active-value="1" :inactive-value="0"
                        :loading="row.statusLoading" :disabled="row.super == 1"
                        @change="handleStatusChange($event,row)">
                        <!-- :disabled="row.super == 1" 超级管理员不允许修改 -->
                    </el-switch>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="250" align="center">
                <template #default="scope">
                    <el-button text type="primary" size="small" @click.stop="openSetRule(scope.row)">权限配置</el-button>
                    <el-button text type="primary" size="small" @click.stop="handleEdit(scope.row)">修改</el-button>
                    <el-popconfirm title="是否要删除该记录？" confirmButtonText="确认" cancelButtonText="取消"
                        @confirm="handleDelete(scope.row.id)">
                        <template #reference>
                            <el-button text type="primary" size="small">删除</el-button>
                        </template>
                    </el-popconfirm>

                </template>
            </el-table-column>
        </el-table>
        <div class="flex items-center justify-center mt-5">
            <el-pagination background layout="prev,pager,next" :total="total" :current-page="currentPage"
                :page-size="limit" @current-change="getData" />
        </div>

        <FormDrawer ref="formDrawerRef" :title="drawerTitle" @submit="handleSubmit">
            <el-form ref="formRef" :model="form" :rules="rules" status-icon label-width="80px" :inline="false">
                <el-form-item label="角色名称" prop="name">
                    <el-input v-model="form.title" placeholder="角色名称" />
                </el-form-item>
                <el-form-item label="角色描述" prop="desc">
                    <el-input v-model="form.content" placeholder="角色描述" type="textarea" :rows="5" />
                </el-form-item>
                <el-form-item label="状态" prop="status">
                    <el-switch v-model="form.status" :active-value="1" :inactive-value="0">
                    </el-switch>
                </el-form-item>
            </el-form>
        </FormDrawer>

        <!-- 权限配置 -->
        <FormDrawer ref="setRuleFormDrawerRef" title="权限配置" @submit="handleSetRuleSubmit">
            <el-tree-v2 ref="elTreeRef" node-key="id" :default-expanded-keys="defaultExpandedKeys" :data="ruleList"
                :props="{ label:'name',children:'child' }" show-checkbox :height="treeHeight" @check="handleTreeCheck"
                :check-strictly="checkStrictly">
                <template #default="{ node,data }">
                    <div class="flex items-center">
                        <el-tag :type="data.menu ? '' : 'info'" size="small">
                            {{ data.menu ? "菜单" : "权限" }}
                        </el-tag>
                        <span class="ml-2 text-sm"> {{ data.name }} </span>
                    </div>
                </template>
            </el-tree-v2>
        </FormDrawer>
    </el-card>
</template>