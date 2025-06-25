<script setup>
import {
    initSkusCardItem
} from "@/composables/useSku.js"
// 通过组件，拿id，prop接收
const props = defineProps({
    // 定义一个id
    skuCardId: [Number, String]
})

const {
    item
} = initSkusCardItem(props.skuCardId)
</script>
<template>
    <div v-for="(tag,index) in item.goodsSkusCardValue" :key="index">
        {{ tag.text }}
    </div>
</template>


<style scoped></style>