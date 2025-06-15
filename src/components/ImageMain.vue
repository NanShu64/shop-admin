<script setup>
import { getImageList } from "@/api/image.js"
import { ref } from 'vue';
// 分页部分
const currentPage = ref(1)
const total = ref(0)
// 每页显示的条数
const limit = ref(10)

//定义一个空数值,保存列表数据
const list = ref([])
//加载动画
const loading = ref(false)

const image_class_id = ref(0)
//获取数据
function getData(p) {
    if (typeof p == "number") {
        currentPage.value = p
    }
    //loading的状态设为true 
    loading.value = true
    //获取最新的数据
    getImageList(image_class_id.value, currentPage.value)
        .then(res => {
            //总数赋值给total
            total.value = res.totalCount
            list.value = res.list
        }).finally(() => {
            loading.value = false
        })
}

const loadData = (id) => {
    //页码为第一页
    currentPage.value = 1
    image_class_id.value = id
    getData()
}
// 暴露方法给ImageAside，根据分类id加载图片列表
defineExpose({
    loadData
})
</script>
<template>
    <el-main class="image-main" v-loading="loading">
        <div class="top p-3">

            <el-row :gutter="10">
                <el-col :span="6" v-for="(item,index) in list" :key="index">
                    <el-card shadow="hover" class="relative mb-3" :body-style="{'padding':0}">
                        <el-image :src="item.url" fit="cover" class="h-[150px]" style="width: 100%;"></el-image>
                        <!-- fit="cover" 图片覆盖-->
                        <div class="image-title">
                            {{item.name}}
                        </div>
                        <div class="flex items-center justify-center p-2">
                            <el-button type="primary" size="small" text @click="update">重命名</el-button>
                            <el-button type="primary" size="small" text @click="delete">删除</el-button>
                        </div>

                    </el-card>

                </el-col>
            </el-row>

        </div>
        <div class="bottom">
            <el-pagination background layout="prev,pager,next" :total="total" :current-page="currentPage"
                :page-size="limit" @current-change="getData" />
        </div>
    </el-main>
</template>


<style scoped>
.image-main {
    border-right: 1px solid #eeeeee;
    position: relative;
}

.image-main .top {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 50px;
    overflow-y: auto;
    /* 超出部分自动滚动  */
}

.image-main .bottom {
    @apply flex items-center justify-center;
    position: absolute;
    right: 0;
    left: 0;
    bottom: 0px;
    height: 50px;
}
.image-title{
    position: absolute;
    top: 120px;
    left: -1px;
    right: -1px;
    @apply bg-opacity-40 text-gray-50 text-sm truncate bg-gray-800 px-2 py-1;
}
</style>