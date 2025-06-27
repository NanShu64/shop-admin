<script setup>
import { reactive, ref } from "vue"
import {
    getSkusList
} from "@/api/skus"
import {
    useInitTable
} from "@/composables/useCommon"

//初始值false
const dialogVisible = ref(false)
const activeId = ref(0)
const {
    loading,
    currentPage,
    limit,
    total,
    tableData,
    getData
} = useInitTable({
    // 获取列表方法
    getList: getSkusList,
    onGetListSuccess: (res) => {
        tableData.value = res.list
        total.value = res.totalCount

        // 如果列表有数据，拿到第0个id
        if (tableData.value.length > 0) {
            handleChangeActiveId(tableData.value[0].id)
        }
    }
})


const callbackFunction = ref(null)
// 
const open = (callback = null) => {
    // 每次触发open方法时把callback存到callbackFunction.value当中
    callbackFunction.value = callback
    // 拿第一页的数据
    getData(1)
    dialogVisible.value = true
}

const list = ref([])

const form = reactive({
    name: "",
    list: []
})

function handleChangeActiveId(id) {
    activeId.value = id
    // 清空list.value
    list.value = []
    // 赋值给item
    let item = tableData.value.find(o => o.id == id)
    // 判断item是否存在
    if (item) {
        // 按,分割数组
        list.value = item.default.split(",")
        // 当前对象的name值
        form.name = item.name
    }
}

const submit = () => {
    // 如果callbackFunction.value
    if (typeof callbackFunction.value === "function") {
        // 执行，传入form
        callbackFunction.value(form)
    }
    dialogVisible.value = false
}

// 导出
defineExpose({
    open
})
</script><template>
    <el-dialog title="规格选择" v-model="dialogVisible" width="80%" top="5vh">
        <el-container style="height:65vh;">
            <el-aside width="220px" class="image-aside">
                <!-- 侧边 -->
                <div class="top">
                    <div class="sku-list" :class="{ 'active':(activeId == item.id) }" v-for="(item,index) in tableData"
                        :key="index" @click="handleChangeActiveId(item.id)">
                        {{ item.name }}
                    </div>
                </div>
                <div class="bottom">
                    <el-pagination background layout="prev, next" :total="total" :current-page="currentPage"
                        :page-size="limit" @current-change="getData" />
                </div>
            </el-aside>
            <el-main>
                <!-- 内容 -->
                <el-checkbox-group v-model="form.list">
                    <el-checkbox v-for="item in list" :key="item" :label="item" border>
                        {{item}}
                    </el-checkbox>
                </el-checkbox-group>
            </el-main>
        </el-container>

        <template #footer>
            <span>
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="submit">确定</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<style>
.image-aside {
    border-right: 1px solid #eeeeee;
    position: relative;
}

.image-aside .top {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 50px;
    overflow-y: auto;
}

.image-aside .bottom {
    position: absolute;
    bottom: 0;
    height: 50px;
    left: 0;
    right: 0;
    @apply flex items-center justify-center;
}

.sku-list {
    /* 下边线 */
    border-bottom: 1px solid #f4f4f4;
    @apply p-3 text-sm text-gray-600 flex items-center cursor-pointer;
}

.sku-list:hover,
active {
    @apply bg-blue-50;
}
</style>