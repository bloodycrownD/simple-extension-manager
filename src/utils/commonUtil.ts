import { ProgressLocation, window } from "vscode";
import { ExtensionContext } from 'vscode';
import { ExtensionPackage } from "./extensionPackage";
export function getExtensionId(pck: ExtensionPackage): string {
    return pck.publisher + "." + pck.name;
}
export function getExtensionDirName(pck: ExtensionPackage) {
    return pck.publisher + '.' + pck.name + '-1.0.0';
}
export function showErrMsg(msg: string) {
    window.showErrorMessage(msg);
    console.log(msg);
}

export function showInfoMsg(msg: string) {
    window.showInformationMessage(msg);
    console.log(msg);
}

export async function showWaringMsg(msg: string, ...selects: string[]) {
    return await window.showWarningMessage(msg, ...selects);
}
export function processBar(task: Function) {
    return window.withProgress({
        location: ProgressLocation.Notification,
        title: "extensions loading...",
        cancellable: false
    }, (progress) => {
        progress.report({increment:-1});
        task();
        return new Promise<void>((resolve) => resolve());
    });
}
export let IS_DEVELOPMENT_MODE = false;
/**
 * 通用数据，以及导出上下文
 */
export class State {
    public static rootPath: string;

    public static context: ExtensionContext;
}


