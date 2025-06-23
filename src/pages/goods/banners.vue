<script setup>
import { ref, reactive } from 'vue';
import ChooseImage from '@/components/ChooseImage.vue';
import {
    readGoods,
    setGoodsBanner
} from "@/api/goods"
import { toast } from "@/composables/util";

const dialogVisible = ref(false)

const form = reactive({
    banners: []
})

//记录商品ID
const goodsId = ref(0)
const open = (row) => {
    // 将商品ID赋值给goodsId
    goodsId.value = row.id
    //按钮的loading状态
    row.bannersLoading = true
    readGoods(goodsId.value).then(res => {
        // 赋值初始化的值，拿到url组成一个一维数组
        form.banners = res.goodsBanner.map(o => o.url)
        //打开抽屉
        dialogVisible.value = true
    }).finally(() => {
        row.bannersLoading = false
    })
}
// 刷新方法
const emit = defineEmits(["reloadData"])
const loading = ref(false)
const submit = () => {
    loading.value = true
    //id和对象
    setGoodsBanner(goodsId.value, form)
        .then(res => {
            toast("通知", "设置轮播图成功", "success")
            // 关闭抽屉
            dialogVisible.value = false
            // 重新刷新列表页
            emit("reloadData")
        })
        .finally(() => {
            loading.value = false
        })
}
//导出方法
defineExpose({
    open
})
</script>
<template>

    <el-drawer title="设置轮播图" v-model="dialogVisible" direction="rtl" size="50%" destroy-on-close>
        <el-form ref="formRef" :model="form" label-width="80px" >
            <el-form-item label="轮播图" prop="title">
                <ChooseImage :limit="9" v-model="form.banners"></ChooseImage>
            </el-form-item>
            <el-form-item label="封面" prop="cover">
                <el-button type="primary" @click="submit" :loading="loading">提交</el-button>
            </el-form-item>
        </el-form>
    </el-drawer>


</template>


<style scoped></style>