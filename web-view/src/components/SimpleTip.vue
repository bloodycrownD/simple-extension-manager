<script setup lang="ts">
import { ref } from "vue";
const props = defineProps<{ content: string, top?: string, right?: string, height?: string, width?: string, paddingTop?: string }>();
const opacity = ref(0);
let timer: NodeJS.Timeout;
function mouseenter() {
    clearTimeout(timer);
    timer = setTimeout(() => { opacity.value = 1; }, 1000);
}
function mouseleave() {
    clearTimeout(timer);
    opacity.value = 0;
}
</script>
<template>
    <span class="simpleTip" :tip="props.content" :style="{
        fontSize: '10px',
        '--simpleTipTop': props.top || 'auto',
        '--simpleTipHeight': props.height || 'auto',
        '--simpleTipWidth': props.width || 'auto',
        '--simpleTipPaddingTop': props.paddingTop || 'auto',
        '--simpleTipRight': props.right || 'auto',
        '--simpleTipOpactiy': opacity
    }">
        <span @mouseenter="mouseenter" @mouseleave="mouseleave">
            <slot></slot>
        </span>
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
    opacity: var(--simpleTipOpactiy);
    width: var(--simpleTipWidth);
    padding-top: var(--simpleTipPaddingTop);
    height: var(--simpleTipHeight);
    top: var(--simpleTipTop);
    right: var(--simpleTipRight);
    transition: opacity 0.6s;
    word-break: break-all;
    border: 1px solid var(--vscode-editorWidget-border);

    background-color: var(--background);
}
</style>
