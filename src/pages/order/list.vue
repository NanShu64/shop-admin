<script setup>
import { ref } from "vue"
import ListHeader from "@/components/ListHeader.vue";
import FormDrawer from "@/components/FormDrawer.vue";
import ChooseImage from "@/components/ChooseImage.vue";
import Search from "@/components/Search.vue";
import SearchItem from "@/components/SearchItem.vue";
import {
    getOrderList,
    deleteOrder,
} from "@/api/order"

import { useInitTable } from '@/composables/useCommon.js'


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
                <!-- <template #show>
          <SearchItem label="商品分类">
            <el-select v-model="searchForm.category_id" placeholder="请选择商品分类" clearable>
              <el-option v-for="item in category_list" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </SearchItem>
        </template> -->
            </Search>

            <!-- 新增|刷新 -->
            <ListHeader layout="">
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
                <el-table-column label="实际付款" width="120" prop="total_count" align="center" />
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
                    <template #default="scope">
                        <el-button class="px-1" type="primary" size="small" text>订单详情</el-button>
                        <el-button v-if="searchForm.tab === 'noship'" class="px-1" type="primary" size="small"
                            text>订单发货</el-button>
                        <el-button v-if="searchForm.tab === 'refunding'" class="px-1" type="primary" size="small"
                            text>同意退款</el-button>
                        <el-button v-if="searchForm.tab === 'refunding'" class="px-1" type="primary" size="small"
                            text>拒绝退款</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <div class="flex items-center justify-center mt-5">
                <el-pagination background layout="prev, pager ,next" :total="total" :current-page="currentPage"
                    :page-size="limit" @current-change="getData" />
            </div>
        </el-card>

    </div>
</template>