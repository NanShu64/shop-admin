<script setup>
import { ref, reactive, computed } from 'vue';
import {
    getManagerList,
    createManager,
    deleteManager,
    updateManager,
    updateManagerStatus
} from "@/api/manager.js"
import FormDrawer from '@/components/FormDrawer.vue';
import ChooseImage from '@/components/ChooseImage.vue';
import { toast } from '@/composables/util';

const searchForm = reactive({
    keyword: ""
})
const resetSearchForm = () => {
    searchForm.keyword = ""
    getData()
}
//加载动画
const loading = ref(false)
//定义一个空数值,保存列表数据
const tableData = ref([])

// 分页部分
const currentPage = ref(1)
const total = ref(0)
// 每页显示的条数
const limit = ref(10)
//定义一个空数值,保存角色列表数据
const roles = ref([])
//获取数据
function getData(p) {
    if (typeof p == "number") {
        currentPage.value = p
    }
    //loading的状态设为true 
    loading.value = true
    //获取最新的数据
    getManagerList(currentPage.value, searchForm)
        .then(res => {
            //总数赋值给total
            tableData.value = res.list.map(o => {
                o.statusLoading = false
                //修改loading状态
                return o
            })
            total.value = res.totalCount
            roles.value = res.roles
        }).finally(() => {
            loading.value = false
        })
}
getData()

//初始化
const formDrawerRef = ref(null)
// 表单的ref默认为null
const formRef = ref(null)
//
const form = reactive({
    username: "",
    password: "",
    role_id: null,
    status: "",
    avatar: ""

})
//验证规则
const rules = {
    username: [
        {
            required: true,
            message: '用户名不能为空',
            trigger: 'blur'
        },
    ],
    password: [
        {
            required: true,
            message: '密码不能为空',
            trigger: 'blur'
        },
    ],
}
//标识区别新增和编辑（修改
const editId = ref(0)
const drawerTitle = computed(() => editId.value ? "修改" : "新增")
//提交方法
const handleSubmit = () => {
    formRef.value.validate((valid) => {
        //form表单节点当中的valuedata的回调，用valid来接收
        if (!valid) return
        //如果valid=false,就终止
        //提交按钮处于loading状态
        formDrawerRef.value.showLoading()
        //修改或新增
        const fun = editId.value ? updateManager(editId.value, form) : createManager(form)
        //传入name和order它们等于form
        fun.then(res => {
            //提示提交成功
            toast("通知", drawerTitle.value + "成功", "success")
            //重新加载数据,如果是修改就传刷新当前页的，新增刷新第一页
            getData(editId.value ? false : 1)
            //关闭抽屉
            formDrawerRef.value.close()
        }).finally(() => {
            //请求结束隐藏loading状态
            formDrawerRef.value.hideLoading()
        })
    })
}
//重置表单
function resetForm(row = false) {
    if (formRef.value) formRef.value.clearValidate()
    if (row) {
        for (const key in form) {
            form[key] = row[key]
        }
    }
}
//新增方法
const handleCreate = () => {
    editId.value = 0
    //定义初始值
    resetForm({
        username: "",
        password: "",
        role_id: null,
        status: "",
        avatar: ""
    })
    formDrawerRef.value.open()
}
//修改状态
const handleStatusChange = (status, row) => {
    row.statusloading = true
    // $event>status
    //拿到当前对象的id
    updateManagerStatus(row.id, status)
        .then(res => {
            toast("通知", "修改状态成功", "success")
            row.status = status
            //重新调用当页的数据
            getData()
        })
        .finally(() => {
            row.statusloading = false
        })
}
// 删除方法
const handleDelete = (id) => {
    loading.value = true
    deleteManager(id)
        .then(res => {
            toast("通知", "删除成功", "success")
            //重新调用当页的数据
            getData()
        })
        .finally(() => {
            loading.value = false
        })
}
//修改(编辑方法
const handleEdit = (row) => {
    resetForm(row)
    // 等于当前对象id
    editId.value = row.id
    formDrawerRef.value.open()
}


</script>
<template>
    <el-card shadow="never" class="border-0">
        <!-- 搜索 -->
        <el-form :model="searchForm" label-width="80px" class="mb-3" size="small">
            <el-row :gutter="20">
                <el-col :span="8" :offset="0">
                    <el-form-item label="关键词">
                        <el-input v-model="searchForm.keyword" placeholder="管理员昵称" clearable></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8" :offset="8">
                    <div class="flex items-center justify-end">
                        <el-button type="primary" @click="getData">搜索</el-button>
                        <el-button @click="resetSearchForm">重置</el-button>
                    </div>
                </el-col>
            </el-row>
        </el-form>

        <!-- 新增|刷新 -->
        <div class="flex items-center justify-between mb-4">
            <el-button type="primary" size="small" @click="handleCreate">新增</el-button>
            <el-tooltip effect="dark" content="刷新数据" placement="top">
                <el-button text @click="getData">
                    <el-icon :size="20">
                        <Refresh />
                    </el-icon>
                </el-button>
            </el-tooltip>
        </div>
        <el-table :data="tableData" stripe style="width: 100%;" v-loading="loading">
            <el-table-column label="管理员" width="200">
                <template #default="{ row }">
                    <div class="flex items-center ">
                        <el-avatar :size="40" :src="row.avatar">
                            <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png" />
                        </el-avatar>
                        <div class="ml-3">
                            <h6>
                                {{ row.username }}
                            </h6>
                            <small>
                                ID:{{ row.id }}
                            </small>
                        </div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="create_time" label="所属角色" align="center">
                <template #default="{ row }">
                    {{ row.role ?.name|| "-" }}
                    <!-- row.role.name : ''可以简写成 .name|| "-" -->
                </template>
            </el-table-column>
            <el-table-column prop="create_time" label="状态" width="120" align="center">
                <template #default="{ row }">
                    <el-switch :modelValue="row.status" :active-value="1" :inactive-value="0"
                        :loading="row.statusLoading" :disabled="row.super == 1"
                        @change="handleStatusChange($event,row)">
                        <!-- :disabled="row.super == 1" 超级管理员不允许修改 -->
                    </el-switch>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="180" align="center">
                <template #default="scope">
                    <small v-if="scope.row.super == 1" class="text-sm text-gray-500 ">暂无操作</small>
                    <div v-else>
                        <el-button type="primary" size="small" text @click="handleEdit(scope.row)">修改</el-button>
                        <el-popconfirm title="是否要删除该管理员？" confirmButtonText="确认" cancelButtonText="取消"
                            @confirm="handleDelete(scope.row.id)">
                            <template #reference>
                                <el-button type="primary" size="small" text>删除</el-button>
                            </template>
                        </el-popconfirm>
                    </div>
                </template>
            </el-table-column>
        </el-table>

        <div class="flex items-center justify-center mt-5">
            <el-pagination background layout="prev,pager,next" :total="total" :current-page="currentPage"
                :page-size="limit" @current-change="getData" />
        </div>

        <FormDrawer ref="formDrawerRef" :title="drawerTitle" @submit="handleSubmit">
            <el-form ref="formRef" :model="form" status-icon label-width="80px" :inline="false">
                <el-form-item label="用户名" prop="username">
                    <!-- 用了:rules="rules"验证规则，需要声明哪个字段 prop="title" -->
                    <el-input v-model="form.username" placeholder="用户名" />
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="form.password" placeholder="密码" />
                    <!-- :rows="5" 显示5列 -->
                </el-form-item>
                <el-form-item label="头像" prop="avatar">
                    <ChooseImage v-model="form.avatar" />
                </el-form-item>
                <el-form-item label="所属角色" prop="role_id">
                    <el-select v-model="form.role_id" placeholder="选择所属角色">
                        <el-option v-for="item in roles" :key="item.id" :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="状态" prop="content">
                    <el-switch v-model="form.status" :active-value="1" :inactive-value="0">
                    </el-switch>
                </el-form-item>
            </el-form>
        </FormDrawer>
    </el-card>

</template>