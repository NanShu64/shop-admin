<script setup>
import { ref } from "vue"
import ImageAside from "@/components/ImageAside.vue"
import ImageMain from "@/components/ImageMain.vue"
import { toast } from "@/composables/util"

// 窗口默认关闭
const dialogVisible = ref(false)
//定义一个回调传值
const callbackFunction = ref(null)
//打开窗口
const open = (callback = null) => {
    callbackFunction.value = callback
    dialogVisible.value = true
}
//关闭窗口
const close = () => dialogVisible.value = false
const ImageAsideRef = ref(null)
const handleOpenCreate = () => ImageAsideRef.value.handleCreate()

const ImageMainRef = ref(null)
const handleAsideChange = (image_class_id) => ImageMainRef.value.loadData(image_class_id)

const handleOpenUpload = () => ImageMainRef.value.openUploadFile()
const props = defineProps({
    modelValue: [String, Array],
    limit: {
        type: Number,
        default: 1
    },
    preview: {
        // 预览
        type: Boolean,
        default: true
        // 默认显示+选择图片
    }
})
const emit = defineEmits(["update:modelValue"])
let urls = []
const handleChoose = (e) => {
    // 拿到选中照片的url 
    urls = e.map(o => o.url)
}
const submit = () => {
    let value = []
    if (props.limit == 1) {
        value = urls[0]
    } else {
        value = props.preview ? [...props.modelValue, ...urls] : [...urls]
        if (value.length > props.limit) {
            // 判断
            let limit = props.preview ? (props.limit - props.modelValue.length) : props.limit
            return toast("通知", "最多还能选择" + limit + "张")
        }
    }
    //首先判断长度
    if (value && props.preview) {
        emit("update:modelValue", value)
    } if (!props.preview && typeof callbackFunction.value === "function") {
        //如果是回调函数则执行,传入选中的值
        callbackFunction.value(value)
    }
    close()
}

const removeImage = (url) => {
    //调用过滤方法
    emit("update:modelValue", props.modelValue.filter(u => u != url))
}
// 暴露
defineExpose({
    open
})
</script>
<template>
    <div v-if="modelValue && preview ">
        <el-image v-if="typeof modelValue == 'string'" :src="modelValue" fit="cover"
            class="w-[100px] h-[100px] rounded border mr-2"></el-image>
        <div v-else class="flex flex-wrap">
            <div class="relative mx-1 mb-2 w-[100px] h-[100px]" v-for="(url,index) in modelValue" :key="index">
                <el-icon class="absolute right-[5px] top-[5px]  cursor-pointer bg-light-50 rounded" style="z-index:10;"
                    @click="removeImage(url)">
                    <CircleClose />
                </el-icon>
                <el-image :src="url" fit="cover" class="w-[100px] h-[100px] rounded border mr-2">
                </el-image>
            </div>
        </div>
    </div>
    <div v-if="preview" class="choose-image-btn" @click="open">
        <el-icon :size="25" class="text=gray-500">
            <Plus />
        </el-icon>
    </div>
    <el-dialog title="选择图片" v-model="dialogVisible" width="80%" top="5vh">
        <el-container class="bg-white rounded" style="height:70vh;">
            <el-header class="image-header">
                <el-button type="primary" size="small" @click="handleOpenCreate">新增图片分类</el-button>
                <el-button type="warning" size="small" @click="handleOpenUpload">上传图片</el-button>
            </el-header>
            <el-container>
                <ImageAside ref="ImageAsideRef" @change="handleAsideChange" />
                <ImageMain :limit="limit" openChoose ref="ImageMainRef" @choose="handleChoose" />
            </el-container>
        </el-container>

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