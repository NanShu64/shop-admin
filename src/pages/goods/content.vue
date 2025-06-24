<script setup>
import { ref, reactive } from 'vue';
import FormDrawer from '@/components/FormDrawer.vue';
import Editor from '@/components/Editor.vue';
import {
    readGoods,
    updateGoods
} from "@/api/goods"
import { toast } from "@/composables/util";

const formDrawerRef = ref(null)

const form = reactive({
    content: "",
})

//记录商品ID
const goodsId = ref(0)
const open = (row) => {
    // 将商品ID赋值给goodsId
    goodsId.value = row.id
    //按钮的loading状态
    row.contentLoading = true
    readGoods(goodsId.value).then(res => {
        // 赋值初始化的值
        form.content = res.content
        //打开抽屉
        formDrawerRef.value.open()
    }).finally(() => {
        row.contentLoading = false
    })
}
// 刷新方法
const emit = defineEmits(["reloadData"])
const submit = () => {
// 弹框节点显示
    formDrawerRef.value.showLoading()
    //id和对象
    updateGoods(goodsId.value, form)
        .then(res => {
            toast("通知", "设置商品详情成功", "success")
            // 关闭抽屉
            formDrawerRef.value.close()
            // 重新刷新列表页
            emit("reloadData")
        })
        .finally(() => {
            // 隐藏
            formDrawerRef.value.hideLoading()
        })
}
//导出方法
defineExpose({
    open
})
</script>
<template>
    <FormDrawer ref="formDrawerRef" title="设置商品详情" @submit="submit" destroy-on-close>
        <el-form :model="form">
            <el-form-item>
                <Editor v-model="form.content"/>
            </el-form-item>
        </el-form>
    </FormDrawer>

</template>


<style scoped></style>