<script setup>
import { ref } from 'vue'
import { useInitTable, useInitForm } from '@/composables/useCommon.js'
import ListHeader from '@/components/ListHeader.vue'
import FormDrawer from '@/components/FormDrawer.vue'
import IconSelect from '@/components/IconSelect.vue'
import {
    getRuleList,
    createRule,
    deleteRule,
    updateRule,
    updateRuleStatus
} from "@/api/rule.js"

//定义一个空数值,保存角色列表数据
const options = ref([])
const defaultExpandedKeys = ref([])
const {
    loading,
    tableData,
    getData,
    handleDelete,
    handleStatusChange
} = useInitTable({
    getList: getRuleList,
    onGetListSuccess: (res) => {
        options.value = res.rules
        tableData.value = res.list
        //拿到列表数据拿到一级节点的id赋值给defaultExpandedKeys.value
        defaultExpandedKeys.value = res.list.map(o => o.id)
    },
    delete: deleteRule,
    updateStatus: updateRuleStatus
})
const {
    formDrawerRef,
    formRef,
    form,
    rules,
    drawerTitle,
    handleSubmit,
    handleCreate,
    handleEdit
} = useInitForm({
    form: {
        name: "",
        condition: "",
        role_id: 0,
        menu: 0,
        status: 1,
        method: "GET",
        order: 50,
        icon: "",
        frontpath: ""
    },
    rules: {},
    getData,
    update: updateRule,
    create: createRule,

})

//添加子分类
const addChild = (id) => {
    //打开弹框
    handleCreate()
    form.rule_id = id
    //状态设置为1
    form.status = 1
}
</script>
<template>
    <el-card shadow="never" class="border-0">
        <!-- 新增|刷新  -->
        <ListHeader @create="handleCreate" @refresh="getData" />
        <el-tree :data="tableData" :props="{ label:'name',children:'child' }" v-loading="loading" node-key="id"
            :default-expanded-keys="defaultExpandedKeys">
            <template #default="{ node, data }">
                <!-- :default-expanded-keys="defaultExpandedKeys" 默认展开的节点 -->
                <div class="custom-tree-node">
                    <el-tag size="small" :type="data.menu ? '' : 'info'">{{ data.menu ? "菜单" : "权限" }}</el-tag>
                    <el-icon v-if="data.icon" :size="16" class="ml-2">
                        <component :is="data.icon" />
                    </el-icon>
                    <span>{{ data.name }}</span>

                    <div class="ml-auto">
                        <el-switch :modelValue="data.status" :active-value="1" :inactive-value="0"
                            @change="handleStatusChange($event,data)" />
                        <!-- :loading="row.statusLoading"   -->
                        <el-button text type="primary" size="small" @click.stop="handleEdit(data)">修改</el-button>
                        <el-button text type="primary" size="small" @click.stop="addChild(data.id)">增加</el-button>
                        <el-popconfirm title="是否要删除该记录？" confirmButtonText="确认" cancelButtonText="取消"
                            @confirm="handleDelete(data.id)">

                            <template #reference>
                                <el-button text type="primary" size="small">删除</el-button>
                            </template>
                        </el-popconfirm>
                    </div>

                </div>
            </template>
        </el-tree>

        <FormDrawer ref="formDrawerRef" :title="drawerTitle" @submit="handleSubmit">
            <el-form ref="formRef" :model="form" :rules="rules" label-width="80px" :inline="false">
                <el-form-item label="上级菜单" prop="rule_id">
                    {{ form.rule_id }}
                    <el-cascader v-model="form.rule_id" :options="options"
                        :props="{value:'id', label:'name',children:'child',checkStrictly:true,emitPath:false }"
                        placeholder="请选择上级菜单" />
                </el-form-item>
                <el-form-item label=" 菜单/规则" prop="menu">
                    <el-radio-group v-model="form.menu">
                        <el-radio :label="1" border>菜单</el-radio>
                        <el-radio :label="0" border>规则</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="名称" prop="name">
                    <el-input v-model="form.name" placeholder="名称" style="width: 30%;" />
                </el-form-item>
                <el-form-item label="菜单图标" prop="icon" v-if=" form.menu == 1 ">
                    <IconSelect v-model="form.icon" />
                </el-form-item>
                <el-form-item label="前端路由" prop="frontpath" v-if="form.menu == 1 && form.rule_id>0">
                    <el-input v-model="form.frontpath" placeholder="前端路由" />
                </el-form-item>
                <el-form-item label="后端规则" prop="condition" v-if="form.menu == 0">
                    <el-input v-model="form.condition" placeholder="后端规则" />
                </el-form-item>
                <el-form-item label="请求方式" prop="method" v-if="form.menu==0">
                    <el-select v-model="form.method" placeholder="请选择请求方式">
                        <el-option v-for=" item in ['GET','POST','PUT','DELETE']" :key="item" :label="item"
                            :value="item">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="排序" prop="order">
                    <el-input-number v-model="form.order" :min="0" :max="1000" />
                </el-form-item>
            </el-form>
        </FormDrawer>
    </el-card>


</template>


<style scoped>
.custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    font-size: 14px;
    padding-right: 8px;
}

.el-tree-node__content {
    padding: 20px 0;
}
</style>