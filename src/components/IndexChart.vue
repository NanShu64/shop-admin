<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
//引入生命周期
import * as echarts from 'echarts'
import { getStatistics3 } from '@/api/index'
import { useResizeObserver } from '@vueuse/core'

const current = ref("week")
const options = [{
    text: " 近1个月",
    value: "month"
},
{
    text: " 近1周",
    value: "week"
},
{
    text: " 近24小时",
    value: "hour"
}]

const handleChoose = (type) => {
    current.value = type
    getData()
}

var myChart = null
//默认为null，在onMounted() 中赋值
onMounted(() => {
    var chartDom = document.getElementById('chart');
    if (chartDom) {
        myChart = echarts.init(chartDom);
        getData()
    }
})

//在页面销毁前释放,防白屏
onBeforeUnmount(() => {
    if (myChart) echarts.dispose(myChart)
})

function getData() {
    let option = {
        xAxis: {
            type: 'category',
            data: []
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                data: [],
                type: 'bar',
                showBackground: true,
                backgroundStyle: {
                    color: 'rgba(180, 180, 180, 0.2)'
                }
            }
        ]
    };

    myChart.showLoading()
    //当前选中的值传入
    getStatistics3(current.value).then(res => {
        option.xAxis.data = res.x
        option.series[0].data = res.y

        myChart.setOption(option);
    }).finally(() => {
        myChart.hideLoading()
    })

}
const el = ref(null)
useResizeObserver(el, (entries) => myChart.resize())
</script>
<template>
    <el-card shadow="never">
        <template #header>
            <div class=" flex justify-between">
                <span class=" text-sm">订单统计</span>
                <div>
                    <el-check-tag v-for="(item,index) in options" :key="index" :checked="current == item.value"
                        stype="margin-right: 8px" @click="handleChoose(item.value)">{{ item.text }}</el-check-tag>
                </div>
            </div>
        </template>
        <!-- card body -->
        <div ref="el" id="chart" style="width: 100%; height:300px;">

        </div>
    </el-card>
</template>


<style scoped></style>