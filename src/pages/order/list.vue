<script setup>
import { ref } from "vue"
import ListHeader from "@/components/ListHeader.vue";
import Search from "@/components/Search.vue";
import SearchItem from "@/components/SearchItem.vue";
import { useInitTable } from '@/composables/useCommon.js'
import ExportExcel from "./ExportExcel.vue"
import InfoModal from "./InfoModal.vue"


import {
    getOrderList,
    deleteOrder,
    refundOrder
} from "@/api/order"


import {
    showModal,
    showPrompt,
    toast
} from "@/composables/util"


const {
    handleSelectionChange,
    multipleTableRef,
    handleMultiDelete,

    searchForm,
    resetSearchForm,
    tableData,
    loading,
    currentPage,
    total,
    limit,
    getData,
    handleDelete,

    multiSelectionIds
} = useInitTable({
    searchForm: {
        no: "",
        tab: "all",
        starttime: "",
        endtime: "",
        name: "",
        phone: ""
    },
    getList: getOrderList,
    onGetListSuccess: (res) => {
        tableData.value = res.list.map(o => {
            o.bannersLoading = false
            o.contentLoading = false
            o.skusLoading = false
            return o
        })
        total.value = res.totalCount
    },
    delete: deleteOrder
})


const tabbars = [{
    key: "all",
    name: "全部"
}, {
    key: "nopay",
    name: "待支付"
}, {
    key: "noship",
    name: "待发货"
}, {
    key: "shiped",
    name: "待收货"
}, {
    key: "received",
    name: "已收货"
}, {
    key: "finish",
    name: "已完成"
}, {
    key: "closed",
    name: "已关闭"
}, {
    key: "refunding",
    name: "退款中"
}]

const ExportExcelRef = ref(null)
const handleExportExcel = () => ExportExcelRef.value.open()


const InfoModalRef = ref(null)
const info = ref(null)
const openInfoModal = (row) => {
    row.order_items = row.order_items.map(o => {
        if (o.skus_type == 1 && o.goods_skus) {
            let s = []
            // 遍历对象
            for (const k in o.goods_skus.skus) {
                // 每个对象的value值，push到一个数组中
                s.push(o.goods_skus.skus[k].value)
            }
            o.sku = s.join(",")
        }
        return o
    })
    // info赋值当前对象
    info.value = row
    // 调用open方法
    InfoModalRef.value.open()
}

// 退款处理
const handleRefund = (id, agree) => {
    (agree ? showModal("是否要同意该订单退款?") : showPrompt("请输入拒绝的理由"))
        .then(({ value }) => {
            let data = { agree }
            if (!agree) {
                data.disagree_reason = value
            }
            refundOrder(id, data)
                .then(res => {
                    getData()
                    toast("通知", "操作成功", "success")
                })
        })
}
</script>
<template>
    <div>
        <el-tabs v-model="searchForm.tab" @tab-change="getData">
            <el-tab-pane :label="item.name" :name="item.key" v-for="(item, index) in tabbars"
                :key="index"></el-tab-pane>
        </el-tabs>

        <el-card shadow="never" class="border-0">
            <!-- 搜索 -->
            <Search :model="searchForm" @search="getData" @reset="resetSearchForm">
                <SearchItem label="订单编号">
                    <el-input v-model="searchForm.no" placeholder="订单编号" clearable></el-input>
                </SearchItem>
                <template #show>
                    <SearchItem label="收货人">
                        <el-input v-model="searchForm.name" placeholder="收货人" clearable></el-input>
                    </SearchItem>
                    <SearchItem label="手机号">
                        <el-input v-model="searchForm.phone" placeholder="手机号" clearable></el-input>
                    </SearchItem>
                    <SearchItem label="开始时间">
                        <el-date-picker v-model="searchForm.starttime" type="date" placeholder="开始日期"
                            style="width: 90%;" value-format="YYYY-MM-DD" />
                    </SearchItem>
                    <SearchItem label="结束时间">
                        <el-date-picker v-model="searchForm.endtime" type="date" placeholder="结束日期" style="width: 90%;"
                            value-format="YYYY-MM-DD" />
                    </SearchItem>
                </template>
            </Search>

            <!-- 新增|刷新 -->
            <ListHeader layout="refresh,download" @refresh="getData" @download="handleExportExcel">
                <el-button type="danger" size="small" @click="handleMultiDelete">批量删除</el-button>
            </ListHeader>

            <el-table ref="multipleTableRef" @selection-change="handleSelectionChange" :data="tableData" stripe
                style="width: 100%" v-loading="loading">
                <el-table-column type="selection" width="55" />
                <el-table-column label="商品" width="300">
                    <template #default="{ row }">
                        <div>

                            <div class="flex text-sm">
                                <div class="flex-1">
                                    <p>订单号：</p>
                                    <small>{{ row.no }}</small>
                                </div>
                                <div>
                                    <p>下单时间：</p>
                                    <small>{{ row.create_time }}</small>
                                </div>
                            </div>

                            <div class="flex py-2" v-for="(item,index) in row.order_items" :key="index">
                                <el-image :src="item.goods_item ? item.goods_item.cover : ''" fit="cover" :lazy="true"
                                    style="width: 30px;height: 30px;"></el-image>
                                <p class="text-blue-500 ml-2">
                                    {{ item.goods_item ? item.goods_item.title : '商品已被删除' }}
                                </p>
                            </div>

                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="实际付款" width="120" prop="total_price" align="center" />
                <el-table-column align="center" label="买家" width="120">
                    <template #default="{ row }">
                        <!-- 用户名称 -->
                        <p>{{ row.user.nickname || row.user.username }}</p>
                        <small>(用户ID：{{ row.user.id }})</small>
                    </template>
                </el-table-column>
                <el-table-column label="交易状态" width="170" align="center">
                    <template #default="{ row }">

                        <div>
                            付款状态：
                            <el-tag v-if="row.payment_method == 'wechat'" type="success" size="small">微信支付</el-tag>
                            <el-tag v-else-if="row.payment_method == 'alipay'" size="small">支付宝支付</el-tag>
                            <el-tag v-else type="info" size="small">未支付</el-tag>
                        </div>

                        <div>
                            发货状态：
                            <el-tag :type="row.ship_data ? 'success' : 'info'" size="small">{{ row.ship_data ? '已发货' :
                                '未发货' }}</el-tag>
                        </div>

                        <div>
                            收货状态：
                            <el-tag :type="row.ship_status == 'received' ? 'success' : 'info'" size="small">{{
                                row.ship_status == 'received' ? '已收货' : '未收货' }}</el-tag>
                        </div>

                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                    <template #default="{ row }">
                        <el-button class="px-1" type="primary" size="small" text
                            @click="openInfoModal(row)">订单详情</el-button>
                        <el-button v-if="searchForm.tab === 'noship'" class="px-1" type="primary" size="small"
                            text>订单发货</el-button>
                        <el-button v-if="searchForm.tab === 'refunding'" class="px-1" type="primary" size="small" text
                            @click="handleRefund(row.id,1)">同意退款</el-button>
                        <el-button v-if="searchForm.tab === 'refunding'" class="px-1" type="primary" size="small" text
                            @click="handleRefund(row.id,0)">拒绝退款</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <div class="flex items-center justify-center mt-5">
                <el-pagination background layout="prev, pager ,next" :total="total" :current-page="currentPage"
                    :page-size="limit" @current-change="getData" />
            </div>
        </el-card>
        <ExportExcel :tabs="tabbars" ref="ExportExcelRef" />

        <InfoModal ref="InfoModalRef" :info="info" />
    </div>
</template>