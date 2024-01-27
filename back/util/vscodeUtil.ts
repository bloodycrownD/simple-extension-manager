import { ProgressLocation, Uri, commands, window ,OpenDialogOptions} from "vscode";
import { appendFile } from "fs/promises";
import { join } from "path";
import { Global } from "./global";
import { homedir } from "os";
import { execSync } from "child_process";
export {
    showCheckedErrMsg,
    showUnCheckedErrMsg,
    showInfoMsg,
    showWaringMsg,
    processBar,
    recordErrMsg,
    refresh
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
    }, async (progress) => {
        progress.report({ increment: -1 });
        await task();
    });
}
/**
 * 刷新扩展
 * @returns 
 */
async function refresh() {
    return commands.executeCommand("workbench.extensions.action.refreshExtension");
}
/**
 * 文件保存窗口
 * @param saveName 
 * @returns 
 */
async function showSaveDialog(saveName:string) {
    let desktop = homedir();
    if(execSync(join(desktop,"Desktop"))) desktop = join(desktop,"Desktop");
    const uri = await  window.showSaveDialog({defaultUri: Uri.file(join(desktop, saveName))});
    return uri?.fsPath;
}

/**
 * 文件打开窗口，只能选择一个文件
 * @param filters @see {@link OpenDialogOptions.filters}
 * @returns 
 */
async function showOpenDialog(filters?: { [name: string]: string[] }) {
    let desktop = homedir();
    if(execSync(join(desktop,"Desktop"))) desktop = join(desktop,"Desktop");
    const uris = await window.showOpenDialog({defaultUri:Uri.file(desktop),filters});
    if(!uris){
        showCheckedErrMsg("The selected file does not exist!")
        return;
    }
    return uris[0].fsPath;
}


async function showQuickPick(...params:string[]) {
    return window.showQuickPick(params);
}