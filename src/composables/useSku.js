import { ref } from 'vue';
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

// 初始化规格的值
export function initSkusCardItem(id) {
    // 查询o的id是否一致
    const item = sku_card_list.value.find(o => o.id == id)
    // 对象的形式返回
    return {
        item
    }
}