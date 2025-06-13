<script setup>
</script>
<template>
  <router-view></router-view>
</template>


<style>
body {
  @apply bg-gray-100;
}

#nprogress .bar {
  background-color: #c8ffcc !important;
  height: 3px !important;
}

::-webkit-scrollbar {
  /* 滚动条整体部分 */
  width: 4px;
  height: 6px;

}

::-webkit-scrollbar-corner {
  /* 滚动条边角部分 */
  display: block;
}

::-webkit-scrollbar-thumb {
  /* 滚动条拖拽方块 */
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.2);
}

::-webkit-slider-thumb,
::-webkit-scrollbar-track {
  /* 滚动条轨道 */
  border-right-color: transparent;
  border-left-color: transparent;
  background: rgba(0, 0, 0, 0.1);
}
</style>
