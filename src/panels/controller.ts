import { Webview, Uri } from "vscode";
import Extension from "../utils/extension";
import { showInfoMsg, showWaringMsg,RegisterInfo } from "../utils";
import { ExtensionManagerPanel } from "./ExtensionManagerPanel";
import { readdirSync, statSync, existsSync ,readFileSync} from "fs";
import { join } from "path";
export enum Cmd {
    deleteExtension,
    getExtensions,
    showErrMSg

}

class DataShape {
    public result: object;
    public err: boolean;
    constructor(result: object) {
        this.result = result;
        this.err = false;
    }
}



export class Msg {
    public cmd: Cmd;
    public data: string;
    public callBacKId: string | undefined;

    constructor(msg:Msg,cmd: Cmd, data: object) {
        this.cmd = cmd;
        this.data = JSON.stringify(new DataShape(data));
        this.callBacKId = msg.callBacKId;
    }

}


export function controller(msg: Msg, webview: Webview) {
    switch (msg.cmd) {
        case Cmd.deleteExtension:
            deleteExtension(msg, webview);
            break;
        case Cmd.getExtensions:
            getExtensions(msg,webview);
            break
        default:
            break;
    }
}

async function deleteExtension(msg: Msg, webview: Webview) {
    const data = <Extension>JSON.parse(msg.data);
    const select = await showWaringMsg("Are you sure? This action will permanently delete this extension pack.", "Yes", "No");
    if (select === "Yes") {
        Extension.deleteExtension(ExtensionManagerPanel.extensionRootPath, data.pck);
    }
}

function getExtensions(msg:Msg,webview:Webview) {
    const extensionRegisterInfos = <RegisterInfo[]>JSON.parse(readFileSync(join(ExtensionManagerPanel.extensionRootPath, "extensions.json"), "utf-8"));
    const extensions = extensionRegisterInfos.map(item=>Extension.readFromFile(ExtensionManagerPanel.extensionRootPath,item.relativeLocation));
    webview.postMessage(new Msg(msg,Cmd.getExtensions,extensions))
}