<script setup>
import { ref } from 'vue';
import AsideList from './AsideList.vue';
import { getImageClassList } from '@/api/image_class.js';


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
    right: 0;
    left: 0;
    bottom: 0px;
    height: 50px;
}
</style>