<script setup>
import { ref } from 'vue'
import ImageMain from '@/components/ImageMain.vue'
import ImageAside from '@/components/ImageAside.vue'

// 窗口默认关闭
const dialogVisible = ref(false)
//打开窗口
const open = () => dialogVisible.value = true
//关闭窗口
const close = () => dialogVisible.value = false


const ImageAsideRef = ref(null)
const handleOpenCreate = () => ImageAsideRef.value.handleCreate()
// const uploadPictures = () =>


const ImageMainRef = ref(null)
const handleAsideChange = (image_class_id) => ImageMainRef.value.loadData(image_class_id)

const handleOpenUpload = () => ImageMainRef.value.openUploadFile()
const props = defineProps({
    modelValue: [String, Arrary]
})
const emit = defineEmits(["updata: modelValue"])
let urls = []
const handleChoose = (e) => {
    // 拿到选中照片的url 
    urls = e.map(o => o.url)
}
const submit = () => {
    //首先判断长度
    if (urls.length) {
        emit("updata: modelValue", urls[0])
    }
    close()
}
</script>
<template>
    <div v-if="modelValue">
        <el-image :src="modelValue" fit="cover" class="w-[100px] h-[100px] rounded border mr-2"></el-image>

    </div>
    <div class="choose-image-btn" @click="open">
        <el-icon :size="25" class="text=gray-500 avatar-uploader-icon">
            <Plus />
        </el-icon>
    </div>
    <el-dialog title="选择图片" v-model="dialogVisible" width="80%" top="5vh">
        <span><el-container class="bg-white rounded" style="height:70vh;">
                <el-header class="image-header">
                    <el-button type="primary" size="small" @click="handleOpenCreate">新增图片分类</el-button>
                    <el-button type="warning" size="small" @click="handleOpenUpload">上传图片</el-button>
                </el-header>
                <el-container>
                    <ImageAside ref="ImageAsideRef" @change="handleAsideChange" />
                    <ImageMain openChoose ref="ImageMainRef" @Choose="handleChoose" />
                </el-container>
            </el-container></span>
        <template #footer>
            <span>
                <el-button @click="close">取消</el-button>
                <el-button type="primary" @click="submit">确认</el-button>
            </span>
        </template>
    </el-dialog>

</template>


<style scoped>
.choose-image-btn {
    @apply w-[100px] h-[100px] rounded flex items-center justify-center cursor-pointer hover: (bg-gray-100);
}

.image-header {
    border-bottom: 1px solid #eeeeee;
    @apply flex items-center;
}
</style>