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
                <router-view v-slot="{ Component }">
                    <transition name="fade">
                        <!-- keep-alive只允许缓存10个， 最久未访问的销毁 -->
                        <keep-alive :max="10">
                            <component :is="Component"></component>
                        </keep-alive>
                    </transition>


                </router-view>
            </el-main>
        </el-container>
    </el-container>
</template>


<style scoped>
.el-aside {
    transition: all 0.2s;
}

.fade-enter-from {
    opacity: 0;
    /* -webkit-transform: translate3d(0, -100%, 0);
    transform: translate3d(0, -100%, 0); */
}

.fade-enter-to {
    opacity: 1;
    /* -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0); */
}

.fade-leave-to {
    opacity: 1;
}

.fade-leave-from {
    opacity: 0;
    /* -webkit-transform: translate3d(0, 100%, 0);
    transform: translate3d(0, 100%, 0); */
}

.fade-enter-active,
.fade-leava-active {
    transition: all 0.3s;
}

.fade-enter-active {
    transition-delay: 0.3s;
}
</style>