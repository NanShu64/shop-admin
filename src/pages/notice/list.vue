<script setup>
import { ref } from 'vue';
import {
  getNoticeList,
  updateNotice,
  deleteNotice,
  updateNoticeAction
} from "@/api/image_class.js"
//刷新
const handleRefresh = () => location.reload()
const tableData = ref([])

//加载动画
const loading = ref(false)
//定义一个空数值,保存列表数据
const list = ref([])

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
  getNoticeList(currentPage.value)
    .then(res => {
      //总数赋值给total
      tableData.value = res.totalCount
      total.value = res.totalCount
      let item = list.value[0]
      if (item) {
        handleChangeActionID(item.id)
      }

    }).finally(() => {
      loading.value = false
    })
}

function getData() {
  tableData.value = [{
    "id": id,
    "title": title,
    "content": content,
    "order": 0,
    "create_time": create_time,
    "update_time": update_time
  }]
}
getData()
//提交方法
const handleSubmit = () => {
  formRef.value.validate((valid) => {
    //form表单节点当中的valuedata的回调，用valid来接收
    if (!valid)
      //如果valid=false,就终止
      return
    //提交按钮处于loading状态
    formDrawerRef.value.showLoading()
    //修改或新增
    const fun = editId.value ? updateImageClass(editId.value, form) : createImageClass(form)
    //传入name和order它们等于form
    fun.then(res => {
      //提示提交成功
      toast("通知", drawerTitle.value + "成功", "success")
      //重新加载数据,如果是修改就传当前页的，否则回到第一页
      getData(editId.value ? currentPage.value : 1)
      //关闭抽屉
      formDrawerRef.value.close()
    }).finally(() => {
      //请求结束隐藏loading状态
      formDrawerRef.value.hideLoading()
    })
  })
}
//新增方法
const handleCreate = () => {
  editId.value = 0
  //初始化,清空一下
  form.name = ""
  form.order = 50
  formDrawerRef.value.open()
}
// 暴露方法
defineExpose({
  handleCreate
})
// 删除方法
const handleDelete = (id) => {
  loading.value = true
  deleteImage([id])
    .then(res => {
      toast("通知", "删除成功", "success")
      //重新调用当页的数据
      getData()
    })
    .finally(() => {
      loading.value = false
    })
}
//修改方法
const handleEdit = (item) => {
  showPrompt("重命名", item.name)
    .then(({ value }) => {
      //修改之后可以开启loading状态
      loading.value = true
      //传最新的 id，name
      updateImage(item.id, value).then(res => {
        toast("通知", "修改成功", "success")
        //重新调用当页的数据
        getData()
      }).finally(() => {
        loading.value = false
      })
    })
}
</script>
<template>
  <div>
    <el-card shadow="never" class="border-0">
      <!-- 新增|刷新 -->
      <div class="flex items-center justify-between mb-4">
        <el-button type="primary" size="small" @click="handleCreate">新增</el-button>
        <el-button text>
          <el-tooltip class="box-item" effect="dark" content="刷新" placement="bottom-top">
            <el-icon class="icon-btn" @click="getData">
              <Refresh />
            </el-icon>
          </el-tooltip>
        </el-button>
      </div>
      <el-table :data="tableData" stripe style="width: 100%;" v-loading="loading">
        <el-table-column prop="title" label="公告标题" />
        <el-table-column prop="create_time" label="发布时间" width="300" />
        <el-table-column label="操作" width="180" align="content">
          <template #default="scope">
            <el-button type="primary" size="small" text @click="handleEdit(item)">修改</el-button>
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

      <!-- card body -->
    </el-card>

  </div>
</template>