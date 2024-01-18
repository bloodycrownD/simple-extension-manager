<script setup lang="ts">
import { computed } from 'vue';
import { Extension, getExtensionId } from '../utils';
import { extensionStore } from '../store';
import { ref } from 'vue';

const store = extensionStore();
interface Props {
    left: number,
    extension: Extension,
    parentId: string
}
const {
    left, extension, parentId
} = defineProps<Props>();
const icon = computed(() => {
    switch (state.value) {
        case 0: return "codicon codicon-chevron-right"
        case 1: return "codicon codicon-chevron-down"
        case 2: return "codicon codicon-package"
    }
})
const vars = {
    "--padding-left": left + 'px'
}
const childLeft = left + 20;
const state = extension.pck.extensionPack.length && !extension.pck.extensionPack.includes(parentId) ? ref(0) : ref(2);
function getState(extension: Extension) {
    if (extension.pck.extensionPack.length) {
        state.value = ~state.value & 1;
    }
}
</script>
<template>
    <div class="item" :style="vars" @click="getState(extension)">
        <div class="text">
            <span :class="icon"></span>
            <span class="description">
                {{ extension.pck.displayName }}
            </span>
        </div>
    </div>
    <template v-for="item in store.getExtensionInPack(extension.pck.extensionPack)">
        <DirItem v-if="childLeft <= 130 && getExtensionId(item) !== parentId && state == 1" :parent-id="parentId"
            :extension="item" :left="childLeft"></DirItem>
    </template>
</template>


<style scoped lang="less">
.item {
    padding-left: var(--padding-left);

    &:hover {
        //vscode本身定义的变量
        background-color: var(--vscode-commandCenter-background);
    }

    .text {
        .description {
            padding-left: 2px;
        }

        display: flex;
        align-items: center;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
    }
}
</style>
