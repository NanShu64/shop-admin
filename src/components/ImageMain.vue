<script setup>
import { deleteImage, getImageList, updateImage } from "@/api/image.js"
import { ref, computed } from 'vue';
import { showPrompt, toast } from '@/composables/util'
import UploadFile from '@/components/UploadFile.vue'
// 分页部分
const currentPage = ref(1)
const total = ref(0)
// 每页显示的条数
const limit = ref(10)

//定义一个空数值,保存列表数据
const list = ref([])
//加载动画
const loading = ref(false)

const image_class_id = ref(0)
//获取数据
function getData(p) {
    if (typeof p == "number") {
        currentPage.value = p
    }
    //loading的状态设为true 
    loading.value = true
    //获取最新的数据
    getImageList(image_class_id.value, currentPage.value)
        .then(res => {
            //总数赋值给total
            total.value = res.totalCount
            list.value = res.list.map(o => {
                //加个属性，默认false
                o.checked = false
                //最终修改完返回对象
                return o
            })
        }).finally(() => {
            loading.value = false
        })
}
// 删除方法
const handleDelete = (id) => {
    loading.value = true
    deleteImage([id])
        .then(res => {
            toast("通知", "删除成功", "success")
            //重新调用当页的数据
            getData()
        })
        .finally(() => {
            loading.value = false
        })
}
//重命名方法
const handleEdit = (item) => {
    showPrompt("重命名", item.name)
        .then(({ value }) => {
            //修改之后可以开启loading状态
            loading.value = true
            //传最新的 id，name
            updateImage(item.id, value).then(res => {
                toast("通知", "重命名成功", "success")
                //重新调用当页的数据
                getData()
            }).finally(() => {
                loading.value = false
            })
        })
}
const loadData = (id) => {
    //页码为第一页
    currentPage.value = 1
    image_class_id.value = id
    getData()
}

//上传图片
const drawer = ref(false)
const openUploadFile = () => drawer.value = true

//上传成功
const handlUploadSuccess = () => getData(1)

const props = defineProps({
    openChoose: {
        type: Boolean,
        default: false
    },
    limit: {
        type: Number,
        default: 1
    }
})
//选中的图片
const emit = defineEmits(["choose"])
const checkedImage = computed(() => list.value.filter(o => o.checked))
const handleChooseChange = (item) => {
    if (item.checked && checkedImage.value.length >props.limit) {
        item.checked = false
        return toast("通知", '最多只能选中${ props.limit }张', "error")
    }
    emit("choose", checkedImage.value)
}
// 暴露方法给ImageAside，根据分类id加载图片列表
defineExpose({
    loadData,
    openUploadFile
})
</script>
<template>
    <el-main class="image-main" v-loading="loading">
        <div class="top p-3">

            <el-row :gutter="10">
                <el-col :span="6" v-for="(item,index) in list" :key="index">
                    <el-card shadow="hover" class="relative mb-3" :body-style="{'padding':0}"
                        :class="{' border-green-500':item.checked }">
                        <el-image :src="item.url" fit="cover" class="h-[150px]" style="width: 100%; "
                            :preview-src-list="[item.url]" :initial-index="0"></el-image>
                        <!-- fit="cover" 图片覆盖-->
                        <div class="image-title">
                            {{item.name}}
                        </div>
                        <div class="flex items-center justify-center p-2">
                            <el-checkbox v-if="props.openChoose" v-model="item.checked" @change="handleChooseChange(item)" />

                            <el-button type="primary" size="small" text @click="handleEdit(item)">重命名</el-button>
                            <el-popconfirm title="是否要删除该图片？" confirmButtonText="确认" cancelButtonText="取消"
                                @confirm="handleDelete(item.id)">
                                <template #reference>
                                    <el-button class="!m-0" type="primary" size="small" text>删除</el-button>
                                </template>
                            </el-popconfirm>
                        </div>

                    </el-card>

                </el-col>
            </el-row>

        </div>
        <div class="bottom">
            <el-pagination background layout="prev,pager,next" :total="total" :current-page="currentPage"
                :page-size="limit" @current-change="getData" />
        </div>
    </el-main>
    <el-drawer v-model="drawer" title="上传图片">
        <UploadFile :data="{image_class_id}" @success="handlUploadSuccess" />
    </el-drawer>
</template>


<style scoped>
.image-main {
    border-right: 1px solid #eeeeee;
    position: relative;
}

.image-main .top {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 50px;
    overflow-y: auto;
    /* 超出部分自动滚动  */
}

.image-main .bottom {
    @apply flex items-center justify-center;
    position: absolute;
    right: 0;
    left: 0;
    bottom: 0px;
    height: 50px;
}

.image-title {
    position: absolute;
    top: 120px;
    left: -1px;
    right: -1px;
    @apply bg-opacity-40 text-gray-50 text-sm truncate bg-gray-800 px-2 py-1;
}
</style>