<script setup>
import { ref, reactive } from 'vue';
import FormDrawer from '@/components/FormDrawer.vue';
import SkuCard from './components/SkuCard.vue';
import SkuTable from '@/pages/goods/components/SkuTable.vue';
import {
    readGoods,
    updateGoodsSkus
} from "@/api/goods"
import { toast } from "@/composables/util";
import { goodsId, initSkuCardList, sku_list } from '@/composables/useSku.js';


const formDrawerRef = ref(null)

const form = reactive({
    sku_type: 0,
    "sku_value": {
        "oprice": 0,
        "pprice": 0,
        "cprice": 0,
        "weight": 0,
        "volume": 0
    },
})

//记录商品ID
const open = (row) => {
    // 将当前商品ID赋值给goodsId
    goodsId.value = row.id
    //按钮的loading状态
    row.skusLoading = true
    readGoods(goodsId.value).then(res => {
        // 赋值初始化的值
        form.sku_type = res.sku_type
        //如果没有值就重新赋值
        form.sku_value = res.sku_value || {
            "oprice": 0,
            "pprice": 0,
            "cprice": 0,
            "weight": 0,
            "volume": 0
        }
        //调用，传当前整个对象
        initSkuCardList(res)
        //打开抽屉
        formDrawerRef.value.open()
    }).finally(() => {
        row.skusLoading = false
    })
}
// 刷新方法
const emit = defineEmits(["reloadData"])
const submit = () => {
    // 弹框节点显示
    formDrawerRef.value.showLoading()

    let data = {
        sku_type: form.sku_type,
        sku_value: form.sku_value
    }
    if (form.sku_type == 1) {
        data.goodsSkus = sku_list.value
    }
    //id和对象
    updateGoodsSkus(goodsId.value, data)
        .then(res => {
            toast("通知", "设置商品规格成功", "success")
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
    <FormDrawer ref="formDrawerRef" title="设置商品规格" size="70%" @submit="submit" destroy-on-close>
        <el-form :model="form">
            <el-form-item label="规格类型">
                <el-radio-group v-model="form.sku_type">
                    <el-radio :label="0">单规格</el-radio>
                    <el-radio :label="1">多规格</el-radio>
                </el-radio-group>
            </el-form-item>
            <template v-if="form.sku_type === 0">
                <el-form-item label="市场价格">
                    <el-input v-model="form.sku_value.oprice" style="width:35%;">
                        <template #append>元</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="销售价格">
                    <el-input v-model="form.sku_value.pprice" style="width:35%;">
                        <template #append>元</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="成本价格">
                    <el-input v-model="form.sku_value.cprice" style="width:35%;">
                        <template #append>元</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="商品重量">
                    <el-input v-model="form.sku_value.weight" style="width:35%;">
                        <template #append>公斤</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="商品体积">
                    <el-input v-model="form.sku_value.volume" style="width:35%;">
                        <template #append>立方米</template>
                    </el-input>
                </el-form-item>
            </template>
            <template v-else>
                <SkuCard />
                <SkuTable />
            </template>
        </el-form>
    </FormDrawer>
</template>


<style scoped></style>