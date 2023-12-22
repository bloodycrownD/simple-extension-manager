import { Webview, commands, window, Uri } from "vscode";
import { homedir } from "os";
import Extension, { bulkCreate } from "../utils/core";
import {
    showWaringMsg,
    RegisterInfo,
    showErrMsg,
    ExtensionPackage,
    State,
    showInfoMsg,
    createExtension,
    readFilePromise,
    writeFilePromise,
    getExtensionId,
    getExtensionDirName,
    processBar
} from "../utils";
import { readFileSync } from "fs";
import { join } from "path";
import { pack } from "../utils/pack";
export enum Cmd {
    deleteExtension,
    getExtensions,
    showErrMsg,
    createExtensionPack,
    manualSynchronization,
    showInfo,
    pack
}


class Res {
    public success: boolean;
    constructor(success: boolean) {
        this.success = success;
    }
}


export class Msg {
    public cmd: Cmd;
    public data: string;
    public callBacKId: string | undefined;

    constructor(msg: Msg, cmd: Cmd, data: object) {
        this.cmd = cmd;
        this.data = JSON.stringify(data);
        this.callBacKId = msg.callBacKId;
    }
}


export function controller(msg: Msg, webview: Webview) {
    switch (msg.cmd) {
        case Cmd.deleteExtension:
            deleteExtension(msg, webview);
            break;
        case Cmd.getExtensions:
            if (msg.data) {
                processBar(() => {
                    getExtensions(msg, webview);
                })
            }
            else {
                getExtensions(msg, webview);
            }
            break;
        case Cmd.showErrMsg:
            showErrMsg(msg.data);
            break;
        case Cmd.createExtensionPack:
            createExtensionPack(msg, webview);
            break;
        case Cmd.manualSynchronization:
            manualSynchronization(msg, webview);
            break;
        case Cmd.showInfo:
            showInfoMsg(msg.data);
            break;
        case Cmd.pack:
            doPack(msg);
            break;
        default:
            break;
    }
}

async function manualSynchronization(msg: Msg, webview: Webview) {
    const data = <Extension[]>JSON.parse(msg.data);
    const select = await showWaringMsg("Confirm that you'd like to manually synchronize?", "Yes", "No");
    if (select === "Yes") {
        if (data.length !== 0) {
            await bulkCreate(data);
            webview.postMessage(new Msg(msg, Cmd.manualSynchronization, new Res(true)));
            showInfoMsg("Sync completed!");
            commands.executeCommand("workbench.extensions.action.refreshExtension");
            return;
        }
        showErrMsg("No Synchronization Required");
    }
}
async function deleteExtension(msg: Msg, webview: Webview) {
    const data = <Extension>JSON.parse(msg.data);
    const select = await showWaringMsg("Confirm that you'd like to delete this extension pack.", "Yes", "No");
    if (select === "Yes") {
        await Extension.deleteExtension(State.rootPath, data.pck);
        webview.postMessage(new Msg(msg, Cmd.deleteExtension, new Res(true)));
        commands.executeCommand("workbench.extensions.action.refreshExtension");
    }
}

function getExtensions(msg: Msg, webview: Webview) {
    const extensionRegisterInfos = <RegisterInfo[]>JSON.parse(readFileSync(join(State.rootPath, "extensions.json"), "utf-8"));
    let extensions = <Extension[]>extensionRegisterInfos.map(item => Extension.readFromFile(State.rootPath, item.relativeLocation));
    extensions = extensions.filter(e =>
        e && /* e存在*/
        (!e.pck.categories || e.pck.categories[0] !== "Language Packs") /* 不是语言包 */);
    //过滤掉extensionPack中不存在的extension    
    const tmpExtensionsId = extensions.map(m => getExtensionId(m.pck));
    extensions.forEach(f => {
        const extensionPack = f.pck.extensionPack;
        !extensionPack || (f.pck.extensionPack = extensionPack.filter(id => tmpExtensionsId.includes(id)));
    });

    webview.postMessage(new Msg(msg, Cmd.getExtensions, extensions));
}

async function createExtensionPack(msg: Msg, webview: Webview) {
    const res = JSON.parse(msg.data) as { extension: Extension, isUpdate: boolean };
    const newExtensionPck = ExtensionPackage.copy(res.extension.pck);
    const select = await showWaringMsg(`Confirm that you'd like to ${res.isUpdate ? "update" : "create"} extension`, "Yes", "No");
    if (select === "Yes") {
        if (res.isUpdate && res.extension.pck.name) {
            newExtensionPck.name = res.extension.pck.name;
            newExtensionPck.updatePackage(join(State.rootPath, getExtensionDirName(res.extension.pck)),
                res.extension.img.replace(/data:.*?;base64,/g, '') || undefined,
                () => {
                    webview.postMessage(new Msg(msg, Cmd.createExtensionPack, new Res(true)));
                    commands.executeCommand("workbench.extensions.action.refreshExtension");
                });
        }
        else {
            const content = await readFilePromise(join(State.rootPath, "extensions.json"), "utf-8");
            const extensionRegisterInfos = <RegisterInfo[]>JSON.parse(content);
            const finalExtension = new Extension(newExtensionPck, State.rootPath);
            finalExtension.img = res.extension.img.replace(/data:.*?;base64,/g, '');
            if (extensionRegisterInfos.find(e => e.identifier.id === finalExtension.pck.extensionID)) {
                showErrMsg("Extension Pack already exists!");
                return;
            }
            await createExtension(finalExtension);
            extensionRegisterInfos.push(new RegisterInfo(finalExtension.pck, State.rootPath));
            await writeFilePromise(join(State.rootPath, "extensions.json"), JSON.stringify(extensionRegisterInfos), "utf8");
            webview.postMessage(new Msg(msg, Cmd.createExtensionPack, new Res(true)));
            commands.executeCommand("workbench.extensions.action.refreshExtension");
            showInfoMsg("Extension pack successfully created!");
        }
    }
}
async function doPack(msg: Msg) {
    const data = <Extension>JSON.parse(msg.data);
    let extension = Extension.copy(data, State.rootPath);
    let res = await window.showSaveDialog({
        defaultUri: Uri.file(join(homedir(), `${extension.pck.publisher}.${extension.pck.name}-${extension.pck.version}.vsix`))
    });
    if (res?.path) {
        await pack(extension, res.path.slice(1));
        showInfoMsg("VS Code extension packaged successfully!!!");
    }
}

