<script setup lang="ts">
// import { Extension, getExtensionId } from '../utils';
import { ref } from 'vue';
import { Extension, getExtensionId } from '../utils';
import DirItem from './DirItem.vue';
const props = defineProps<{ extensions: Extension[], parentId: string }>();
</script>
<template>
    <div class="borderOne">
        <div class="borderTwo">
            <DirItem v-for="item in props.extensions" 
                :extension="item" 
                :parent-id="parentId" 
                :left="10" 
            ></DirItem>
        </div>
    </div>
</template>


<style scoped lang="less">
.borderOne {
    box-sizing: border-box;
    padding-left: 5px;

    .borderTwo {
        border-right: 1px solid var(--vscode-button-secondaryHoverBackground);
        border-bottom: 1px solid var(--vscode-button-secondaryHoverBackground);
        border-left: 3px solid var(--vscode-editor-background);
        border-top: 3px solid var(--vscode-editor-background);
        box-sizing: border-box;
        padding-bottom: 4px;


    }
}

// .item {
//     opacity: 0.5;
//     // border: var(--vscode-notebook-cellEditorBackground, var(--vscode-editor-background)) 1px solid;
// }
</style>
