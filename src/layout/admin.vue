<script setup>
import FHeader from '@/layout/components/FHeader.vue'
import FMenu from '@/layout/components/FMenu.vue'
import FTagList from '@/layout/components/FTagList.vue'
</script>
<template>
    <el-container>
        <el-header>
            <f-header />
        </el-header>
        <el-container>
            <el-aside :width="$store.state.asideWidth">
                <f-menu />
            </el-aside>
            <el-main>
                <f-tag-list />
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>


<style scoped>
.el-aside{
    transition:all 0.2s ;
}
</style>