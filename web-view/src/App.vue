<script setup lang="ts">

</script>

<template>
  <router-view v-slot="{ Component }">
    <keep-alive>
      <component :is="Component" />
    </keep-alive>
  </router-view>
</template>

<style>
body {
  user-select: none;
  margin: 0;
  padding: 0;
  border: 0;
  list-style: none;
  background-color: transparent;
}
</style>
