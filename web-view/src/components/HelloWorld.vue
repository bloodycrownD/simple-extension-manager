<script setup lang="ts">
import { Msg, vscode ,Cmd} from '../utils';
import {ref} from "vue";

const url = ref("");

vscode.postMessage(new Msg(Cmd.postData,''),(data:string)=>{
  url.value = data
})

</script>

<template>
<img :src="url">
{{ url }}
</template>

<style scoped>

</style>
