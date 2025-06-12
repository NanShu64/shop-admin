<script setup>
import { getStatistics1, getStatistics2 } from '@/api/index.js';
import { ref } from 'vue';
import CountTo from '@/components/CountTo.vue';
import IndexNavs from '@/components/IndexNavs.vue';
import IndexChart from '@/components/IndexChart.vue';
import IndexCard from '@/components/IndexCard.vue';

//定义一个空数值
const panels = ref([])
getStatistics1()
    .then(res => {
        panels.value = res.panels

    })
const goods = ref([])
const order = ref([])
getStatistics2()
    .then(res => {
        goods.value = res.goods
        order.value = res.order
    })
</script>

<template>
    <div>
        <el-row :gutter="20" v-permission="['getStatistics1,GET']">
            <template v-if="panels.length==0">
                <el-col :span="6" v-for="i in 4" :key="i">
                    <el-skeleton style="width: 100%;" animated loading>
                        <template #template>
                            <el-card shadow="hover" class="border-0">
                                <template #header>
                                    <div class="flex justify-between">
                                        <el-skeleton-item variant="text" style="width: 50%" />
                                        <!--closable是否可关闭tag ,type对应tag颜色 -->
                                        <el-skeleton-item variant="text" style="width: 10%" />
                                    </div>
                                </template>
                                <el-skeleton-item variant="h3" style="width: 80%" />
                                <el-divider />
                                <div class="flex justify-between text-gray-500 text-sm">
                                    <el-skeleton-item variant="text" style="width: 50%" />
                                    <el-skeleton-item variant="text" style="width: 10%" />
                                </div>
                            </el-card>
                        </template>
                    </el-skeleton>
                </el-col>
            </template>
            <el-col :span="6" :offset="0" v-for="(item,index) in panels" :key="index">
                <el-card shadow="hover" class="border-0">
                    <template #header>
                        <div class="flex justify-between">
                            <span class="text-sm">{{item.title}}</span>
                            <!--closable是否可关闭tag ,type对应tag颜色 -->
                            <el-tag :type="item.unitColor" effect="plain">
                                {{ item.unit }}
                            </el-tag>
                        </div>
                    </template>
                    <!-- card body -->
                    <span class="text-3xl font-bold text-gray-500">
                        <CountTo :value="item.value" />
                    </span>
                    <el-divider />
                    <div class="flex justify-between text-gray-500 text-sm">
                        <span>
                            {{item.subTitle}}
                        </span>
                        <span>
                            {{ item.subValue }}
                        </span>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="6" :offset="0" v-for="(item,index) in panels">
            </el-col>
        </el-row>

        <IndexNavs />
        <el-row :gutter="20" class="mt-5">
            <el-col :span="12" :offset="0">
                <!--['getStatistics3,GET'] 数组里面输入别名  -->
                <IndexChart v-permission="['getStatistics3,GET']" />
            </el-col>

            <el-col :span="12" :offset="0" v-permission="['getStatistics2,GET']">
                <IndexCard title="店铺及商品提示" tip="店铺及商品提示" :btns="goods" class="mb-2.5" />
                <IndexCard title="交易提示" tip="需要立即处理的交易订单" :btns="order" />
            </el-col>
        </el-row>
    </div>
</template>
<style scoped></style>