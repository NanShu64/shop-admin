import { ref, nextTick, computed } from 'vue';
import {
    createGoodsSkusCard,
    updateGoodsSkusCard,
    deleteGoodsSkusCard,
    sortGoodsSkusCard,
    createGoodsSkusCardValue,
    updateGoodsSkusCardValue,
    deleteGoodsSkusCardValue,
    chooseAndSetGoodsSkusCard
} from "@/api/goods.js"
import {
    useArrayMoveUp,
    useArrayMoveDown,
    cartesianProductOf
} from '@/composables/util';
// 当前商品ID,默认为0
export const goodsId = ref(0)
// 规格选项列表
export const sku_card_list = ref([])

export const sku_list = ref([])


// 初始化规格选项列表
export function initSkuCardList(d) {
    //通过item拿到每个对象
    sku_card_list.value = d.goodsSkusCard.map(item => {
        item.text = item.name
        // 每个对象添加一个Loading，防止重复提交
        item.loading = false
        item.goodsSkusCardValue.map(v => {
            // 默认“属性值”
            v.text = v.value || "属性值"
            return v
        })
        return item
    })
    // 赋值
    sku_list.value = d.goodsSkus
    console.log(sku_list.value);
}
// 添加规格选项
export const btnLoading = ref(false)
export function addSkuCardEvent() {
    btnLoading.value = true
    createGoodsSkusCard({
        goods_id: goodsId.value,//商品id
        name: "规格选项",//规格名称
        order: 50,//排序
        type: 0//规格类型
    }).then(res => {
        //
        sku_card_list.value.push({
            ...res,
            text: res.name,
            loading: false,
            //默认空数组
            goodsSkusCardValue: []
        })
    })
        .finally(() => {
            btnLoading.value = false
        })
}
// 修改规格选项
export function handleUpdate(item) {
    item.loading = true
    updateGoodsSkusCard(item.id, {
        "goods_id": item.goods_id,//商品id
        "name": item.text,//规格名称
        "order": item.order,//排序
        "type": 0//规格类型
    })
        .then(res => {
            item.name = item.text
        })
        .catch(err => {
            item.text = item.name
        })
        .finally(() => {
            item.loading = false
        })
}
// 删除规格选项
export function handleDelete(item) {
    item.loading = true
    deleteGoodsSkusCard(item.id)
        .then(res => {
            // 查每个对象的ID
            const i = sku_card_list.value.findIndex(o => o.id == item.id)
            if (i != -1) {
                sku_card_list.value.splice(i, 1)
            }
            getTableData()
        })
}
// 排序规格选项
export const bodyLoading = ref(false)
export function sortCard(action, index) {
    //用一个变量来接收，转字符串再转回来
    let oList = JSON.parse(JSON.stringify(sku_card_list.value))
    // 用func来接收并判断
    let func = action == "up" ? useArrayMoveUp : useArrayMoveDown
    func(oList, index)
    // o接收对象，i接收
    let sortData = oList.map((o, i) => {
        return {
            id: o.id,
            order: i + 1
        }
    })
    bodyLoading.value = true
    sortGoodsSkusCard({
        sortdata: sortData
    })
        .then(res => {
            func(sku_card_list.value, index)
            getTableData()
        })
        .finally(() => {
            bodyLoading.value = false
        })
}
// 选择设置规格
export function handleChooseSetGoodsSkusCard(id, data) {
    // 拿到sku_card_list.value调用find方法，拿到每个对象
    let item = sku_card_list.value.find(o => o.id == id)
    item.loading = true
    chooseAndSetGoodsSkusCard(id, data)
        .then(res => {
            console.log(res);
            // 修改name值
            item.name = item.text = res.goods_skus_card.name
            item.goodsSkusCardValue = res.goods_skus_card_value.map(o => {
                o.text = o.value || "属性值"
                return o
            })
            getTableData()
        })
        .finally(() => {
            item.loading = false
        })
}
// 初始化规格的值
export function initSkusCardItem(id) {
    // 查询o的id是否一致
    const item = sku_card_list.value.find(o => o.id == id)

    const loading = ref(false)
    const inputValue = ref('')
    // 是否显示input输入框
    const inputVisible = ref(false)
    const InputRef = ref()
    // 删除
    const handleClose = (tag) => {
        loading.value = true
        deleteGoodsSkusCardValue(tag.id)
            .then(res => {
                //拿到数组查索引，拿到每个对象id和当前对象的id做对比
                let i = item.goodsSkusCardValue.findIndex(o => o.id === tag.id)
                //判断索引是否存在
                if (i != -1) {
                    item.goodsSkusCardValue.splice(i, 1)
                }
                getTableData()
            })
            .finally(() => {
                loading.value = false
            })
    }
    // 显示input输入框
    const showInput = () => {
        inputVisible.value = true
        nextTick(() => {
            InputRef.value.input.focus()
        })
    }
    // 提交方法 
    const handleInputConfirm = () => {
        if (!inputValue.value) {
            // 隐藏抽屉
            inputVisible.value = false
            return
        }
        loading.value = true
        //请求方法
        createGoodsSkusCardValue({
            goods_skus_card_id: id,
            // 当前规格选项的名称
            name: item.name,
            // 排序
            order: 50,
            // 规格选项名称
            value: inputValue.value
        }).then(res => {
            item.goodsSkusCardValue.push({
                ...res,
                text: res.value
            })
            getTableData()
        })
            .finally(() => {
                //隐藏抽屉并且清空输入框
                inputVisible.value = false
                inputValue.value = ''
                loading.value = false
            })

    }
    //修改
    const handleChange = (value, tag) => {
        loading.value = true
        updateGoodsSkusCardValue(tag.id, {
            "goods_skus_card_id": id,
            "name": item.name,
            "order": tag.order,
            "value": value
        })
            .then(res => {
                tag.value = value
                getTableData()
            })
            .catch(err => {
                tag.text = tag.value
            })
            .finally(() => {
                loading.value = false
            })
    }

    // 对象的形式返回
    return {
        item,
        inputValue,
        inputVisible,
        InputRef,
        handleClose,
        showInput,
        handleInputConfirm,
        loading,
        handleChange,
    }
}

// 初始化表格，主要处理表头相关数据
export function initSkuTable() {
    // 拿到数组过滤，保证有值
    const skuLabels = computed(() => sku_card_list.value.filter(v => v.goodsSkusCardValue.length > 0))

    // 获取表头
    const tableThs = computed(() => {
        let length = skuLabels.value.length
        // 数组里面是每一个对象
        return [{
            name: "商品规格",
            colspan: length,
            width: "",
            rowspan: length > 0 ? 1 : 2
        }, {
            name: "销售价",
            width: "100",
            rowspan: 2
        }, {
            name: "市场价",
            width: "100",
            rowspan: 2
        }, {
            name: "成本价",
            width: "100",
            rowspan: 2
        }, {
            name: "库存",
            width: "100",
            rowspan: 2
        }, {
            name: "体积",
            width: "100",
            rowspan: 2
        }, {
            name: "重量",
            width: "100",
            rowspan: 2
        }, {
            name: "编码",
            width: "100",
            rowspan: 2
        }]
    })

    return {
        skuLabels,
        tableThs,
        sku_list
    }
}

// 获取规格表格数据
function getTableData() {
    setTimeout(() => {
        // 如果没有规格选项，就返回空数组
        if (sku_card_list.value.length === 0) return []

        let list = []
        sku_card_list.value.forEach(o => {
            if (o.goodsSkusCardValue && o.goodsSkusCardValue.length > 0) {
                // 判断存在且长度>0
                list.push(o.goodsSkusCardValue)
            }
        })

        if (list.length == 0) {
            return []
        }
        // 调用cartesianProductOf方法排列组合
        let arr = cartesianProductOf(...list)

        // 获取之前的规格列表，将规格ID排序之后转化成字符串
        let beforeSkuList = JSON.parse(JSON.stringify(sku_list.value)).map(o => {
            // 判断数组
            if (!Array.isArray(o.skus)) {
                // 拿到对象的key值调用map方法再把对象里面指定的key值返回回去
                o.skus = Object.keys(o.skus).map(k => o.skus[k])
            }
            // 排序拼接
            o.skusId = o.skus.sort((a, b) => a.id - b.id).map(s => s.id).join(",")
            return o
        })
        // 整体赋值
        sku_list.value = []
        sku_list.value = arr.map(skus => {
            // 排序拼接比对 新老skus ——(skus), beforeSkuList ，转字符串，
            let o = getBeforeSkuItem(JSON.parse(JSON.stringify(skus)), beforeSkuList)
            return {
                code: o?.code || "",
                cprice: o?.cprice || "0.00",
                goods_id: goodsId.value,
                image: o?.image || "",
                oprice: o?.oprice || "0.00",
                pprice: o?.pprice || "0.00",
                skus,
                stock: o?.stock || 0,
                volume: o?.volume || 0,
                weight: o?.weight || 0,
            }
        })
    }, 200)
}
// 比对
function getBeforeSkuItem(skus, beforeSkuList) {
    let skusId = skus.sort((a, b) => a.id - b.id).map(s => s.id).join(",")
    return beforeSkuList.find(o => {
        if (skus.length > o.skus.length) {
            // 新id是否包含老id
            return skusId.indexOf(o.skusId) != -1
        }
        return o.skusId.indexOf(skusId) != -1
    })
}