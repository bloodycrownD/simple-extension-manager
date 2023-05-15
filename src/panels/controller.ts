import { Webview, Uri } from "vscode";

export enum Cmd {
    postData
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

export function controller(msg: Msg, webview: Webview) {
    switch (msg.cmd) {
        case Cmd.postData:

            const data = webview.asWebviewUri(Uri.file("F:/VScode_Project/simple-extension-manager/web-view/build/logo.png"));
            const message = new Msg(Cmd.postData, data.toString())
            message.callBacKId = msg.callBacKId
            webview.postMessage(message)
            break;

        default:
            break;
    }
}

