<script setup lang="ts">
const props = defineProps<{ content: string, top: string, height: string,width:string,paddingTop:string }>();
</script>
<template>
    <span class="simpleTip" :tip="props.content" :style="{
        fontSize: '10px',
        '--simpleTipTop': props.top,
        '--simpleTipHeight': props.height,
        '--simpleTipWidth':props.width,
        '--simpleTipPaddingTop':props.paddingTop
    }">
        <slot></slot>
    </span>
</template>


<style scoped lang="less">
.simpleTip {
    position: relative;
}

.simpleTip:before {
    content: attr(tip);
    position: absolute;
    background-color: inherit;
    color: inherit;
    text-align: center;
    border-radius: 6px;
    z-index: 1;
    opacity: 0;
    width: var(--simpleTipWidth);
    padding-top: var(--simpleTipPaddingTop);
    height: var(--simpleTipHeight);
    top: var(--simpleTipTop);
    transition: opacity 0.6s;
    visibility: hidden;
    word-break: break-all;
    border: 1px solid var(--vscode-editorWidget-border);
}

.simpleTip:hover:before {
    opacity: 1;
    visibility: visible;
    background-color: var(--background);
}
</style>
