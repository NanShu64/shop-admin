<script setup>

</script>
<template>
    <el-result icon="warning" 
    title="404 提示" 
    sub-title="页面飞走了~">
        <template #extra>
            <el-button type="primary"  @click="$router.push('/')">返回首页</el-button>
        </template>
    </el-result>
</template>


<style scoped></style>