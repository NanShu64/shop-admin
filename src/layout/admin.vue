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
                <router-view v-slot="{Component}">
                    <keep-alive :max="10"> 
                        <!--  只允许缓存10个， 最久未访问的销毁-->
                        <component :is="Component"></component>
                    </keep-alive>
                    </router-view>
            </el-main>
        </el-container>
    </el-container>
</template>


<style scoped>
.el-aside{
    transition:all 0.2s ;
}
</style>