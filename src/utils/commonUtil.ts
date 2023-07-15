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

let isDevelopmentModel = true;

export function setDevelopmentModel(yes:boolean){
    isDevelopmentModel = yes;
}
/**
 * 
 * @returns development mode return true
 */
export function getModel(){
    return isDevelopmentModel;
}