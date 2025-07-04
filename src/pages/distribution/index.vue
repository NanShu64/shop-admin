<script setup>
import panel from "./panel.vue"
import dataDrawer from "./dataDrawer.vue"
import { ref } from "vue"
import Search from "@/components/Search.vue";
import SearchItem from "@/components/SearchItem.vue";

import {
    getAgentList
} from "@/api/distribution"

import { useInitTable } from '@/composables/useCommon.js'

const {
    searchForm,
    resetSearchForm,
    tableData,
    loading,
    currentPage,
    total,
    limit,
    getData,
} = useInitTable({
    searchForm: {
        keyword: "",
        type: "all",
        starttime: null,
        endtime: null
    },
    getList: getAgentList,
    onGetListSuccess: (res) => {
        tableData.value = res.list
        total.value = res.totalCount
    },
})

const dataDrawerRef = ref(null)
const orderDataDrawerRef = ref(null)
// 打开抽屉
const openDataDrawer = (id, type) => {
    (type == "user" ? dataDrawerRef : orderDataDrawerRef).value.open(id)
}
</script>
<template>
    <div>
        <panel />

        <el-card shadow="never" class="border-0">
            <!-- 搜索 -->
            <Search :model="searchForm" @search="getData" @reset="resetSearchForm">
                <SearchItem label="时间选择"> 
                    <el-radio-group v-model="searchForm.type">
                        <el-radio-button label="all">全部</el-radio-button>
                        <el-radio-button label="today">今天</el-radio-button>
                        <el-radio-button label="yesterday">昨天</el-radio-button>
                        <el-radio-button label="last7days">最近7天</el-radio-button>
                    </el-radio-group>
                </SearchItem>
                <template #show>
                    <SearchItem label="开始时间">
                        <el-date-picker v-model="searchForm.starttime" type="date" placeholder="开始日期"
                            style="width: 90%;" value-format="YYYY-MM-DD" />
                    </SearchItem>
                    <SearchItem label="结束时间">
                        <el-date-picker v-model="searchForm.endtime" type="date" placeholder="结束日期" style="width: 90%;"
                            value-format="YYYY-MM-DD" />
                    </SearchItem>
                    <SearchItem label="关键词">
                        <el-input v-model="searchForm.keyword" placeholder="关键词" clearable></el-input>
                    </SearchItem>
                </template>
            </Search>

            <el-table :data="tableData" stripe style="width: 100%" v-loading="loading">
                <el-table-column label="ID" prop="id" align="center" />
                <el-table-column label="头像" width="65">
                    <template #default="{ row }">
                        <el-avatar :size="40" :src="row.avatar">
                            <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png" />
                        </el-avatar>
                    </template>
                </el-table-column>

                <el-table-column label="用户信息" width="200">
                    <template #default="{ row }">
                        <div class="text-xs">
                            <p>用户：{{ row.username }}</p>
                            <p>昵称：{{ row.nickname }}</p>
                            <p>姓名：{{ row.user_info.name }}</p>
                            <p>电话：{{ row.phone }}</p>
                        </div>
                    </template>
                </el-table-column>

                <el-table-column label="推广用户数量" prop="share_num" align="center" />
                <el-table-column label="订单数量" prop="share_order_num" align="center" />
                <el-table-column label="订单金额" prop="order_price" align="center" />
                <el-table-column label="账户佣金" prop="commission" align="center" />
                <el-table-column label="已提现金额" prop="cash_out_price" align="center" />
                <el-table-column label="提现次数" prop="cash_out_time" align="center" />
                <el-table-column label="未提现金额" prop="no_cash_out_price" align="center" />

                <el-table-column fixed="right" label="操作" width="180" align="center">
                    <template #default="{ row }">
                        <el-button type="primary" size="small" text
                            @click="openDataDrawer(row.id,'user')">推广人</el-button>
                        <el-button type="primary" size="small" text
                            @click="openDataDrawer(row.id,'order')">推广订单</el-button>
                    </template>
                </el-table-column>

            </el-table>

            <div class="flex items-center justify-center mt-5">
                <el-pagination background layout="prev, pager ,next" :total="total" :current-page="currentPage"
                    :page-size="limit" @current-change="getData" />
            </div>
        </el-card>

        <dataDrawer ref="dataDrawerRef" />
        <dataDrawer ref="orderDataDrawerRef" type="order" />
    </div>
</template>
