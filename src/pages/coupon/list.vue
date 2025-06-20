<script setup>
import {
  getCouponList,
  createCoupon,
  deleteCoupon,
  updateCoupon,
  updateCouponStatus
} from "@/api/coupon"
import FormDrawer from '@/components/FormDrawer.vue';
import ListHeader from '@/components/ListHeader.vue';
import { useInitTable, useInitForm } from '@/composables/useCommon.js'
import { computed } from "vue";

//格式化状态
function formatStatus(row) {
  let s = "领取中"
  //拿到开始时间,需要转成时间戳
  let start_time = (new Date(row.start_time)).getTime()
  //当前时间戳
  let now = (new Date()).getTime()
  //结束时间戳
  let end_time = (new Date(row.end_time)).getTime()

  //进行判断
  if (start_time > now) {
    s = "未开始"
  } else if (end_time < now) {
    s = "已结束"
  } else if (row.status == 0) {
    s = "已失效"
  }
  return s
}

const {
  tableData,
  loading,
  currentPage,
  total,
  limit,
  getData,
  handleDelete
} = useInitTable({
  getList: getCouponList,
  delete: deleteCoupon,
  onGetListSuccess: (res) => {
    tableData.value = res.list.map(o => {
      //转化优惠券状态
      o.statusText = formatStatus(o)
      return o
    })
    total.value = res.totalCount
  }
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
    type: 0,
    value: 0,
    total: 100,
    min_price: 0,
    start_time: null,
    end_time: null,
    order: 50,
    desc: ""
  },
  // rules: {
  //   title: [{
  //     required: true,
  //     message: '公告标题不能为空',
  //     trigger: 'blur'
  //   }],
  //   content: [{
  //     required: true,
  //     message: '公告内容不能为空',
  //     trigger: 'blur'
  //   }]
  // },
  getData,
  update: updateCoupon,
  create: createCoupon,

  beforeSubmit: (f) => {
    if (typeof f.start_time != "number") {
      // 转化类型,再转化为时间戳
      f.start_time = (new Date(f.start_time)).getTime()
    }
    if (typeof f.endtime != "number") {
      // 转化类型,再转化为时间戳
      f.end_time = (new Date(f.end_time)).getTime()
    }
    return f
  }
})

const timerange = computed({
  get() {
    return form.start_time && form.end_time ? [form.start_time, form.end_time] : []
  },
  set(val) {
    form.start_time = val[0]
    form.end_time = val[1]
  }
})

</script>
<template>
  <div>
    <el-card shadow="never" class="border-0">
      <!-- 新增|刷新 -->
      <ListHeader @create="handleCreate" @refresh="getData" />

      <el-table :data="tableData" stripe style="width: 100%;" v-loading="loading">
        <el-table-column prop="name" label="优惠券名称" width="350px">
          <template #default="{row}">
            <div class="border border-dashed py-2 px-4 rounded" :class="row.statusText=='领取中' ?'active' :'inactive'">
              <h5>{{ row.name }}</h5>
              <small>{{ row.start_time }} ~ {{row.end_time}}</small>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="statusText" label="状态" />
        <el-table-column label="优惠">
          <template #default="{row}">
            {{ row.type? "折扣":"满减" }} {{ row.type? (row.value+"折") :(row.value+"元")}}
          </template>
        </el-table-column>
        <el-table-column prop="total" label="发放数量" />
        <el-table-column prop="used" label="已使用" />
        <el-table-column label="操作" width="180" align="center">
          <template #default="scope">
            <el-button type="primary" size="small" text @click="handleEdit(scope.row)">修改</el-button>
            <el-popconfirm title="是否要删除该优惠券？" confirmButtonText="确认" cancelButtonText="取消"
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
          <el-form-item label="优惠券名称" prop="name">
            <el-input v-model="form.name" placeholder="优惠券名称" style="width: 50%;" />
          </el-form-item>
          <el-form-item label="类型" prop="type">
            <el-radio-group v-model="form.type">
              <el-radio :label="1" border-0>折扣</el-radio>
              <el-radio :label="0" border-0>满减</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="面值" prop="value" style="width:50%;">
            <el-input v-model="form.value" placeholder="面值" />
            <template #append>
              {{ form.type ? "折":"元" }}
            </template>
          </el-form-item>
          <el-form-item label="发行量" prop="total">
            <el-input-number v-model="form.total" :min="0" :max="10000" />
          </el-form-item>
          <el-form-item label="最低使用价格" prop="min_price">
            <el-input v-model="form.min_price" placeholder="最低使用价格" type="number" />
          </el-form-item>
          <el-form-item label="排序" prop="order">
            <el-input-number v-model="form.order" :min="0" :max="1000" />
          </el-form-item>
          <el-form-item label="活动时间">
            <el-date-picker v-model="timerange" type="datetimerange" start-placeholder="开始时间" end-placeholder="结束时间"
              value-format="YYYY-MM-DD HH:mm:ss" :editable=false />
          </el-form-item>
          <el-form-item label="描述" prop="desc">
            <el-input v-model="form.desc" placeholder="描述" type="textarea" :rows="5" />
          </el-form-item></el-form>
      </FormDrawer>
    </el-card>

  </div>
</template>

<style scoped>
.active {
  @apply border-green-200 bg-green-50 text-green-500;
}

.inactive {
  @apply border-gray-200 bg-gray-50 text-gray-400;
}
</style>