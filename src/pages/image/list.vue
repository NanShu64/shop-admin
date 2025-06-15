<script setup>
import ImageMain from '@/components/ImageMain.vue'
import ImageAside from '@/components/ImageAside.vue'
import { ref } from 'vue'

const windowHeight = window.innerHeight || document.body.clientHeight
//拿到浏览器可视部分高度,或
const h = windowHeight - 150
//浏览器高度减去

const ImageAsideRef = ref(null)
const handleOpenCreate = () => ImageAsideRef.value.handleCreate()
// const uploadPictures = () =>


const ImageMainRef = ref(null)
const handleAsideChange = (image_class_id) => ImageMainRef.value.loadData(image_class_id)


const handleOpenUpload= () => ImageMainRef.value.openUploadFile()
</script>
<template>
  <div>
    <el-container class="bg-white rounded" :style="{height:(h+'px')}">
      <el-header class="image-header">
        <el-button type="primary" size="small" @click="handleOpenCreate">新增图片分类</el-button>
        <el-button type="warning" size="small" @click="handleOpenUpload">上传图片</el-button>
      </el-header>
      <el-container>
        <ImageAside ref="ImageAsideRef" @change="handleAsideChange" />
        <ImageMain ref="ImageMainRef" />
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