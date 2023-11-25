<script setup lang="ts">
import { Extension, Msg, exportData, uploadFile, vscode, Cmd, Res, getExtensionId } from '../utils';
import { ref } from 'vue';
import SimpleTip from './SimpleTip.vue';
const props = defineProps<{ extensionPackArr: Extension[], callBack: Function }>();
const uploadButton = ref<HTMLElement>();
function fileResolver(reader: FileReader, file: File) {
    reader.readAsText(file);
    reader.onload = () => {
        const synArr = (<Extension[]>JSON.parse(<string>reader.result)).
            filter(f => !props.extensionPackArr.find(x => getExtensionId(x) == getExtensionId(f)));
        if (synArr.length == 0) {
            vscode.postMessage(new Msg(Cmd.showErrMsg, "No Synchronization Required"));
        }
        else {
            vscode.postMessage(new Msg(Cmd.manualSynchronization, synArr), (res: string) => {
                if (<Res>JSON.parse(res).success) {
                    props.callBack();
                }
            })
        }
    }

}
</script>
<template>
    <div class="downLoadAndUpLoad">
        <SimpleTip content="upload" top="-27px" height="9px" width="42px" padding-top="8px" right="-5px">
            <vscode-button appearance="icon" @click="() => { uploadButton?.click() }">
                <span class="codicon codicon-cloud-upload"></span>
            </vscode-button>
        </SimpleTip>
        <SimpleTip content="export" top="-27px" height="9px" width="42px" padding-top="8px" right="-4px">
            <vscode-button appearance="icon" @click="exportData(props.extensionPackArr)">
                <span class="codicon codicon-cloud-download"></span>
            </vscode-button>
        </SimpleTip>
    </div>
    <input style="display: none" id="file" ref="uploadButton" type="file" @change="uploadFile($event, fileResolver)"
        accept=".json" />
</template>


<style lang="less" scoped >
.downLoadAndUpLoad {
    @size: 30px;

    span {
        font-size: @size;
        height: @size;
        width: @size;
    }
}
</style>
