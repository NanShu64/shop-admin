<script setup>
import { reactive, ref } from 'vue';
import AsideList from './AsideList.vue';
import { getImageClassList, CreatImageClass } from '@/api/image_class.js';
import FormDrawer from './FormDrawer.vue';
import { toast } from '@/composables/util';

//加载动画
const loading = ref(false)
//定义一个空数值,保存列表数据
const list = ref([])
const activeId = ref(0)
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
    getImageClassList(currentPage.value)
        .then(res => {
            total.value = res.totalCount
            list.value = res.list
            let item = list.value[0]
            if (item) {
                activeId.value = item.id
            }

        }).finally(() => {
            loading.value = false
        })
}

getData()
//初始化
const formDrawerRef = ref(null)
//打开表单抽屉
const handleCreate = () => formDrawerRef.value.open()

//
const form = reactive({
    name: "",
    order: 50
})
//验证规则
const rules = {
    name: [
        {
            required: true,
            message: '图库分类名称不能为空',
            trigger: 'blur'
        },
    ],
}
// 表单的ref默认为null
const formRef = ref(null)
//提交方法
const handleSubmit = () => {
    formRef.value.validate((valid) => {
        //form表单节点当中的valuedata的回调，用valid来接收
        if (!valid)
            //如果valid=false,就终止
            return
        //否则
        console.log("提交成功")
        //提交按钮处于loading状态
        formDrawerRef.value.showLoading()
        //传入name和order它们等于form
        CreatImageClass(form).then(res => {
            //提示提交成功
            toast("通知", "新增成功", "success")
            //重新加载数据
            getData(1)
            //关闭抽屉
            formDrawerRef.value.close()
        }).finally(() => {
            //请求结束隐藏loading状态
            formDrawerRef.value.hideLoading() 
        })
    })
}
// 暴露方法
defineExpose({
    handleCreate
})
</script>
<template>
    <el-aside width="220px" class="image-aside" v-loading="loading">
        <div class="top">
            <AsideList :active="activeId == item.id" v-for="(item,index) in list" :key="index">
                {{item.name}}
            </AsideList>
        </div>
        <div class=" bottom">
            <el-pagination background layout="prev,next" :total="total" current-page="currentPage" page-size="limit"
                @current-change="getData" />
        </div>
    </el-aside>

    <FormDrawer ref="formDrawerRef" title="新增" destroyOnClose @submit="handleSubmit">
        <div style="height: 1000px;">
            <el-form ref="formRef" :rules="rules" :model="form" status-icon label-width="80px" size="small">
                <el-form-item label="分类名称" prop="name">
                    <!-- 用了:rules="rules"验证规则，需要声明哪个字段 prop="name" -->
                    <el-input v-model="form.name" />
                </el-form-item>
                <el-form-item label="排序" prop="order">
                    <el-input-number v-model="form.order" :mmin="0" :max="1000" />
                </el-form-item>
            </el-form>
        </div>
    </FormDrawer>
</template>


<style scoped>
.image-aside {
    border-right: 1px solid #eeeeee;
    position: relative;
}

.image-aside .top {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 50px;
    overflow-y: auto;
    /* 超出部分自动滚动  */
}

.image-aside .bottom {
    @apply flex items-center justify-center;
    position: absolute;
    bottom: 0;
    height: 50px;
    left: 0;
    right: 0;
}
</style>