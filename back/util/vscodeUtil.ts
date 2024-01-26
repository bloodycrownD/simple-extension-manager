import { ProgressLocation, window } from "vscode";
import { appendFile } from "fs/promises";
import { join } from "path";
import { Global } from "./global";
export {
    showCheckedErrMsg,
    showUnCheckedErrMsg,
    showInfoMsg,
    showWaringMsg,
    processBar,
    recordErrMsg
};

/**
 * 显示可确认错误
 * @param msg 
 */
async function showCheckedErrMsg(msg: string): Promise<undefined>;
async function showCheckedErrMsg(msg: Error): Promise<undefined>;
async function showCheckedErrMsg(msg: string | Error) {
    switch (typeof msg) {
        case "string":
            console.log(msg);
            recordErrMsg(msg);
            return window.showErrorMessage(msg);
        default:
            console.log(msg.message);
            recordErrMsg(msg.message);
            return window.showErrorMessage(msg.message);
    }
}
/**
 * 显示未确认错误
 * @param msg 
 */
async function showUnCheckedErrMsg(msg: string): Promise<undefined>;
async function showUnCheckedErrMsg(msg: Error): Promise<undefined>;
async function showUnCheckedErrMsg(msg: string | Error) {
    switch (typeof msg) {
        case "string":
            console.log(msg);
            recordErrMsg(msg);
            return window.showErrorMessage(msg);
        default:
            const template = `${msg.message}\n${msg.stack}`;
            console.log(template);
            recordErrMsg(template);
            return window.showErrorMessage(msg.name, { modal: true, detail: template });
    }
};

async function recordErrMsg(msg: string) {
    const now = new Date();
    // 格式化为yyyy-MM-dd-HH-mm-ss
    const formattedDate = `${now.getFullYear()}-${('0' + (now.getMonth() + 1)).slice(-2)}-${('0' + now.getDate()).slice(-2)}-${('0' + now.getHours()).slice(-2)}-${('0' + now.getMinutes()).slice(-2)}-${('0' + now.getSeconds()).slice(-2)}`;
    const template = `${formattedDate}\n${msg}\n`
    return appendFile(join(Global.Context.extensionPath, "extension.log"), template);
}


async function showInfoMsg(msg: string) {
    console.log(msg);
    return window.showInformationMessage(msg);
}

async function showWaringMsg(msg: string, ...selects: string[]) {
    return window.showWarningMessage(msg, ...selects);
}
async function processBar(task: Function) {
    return window.withProgress({
        location: ProgressLocation.Notification,
        title: "extensions loading...",
        cancellable: false
    }, (progress) => {
        progress.report({ increment: -1 });
        task();
        return new Promise<void>((resolve) => resolve());
    });
}