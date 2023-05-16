<script setup lang="ts">
import { extensionStore } from "../store";
import {Cmd, Msg, vscode,Extension} from "../utils";
import {
    provideVSCodeDesignSystem,
    vsCodeDivider,
    vsCodeBadge,
    vsCodeButton
} from "@vscode/webview-ui-toolkit";
provideVSCodeDesignSystem().register(
    vsCodeDivider(),
    vsCodeBadge(),
    vsCodeButton()
);

const extensions = extensionStore()
function deleteExtension(data:Extension) {
    vscode.postMessage(new Msg(Cmd.deleteExtension,JSON.stringify(data)))
}
extensions.getExtensions();
</script>

<template>
    <div class="outer">
        <div class="top">
            <h1 class="title">Extension Pack Management</h1>
            <vscode-button class="create">
                <div class="icon">
                    <svg t="1684216155601" class="icon" viewBox="0 0 1024 1024" version="1.1"
                        xmlns="http://www.w3.org/2000/svg" p-id="2598" width="20" height="20">
                        <path
                            d="M800 480H544V224c0-17.664-14.336-32-32-32s-32 14.336-32 32v256H224c-17.664 0-32 14.336-32 32s14.336 32 32 32h256v256c0 17.696 14.336 32 32 32s32-14.304 32-32V544h256c17.696 0 32-14.336 32-32s-14.304-32-32-32z"
                            p-id="2599"></path>
                    </svg>
                </div>
                <div class="info">Create</div>
            </vscode-button>
        </div>
        <vscode-divider></vscode-divider>
        <div class="bottom">
            <div class="extensionPack" v-for="item in extensions.extensionArray" :key="item?.dirName">
                <img :src="item?.imgUri" class="icon" draggable="false">
                <vscode-badge class="packNum" :style="{visibility: item?.pck?.extensionPack?.length?'hidden':''}">{{ item?.pck?.extensionPack?.length }}</vscode-badge>
                <div class="info">
                    <h3 class="displayName">{{ item?.pck?.displayName }}</h3>
                    <p class="disciption">{{ item?.pck?.description }}</p>
                    <h4 class="publisher">{{ item?.pck?.publisher }}</h4>
                </div>
                <div class="edit">
                    <svg t="1684230815052" class="icon" viewBox="0 0 1024 1024" version="1.1"
                        xmlns="http://www.w3.org/2000/svg" p-id="4208" width="20" height="20">
                        <path
                            d="M800 959.96l-576 0c-52.9 0-96-43.1-96-96l0-640c0-52.9 43.1-96 96-96l448 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-448 0c-17.6 0-32 14.4-32 32l0 640c0 17.7 14.4 32 32 32l576 0c17.7 0 32-14.3 32-32l0-512c0-17.7 14.3-32 32-32s32 14.3 32 32l0 512C896 916.96 852.9 959.96 800 959.96zM511.7 542.76c-8.3 0-16.5-3.2-22.8-9.5-12.4-12.6-12.3-32.8 0.3-45.2l418.3-413.7c12.6-12.4 32.8-12.3 45.2 0.3 12.4 12.6 12.3 32.8-0.3 45.2l-418.3 413.7C527.9 539.66 519.8 542.76 511.7 542.76z"
                            p-id="4209"></path>
                    </svg>
                </div>
                <div class="delete" @click="deleteExtension(item)">
                    <svg t="1684230900952" class="icon" viewBox="0 0 1024 1024" version="1.1"
                        xmlns="http://www.w3.org/2000/svg" p-id="6035" width="30" height="30">
                        <path
                            d="M656 288h144a16 16 0 0 1 16 16v16a16 16 0 0 1-16 16h-48v496a16 16 0 0 1-16 16H288a16 16 0 0 1-16-16V336h-48a16 16 0 0 1-16-16v-16a16 16 0 0 1 16-16h144v-80a16 16 0 0 1 16-16h256a16 16 0 0 1 16 16v80z m-48 0v-48H416v48h192z m32 48H320v464h384V336h-64z m-208 112h16a16 16 0 0 1 16 16v192a16 16 0 0 1-16 16h-16a16 16 0 0 1-16-16V464a16 16 0 0 1 16-16z m144 0h16a16 16 0 0 1 16 16v192a16 16 0 0 1-16 16h-16a16 16 0 0 1-16-16V464a16 16 0 0 1 16-16z"
                             p-id="6036"></path>
                    </svg>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="less">
@miniWidth: 650px;
@outerHeight: 95vh;
@outerWidth: 80vw;

@topPadding: (@outerHeight - @bottomHeight) * 0.5;
@topHeight: (@outerHeight - @bottomHeight )* 0.3;
@topWidth: @outerWidth;

@bottomWidth: @outerWidth * 0.9;
@bottomHeight: 70vh;

@extensionPackWidth: @bottomWidth ;
@extensionPackHeight: 10vh;
@extensionPackMargin: 0.2 * @extensionPackHeight;

@packNumPaddingTop: @extensionPackHeight*0.7;

@buttonHeight: 40px;
@buttonWidth: 120px;

@topMarginTop: @topHeight*0.5;

.alignHorizontal(@height, @width) {
    width: @width;
    height: @height;
    margin: 0 auto;
}

.alignVertical() {
    top: 0;
    bottom: 0;
    margin: auto 0;
}

.align() {
    top: 50%;
    transform: translateY(-50%);
}

.outer {
    min-width: @miniWidth;
    .alignHorizontal(@outerHeight, @outerWidth);

    .top {
        min-width: @miniWidth;
        display: flex;
        justify-content: space-between;
        line-height: 0;
        .alignHorizontal(@topHeight, @topWidth);
        padding-top: @topPadding;

        .create {
            .alignVertical();
            height: @buttonHeight;
            width: @buttonWidth;
            display: flex;
            justify-content: space-around;
            position: relative;

            .icon {
                position: absolute;
                left: @buttonWidth * 0.05;
                .align();
            }

            .info {
                position: absolute;
                right: @buttonWidth * 0.2;
                font-size: 18px;
                .align();
            }
        }

    }

    .bottom {
        min-width: @miniWidth;
        cursor: pointer;
        overflow-y: scroll;
        overflow-x: hidden;
        .alignHorizontal(@bottomHeight, @bottomWidth);

        .activeExtensionPack {
            background-color: var(--vscode-scrollbarSlider-activeBackground);
            border: var(--vscode-focusBorder) solid 1px;
        }

        .extensionPack {
            min-width: @miniWidth;
            display: flex;
            position: relative;
            margin-top: @extensionPackMargin;
            width: @extensionPackWidth;
            height: @extensionPackHeight;

            &:hover {
                //vscode本身定义的变量
                background-color: var(--vscode-scrollbarSlider-hoverBackground);
            }

            .packNum {
                padding-top: @packNumPaddingTop;
                transform: translateX(-100%);
            }

            .info {
                line-height: 0;
                .alignVertical();
            }

            .buttonSize() {
                height: 24px;
                width: 24px;
            }
            .delete {
                position: absolute;
                right: @extensionPackWidth * 0.1;

                &:hover {
                    //vscode本身定义的变量
                    background-color: var(--vscode-scrollbarSlider-hoverBackground);
                }

                .buttonSize();
                .align();

                .icon {
                    fill: currentColor;
                    position: absolute;
                    transform: translateX(-10%);
                    top: -10%;
                }
            }

            .edit {
                position: absolute;
                right: @extensionPackWidth * 0.15;
                &:hover {
                    //vscode本身定义的变量
                    background-color: var(--vscode-scrollbarSlider-hoverBackground);
                }

                .buttonSize();
                .align();

                .icon {
                    fill:currentColor;
                    transform: translateX(10%);
                    position: absolute;
                    top: 10%;
                }
            }
        }
    }
}</style>
