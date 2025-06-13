<script setup>



</script>
<template>
    <el-aside width="220px" class="image-aside">
        <div class="top">
            <div class="aside-list">
                <span>分类标题</span>
                <el-button text type="primary" size="small" @click="">
                    <el-icon :size="12">
                        <Edit />
                    </el-icon>
                </el-button>
                <el-button text type="primary" size="small" @click="">
                    <el-icon :size="12">
                        <Close />
                    </el-icon>
                </el-button>

            </div>
        </div>
        <div class="buttom">

        </div>
    </el-aside>
</template>


<style scoped>
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
    /* 超出部分自动滚动  */
}

.image-aside .bottom {
    @apply flex items-center justify-center;
    position: absolute;
    right: 0;
    left: 0;
    bottom: 0px;
    height: 50px;
}

.aside-list {
    border-bottom: 1px solid #f4f4f4;
    @apply flex items-center p-3 text-sm text-gray-600;
}
</style>