import { ref } from 'vue';
import {
    createGoodsSkusCard, updateGoodsSkusCard,
    deleteGoodsSkusCard
} from "@/api/goods.js"
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
// 初始化规格的值
export function initSkusCardItem(id) {
    // 查询o的id是否一致
    const item = sku_card_list.value.find(o => o.id == id)
    // 对象的形式返回
    return {
        item
    }
}