<script setup>
import {
  getNoticeList,
  createNotice,
  deleteNotice,
  updateNotice
} from "@/api/notice"
import FormDrawer from '@/components/FormDrawer.vue';
import ListHeader from '@/components/ListHeader.vue';
import { useInitTable, useInitForm } from '@/composables/useCommon.js'

const {
  tableData,
  loading,
  currentPage,
  total,
  limit,
  getData,
  handleDelete
} = useInitTable({
  getList: getNoticeList,
  delete: deleteNotice
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
    title: "",
    content: ""
  },
  rules: {
    title: [{
      required: true,
      message: '公告标题不能为空',
      trigger: 'blur'
    }],
    content: [{
      required: true,
      message: '公告内容不能为空',
      trigger: 'blur'
    }]
  },
  getData,
  update: updateNotice,
  create: createNotice

})
</script>
<template>
  <div>
    <el-card shadow="never" class="border-0">
      <!-- 新增|刷新 -->
      <ListHeader @create="handleCreate" @refresh="getData" />

      <el-table :data="tableData" stripe style="width: 100%;" v-loading="loading">
        <el-table-column prop="title" label="公告标题" />
        <el-table-column prop="create_time" label="发布时间" width="380" />
        <el-table-column label="操作" width="180" align="center">
          <template #default="scope">
            <el-button type="primary" size="small" text @click="handleEdit(scope.row)">修改</el-button>
            <el-popconfirm title="是否要删除该公告？" confirmButtonText="确认" cancelButtonText="取消"
              @confirm="handleDelete(scope.row.id)">
              <template #reference>
                <el-button type="primary" size="small" text>删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <div class="flex items-center justify-center mt-5">
        <el-pagination background layout="prev,pager,next" :total="total" :current-page="currentPage" :page-size="limit"
          @current-change="getData" />
      </div>

      <FormDrawer ref="formDrawerRef" :title="drawerTitle" @submit="handleSubmit">
        <el-form ref="formRef" :model="form" :rules="rules" status-icon label-width="80px" :inline="false">
          <el-form-item label="公告标题" prop="title">
            <!-- 用了:rules="rules"验证规则，需要声明哪个字段 prop="title" -->
            <el-input v-model="form.title" placeholder="公告标题" />
          </el-form-item>
          <el-form-item label="公告内容" prop="content">
            <el-input v-model="form.content" placeholder="公告内容" type="textarea" :rows="5" />
            <!-- :rows="5" 显示5列 -->
          </el-form-item>
        </el-form>
      </FormDrawer>
    </el-card>

  </div>
</template>