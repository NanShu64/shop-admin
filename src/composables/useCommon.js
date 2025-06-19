import { ref, reactive, computed } from 'vue';
import { toast } from '@/composables/util';

//列表,分页和搜索功能，删除和修改状态功能,需要写一个回调，调用roles
export function useInitTable(opt = {}) {
    //动态传参搜索
    let searchForm = null
    let resetSearchForm = null
    if (opt.searchForm) {
        //searchForm变成响应式
        searchForm = reactive({ ...opt.searchForm })
        resetSearchForm = () => {
            for (const key in opt.searchForm) {
                //回调,先遍历原来的初始值，然后对应的每个键值重新赋值，从而起到重置的效果
                searchForm[key] = opt.searchForm[key]
            }
            //最后再调用getData方法
            getData()
        }
    }

    //定义一个空数值,保存列表数据
    const tableData = ref([])
    //加载动画
    const loading = ref(false)


    // 分页部分
    const currentPage = ref(1)
    const total = ref(0)
    // 每页显示的条数
    const limit = ref(10)

    //获取数据
    function getData(p = null) {
        if (typeof p == "number") {
            currentPage.value = p
        }
        //loading的状态设为true 
        loading.value = true
        //获取最新的数据
        opt.getList(currentPage.value, searchForm)
            .then(res => {
                if (opt.onGetListSuccess && typeof opt.onGetListSuccess == "function") {
                    opt.onGetListSuccess(res)
                } else {
                    //总数赋值给total
                    tableData.value = res.list
                    total.value = res.totalCount
                }
            }).finally(() => {
                loading.value = false
            })
    }
    getData()
    // 删除方法
    const handleDelete = (id) => {
        loading.value = true
        opt.delete(id)
            .then(res => {
                toast("通知", "删除成功", "success")
                //重新调用当页的数据
                getData()
            })
            .finally(() => {
                loading.value = false
            })
    }
    //修改状态
    const handleStatusChange = (status, row) => {
        row.statusloading = true
        // $event>status
        //拿到当前对象的id
        opt.updateStatus(row.id, status)
            .then(res => {
                toast("通知", "修改状态成功", "success")
                row.status = status
            })
            .finally(() => {
                row.statusloading = false
            })
    }
    //多选选中id
    const multiSelectionIds = ref([])
    const handleSelectionChange = (e) => {
        multiSelectionIds.value = e.map(o => o.id)
    }
    //批量删除
    //表格节点绑定
    const multipleTableRef = ref(null)
    const handleMultiDelete = () => {
        loading.value = true
        opt.delete(multiSelectionIds.value)
            .then(res => {
                toast("通知", "批量删除成功", "success")
                //清空选中,防止报错
                if (multipleTableRef) {
                    multipleTableRef.value.clearSelection()
                }
                getData()
            }).finally(() => {
                loading.value = false
            })

    }

    return {
        searchForm,
        loading,
        tableData,
        currentPage,
        resetSearchForm,
        total,
        limit,
        getData,
        handleDelete,
        handleStatusChange,
        handleSelectionChange,
        multipleTableRef,
        handleMultiDelete
    }
}

//新增和修改 ,需要传进getData
export function useInitForm(opt = {}) {
    //初始化
    const formDrawerRef = ref(null)
    // 表单的ref默认为null
    const formRef = ref(null)
    //表单初始值
    const defaultForm = opt.form
    const form = reactive({})
    //验证规则
    const rules = opt.rules || {}
    //标识区别新增和编辑（修改
    const editId = ref(0)
    const drawerTitle = computed(() => editId.value ? "修改" : "新增")

    //提交方法
    const handleSubmit = () => {
        formRef.value.validate((valid) => {
            //form表单节点当中的valuedata的回调，用valid来接收
            if (!valid) return
            //如果valid=false,就终止
            //提交按钮处于loading状态
            formDrawerRef.value.showLoading()
            //修改或新增
            const fun = editId.value ? opt.update(editId.value, form) : opt.create(form)
            //传入name和order它们等于form
            fun.then(res => {
                //提示提交成功
                toast("通知", drawerTitle.value + "成功", "success")
                //重新加载数据,如果是修改就传刷新当前页的，新增刷新第一页
                opt.getData(editId.value ? false : 1)
                //关闭抽屉
                formDrawerRef.value.close()
            }).finally(() => {
                //请求结束隐藏loading状态
                formDrawerRef.value.hideLoading()
            })
        })
    }
    //重置表单
    function resetForm(row = false) {
        if (formRef.value) formRef.value.clearValidate()
        for (const key in defaultForm) {
            form[key] = row[key]
        }
    }
    //新增方法
    const handleCreate = () => {
        editId.value = 0
        //定义初始值
        resetForm(defaultForm)
        formDrawerRef.value.open()
    }
    //修改(编辑方法
    const handleEdit = (row) => {
        // 等于当前对象id 
        editId.value = row.id
        resetForm(row)
        formDrawerRef.value.open()
    }
    return {
        formDrawerRef,
        formRef,
        form,
        rules,
        editId,
        drawerTitle,
        handleSubmit,
        resetForm,
        handleCreate,
        handleEdit
    }
}
