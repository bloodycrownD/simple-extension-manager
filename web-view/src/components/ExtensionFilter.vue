<script setup lang="ts">
import { ref } from 'vue';
import { Extension,extensionsPostResolver } from '../utils';
import SimpleTip from './SimpleTip.vue';
const filterEl = ref<HTMLInputElement>();
const props = defineProps<{ extensionList: Extension[] }>();
let cacheExtensions: Extension[] = [];
const matchCase = ref(false);
const matchWholeWord = ref(false);
const matchReg = ref(false);


function filterFunc(str: string, keyWord?: string): boolean {
    //字符串为空
    if (!keyWord) return false;
    //不匹配大小写
    if (!matchCase.value) {
        str = str.toLowerCase();
        keyWord = keyWord.toLowerCase();
    }
    //不是整词匹配，不是正则
    if (!matchWholeWord.value && !matchReg.value) return str.includes(keyWord);
    //正则+整词
    if (matchWholeWord.value && matchReg.value) return new RegExp("\\b" + keyWord + "\\b", "gm").test(str);
    //整词
    if (matchWholeWord.value) return new RegExp("\\b" + keyWord.replace(/[\-\/\\\^\$\*\+\?\.\(\)\|\[\]\{\}]/g, '\\$&') + "\\b", "g").test(str)
    //正则
    try {
        if (matchReg.value) return new RegExp(keyWord, "gm").test(str);
    }
    catch (err) {
        return false;
    }
    return false;
}
function searchFunc() {
    function getText(e: Extension): string {
        return e.pck.displayName + "\n" + e.pck.description + "\n" + e.pck.publisher
    }
    const totalExtensions = [...props.extensionList, ...cacheExtensions];
    if (filterEl.value?.value) {
        props.extensionList.length = 0;
        props.extensionList.push(...totalExtensions.filter(e => filterFunc(getText(e), filterEl.value?.value)))
        cacheExtensions = totalExtensions.filter(e => !filterFunc(getText(e), filterEl.value?.value))
    }
    else {
        props.extensionList.length = 0;
        props.extensionList.push(...totalExtensions);
        cacheExtensions.length = 0;
    }
    extensionsPostResolver(props.extensionList);
    extensionsPostResolver(cacheExtensions);
}
</script>
<template>
    <vscode-text-field class="filter" ref="filterEl" @input="searchFunc">
        <span slot="start" class="codicon codicon-search"></span>
        <section slot="end" style="display:flex; align-items: center;">
            <div :class="{ filterButton: true, focusButton: matchCase }" aria-label="Match Case"
                @click="() => { matchCase = !matchCase; searchFunc(); }">
                <SimpleTip content="Match Case" top="-32px" height="15px" width="110px" padding-top="1px">
                    <span class="codicon codicon-case-sensitive"></span>
                </SimpleTip>
            </div>
            <div :class="{ filterButton: true, focusButton: matchWholeWord }" aria-label="Match Whole Word"
                @click="() => { matchWholeWord = !matchWholeWord; searchFunc() }">
                <SimpleTip content="Match Whole Word" top="-32px" height="15px" width="110px" padding-top="1px">
                    <span class="codicon codicon-whole-word"></span>
                </SimpleTip>
                
            </div>
            <div :class="{ filterButton: true, focusButton: matchReg }" aria-label="Use Regular Expression"
                @click="() => { matchReg = !matchReg; searchFunc() }">
                <SimpleTip content="Use Regular Expression" top="-32px" height="15px" width="110px" padding-top="1px">
                    <span class="codicon codicon-regex"></span>
                </SimpleTip>
            </div>
        </section>
    </vscode-text-field>
</template>


<style scoped lang="less">
.filter {
    width: 100%;

    .baseStyle {
        border-radius: 3px;
        margin-left: 3px;
        box-sizing: border-box;
        height: 90%;
    }

    .filterButton {
        .baseStyle();
        border: 1px solid transparent;

        :hover {
            background-color: var(--vscode-inputOption-hoverBackground);
            border-radius: 3px;
        }
    }

    .focusButton {
        background-color: var(--vscode-inputOption-activeBackground);
        border: 1px solid var(--vscode-inputOption-activeBorder);
        .baseStyle();
    }
}</style>
