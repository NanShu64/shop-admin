import { ref, nextTick } from 'vue';
import {
    createGoodsSkusCard, updateGoodsSkusCard,
    deleteGoodsSkusCard, sortGoodsSkusCard, createGoodsSkusCardValue, updateGoodsSkusCardValue, deleteGoodsSkusCardValue
} from "@/api/goods.js"
import { useArrayMoveUp, useArrayMoveDown } from './util';
// 当前商品ID,默认为0
export const goodsId = ref(0)
// 规格选项列表
export const sku_card_list = ref([])

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
        })
        .finally(() => {
            bodyLoading.value = false
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
            .then(res => [
                tag.value = value
            ])
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
        handleChange
    }
}