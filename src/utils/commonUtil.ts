import {window} from "vscode";

export function showErrMsg(msg:string){
    window.showErrorMessage(msg);
    console.log(msg);
}

export function showInfoMsg(msg:string){
    window.showInformationMessage(msg);
    console.log(msg);
}