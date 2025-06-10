<script setup>
import { useRouter } from 'vue-router';
import { useStore } from "vuex"
import { computed } from 'vue';
const router = useRouter()
const store = useStore()
const asideMenus = [{
  "name": "后台面板",
  "icon": "help",
  "child": [{
    "name": "主控台",
    "icon": "home-filled",
    "frontpath": "/",
  }]
}
  , {
  "name": "商城管理",
  "icon": "shopping-bag",
  "child": [{
    "name": "商品管理",
    "icon": "shopping-cart-full",
    "frontpath": "/goods/list",
  }]
}
]

const handleSelect = (e) => {
  router.push(e)
}
//是否折叠
const isCollapse = computed(() => !(store.state.asideWidth == '250px'))


</script>
<template>
  <div class="f-menu" :style="{ width:$store.state.asideWidth }">
    <el-menu unique-opened :collapse="isCollapse" default-active="2" class="border-0" @select="handleSelect"
      :collapse-transition="false">
      <!-- unique-opened子菜单不会同时展开 -->
      <template v-for="(item,index) in asideMenus" :key="index">
        <el-sub-menu v-if="item.child && item.child.length>0" :index="item.name">
          <template #title>
            <el-icon>
              <component :is="item.icon"></component>
            </el-icon>
            <span>{{item.name}}</span>
          </template>
          <el-menu-item v-for="(item1,index1) in item.child" :key="index1" :index="item1.frontpath">
            <el-icon>
              <component :is="item1.icon"></component>
            </el-icon>
            <span>{{item1.name}}</span>
          </el-menu-item>
        </el-sub-menu>
        <el-menu-item v-else :index="item.frontpath">
          <el-icon>
            <component :is="item.icon"></component>
          </el-icon>
          <span>{{item.name}}</span>
        </el-menu-item>
      </template>
    </el-menu>
  </div>
</template>


<style scoped>
.f-menu {
  transition:all 0.2s ;
  /* 动画0.2秒 */
  width: 250px;
  top: 64px;
  bottom: 0;
  left: 0;
  overflow-y: auto;
  overflow-x:hidden;
  @apply shadow-md fixed bg-light-50;
}
</style>