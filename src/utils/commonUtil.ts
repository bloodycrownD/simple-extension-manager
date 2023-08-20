import { window } from "vscode";
import { ExtensionContext } from 'vscode';
import Extension from "./extension";

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

export let IS_DEVELOPMENT_MODE = true;
/**
 * 通用数据，以及导出上下文
 */
export class State {
    private static readonly keyName = "EXTENSION_STATE";
    public static rootPath: string;

    public static context: ExtensionContext;

    public static getVal() {
        if (State.context !== null) {
            const val = State.context.globalState.get(State.keyName);
            if (val) {
                return JSON.parse(<string>val);
            }
        }
    }

    public static async setVal(val: any) {
        if (State.context !== null) {
            State.context.globalState.setKeysForSync([State.keyName]);
            await State.context.globalState.update(State.keyName, JSON.stringify(val));
        }
    }
}
