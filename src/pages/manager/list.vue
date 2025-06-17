<script setup>
import { ref, reactive, computed } from 'vue';
import {
    getManagerList,
    // createManager,
    // deleteManager,
    // updateManager
} from "@/api/manager.js"
import FormDrawer from '@/components/FormDrawer.vue';
import { toast } from '@/composables/util';



//加载动画
const loading = ref(false)
//定义一个空数值,保存列表数据
const tableData = ref([])

// 分页部分
const currentPage = ref(1)
const total = ref(0)
// 每页显示的条数
const limit = ref(10)
//获取数据
function getData(p) {
    if (typeof p == "number") {
        currentPage.value = p
    }
    //loading的状态设为true 
    loading.value = true
    //获取最新的数据
    getManagerList(currentPage.value
        // , {
        //     limit: 10,
        //     keyword: "ceshi"
        // }
    )
        .then(res => {
            //总数赋值给total
            tableData.value = res.list
            total.value = res.totalCount
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
    title: "",
    content: ""
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
        title: "",
        content: ""
    })
    formDrawerRef.value.open()
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
    <div>
        <el-card shadow="never" class="border-0">
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
                                <img src="" />
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
                        <el-switch :modelValue="row.status" :active-value="1" :inactive-value="0">
                        </el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template #default="scope">
                        <el-button type="primary" size="small" text @click="handleEdit(scope.row)">修改</el-button>
                        <el-popconfirm title="是否要删除该管理员？" confirmButtonText="确认" cancelButtonText="取消"
                            @confirm="handleDelete(scope.row.id)">
                            <template #reference>
                                <el-button type="primary" size="small" text>删除</el-button>
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
                    <el-form-item label="用户名" prop="title">
                        <!-- 用了:rules="rules"验证规则，需要声明哪个字段 prop="title" -->
                        <el-input v-model="form.title" placeholder="用户名" />
                    </el-form-item>
                    <el-form-item label="密码" prop="password">
                        <el-input v-model="form.password" placeholder="密码" type="textarea" :rows="5" />
                        <!-- :rows="5" 显示5列 -->
                    </el-form-item>
                    <el-form-item label="头像" prop="content">
                        <el-input v-model="form.content" placeholder="头像" type="textarea" :rows="5" />
                        <!-- :rows="5" 显示5列 -->
                    </el-form-item>
                    <el-form-item label="所属角色" prop="content">
                        <el-input v-model="form.content" placeholder="公告内容" type="textarea" :rows="5" />
                        <!-- :rows="5" 显示5列 -->
                    </el-form-item>
                    <el-form-item label="状态" prop="content">
                        <el-input v-model="form.content" placeholder="公告内容" type="textarea" :rows="5" />
                        <!-- :rows="5" 显示5列 -->
                    </el-form-item>
                </el-form>
            </FormDrawer>
        </el-card>

    </div>
</template>