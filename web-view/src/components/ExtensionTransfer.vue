<script setup lang="ts">
import SimpleTip from './SimpleTip.vue';


</script>
<template>
    <div class="transfer" @click="$emit('transfer')" content="empty">
    </div>
</template>


<style scoped lang="less">
.transfer {
    height: 15px;
    width: 100%;
    background-color: var(--vscode-input-background);
    position: relative;

    &:hover {
        background-color: var(--vscode-button-secondaryHoverBackground);

        &::before {
            content: attr(content);
            left: 155px;
            position: relative;
            top: -4px;
            vertical-align: top;
        }
    }

    &:active {
        background-color: var(--vscode-input-background);
    }

}
</style>
