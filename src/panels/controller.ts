import { Webview, Uri } from "vscode";
import { Msg,Cmd } from "../utils";


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

