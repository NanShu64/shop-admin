<script setup>
import { reactive, watch } from 'vue';
import gsap from 'gsap';

const props = defineProps({
    value: {
        type: Number,
        default: 0
    }
})
const d = reactive({
    num: 0
})

function AnimatedToValue() {
    gsap.to(d, {
        duration: 0.5,
        num: props.value
    }
    )
}
AnimatedToValue()
//监听value，有变化重新执行滚动动画
watch(() => props.value, () => AnimatedToValue())
</script>
<template>
    {{ d.num.toFixed(2) }}
</template>


<style scoped></style>