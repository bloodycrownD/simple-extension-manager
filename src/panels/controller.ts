import { Webview, Uri } from "vscode";
import Extension from "../utils/extension";
import { showInfoMsg, showWaringMsg } from "../utils";
import { ExtensionManagerPanel } from "./ExtensionManagerPanel";

export enum Cmd {
    deleteExtension,
    showErr,
    
}

export class Msg {
    public cmd: Cmd;
    public data: string;
    public callBacKId: string | undefined;

    constructor(cmd: Cmd, data: string) {
        this.cmd = cmd;
        this.data = data;
    }

}

export function controller(msg: Msg, extensionPanel: ExtensionManagerPanel) {
    switch (msg.cmd) {
        case Cmd.deleteExtension:
            deleteExtension(msg,extensionPanel);
            break;

        default:
            break;
    }
}

async function deleteExtension(msg:Msg,extensionPanel: ExtensionManagerPanel) {
    const data = <Extension>JSON.parse(msg.data);
    const select = await showWaringMsg("Are you sure? This action will permanently delete this extension pack.","Yes","No");
    if (select === "Yes") {
        Extension.deleteExtension(extensionPanel.extensionRootPath,data.pck);
    }
}