<script setup>

import ImageMain from '@/components/ImageMain.vue'
import ImageAside from '@/components/ImageAside.vue'


const windowHeight = window.innerHeight || document.body.clientHeight
//拿到浏览器可视部分高度,或
const h = windowHeight - 150
//浏览器高度减去
</script>
<template>
  <div>
    <el-container class="bg-white rounded" :style="{height:(h+'px')}">
      <div class="image-header">
        <!-- <el-check-tag>新增 </el-check-tag>
        <el-check-tag>新增 </el-check-tag> -->
      </div>
      <el-container>
        <ImageAside />
        <ImageMain />
      </el-container>
    </el-container>
  </div>
</template>
<style scoped>
.image-header {
  border-bottom: 1px solid #eeeeee;
  @apply flex items-center;
}
</style>