<script setup lang="ts">
</script>

<template>
  <transition>
    <router-view v-slot="{ Component }">
      <component :is="Component" />
    </router-view>
  </transition>
</template>

<style>
/* 下面我们会解释这些 class 是做什么的 */
.v-enter-active,
.v-leave-active {
  transition: all 0.3s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
  transform: translateY(100px);
}
body {
  overflow: hidden;
  user-select: none;
  margin: 0;
  padding: 0;
  border: 0;
  list-style: none;
  background-color: transparent;
}
</style>
