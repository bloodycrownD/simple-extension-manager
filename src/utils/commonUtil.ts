import {window} from "vscode";

export function showErrMsg(msg:string){
    window.showErrorMessage(msg);
    console.log(msg);
}

export function showInfoMsg(msg:string){
    window.showInformationMessage(msg);
    console.log(msg);
}

export async function showWaringMsg(msg:string,...selects:string[]) {
    return await window.showWarningMessage(msg,...selects);
}

export let IS_DEVELOPMENT_MODE = false;


