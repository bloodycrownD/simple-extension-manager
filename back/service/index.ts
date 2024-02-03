import { runTasks, ExtensionInfo, Extension, Dict, PackageJson } from "../share";
import { extensionHandler, extensionsJsonHandler } from "../repo";
import {
    Global,
    emptyDirPromise,
    refresh,
    showCheckedErrMsg,
    showInfoMsg,
    showOpenDialog,
    showSaveDialog,
    showWaringMsg,
} from "../util";
import { dirname, join, resolve } from "path";
import { Uri, Webview } from "vscode";
import { existsSync } from "fs";
import AdmZip = require("adm-zip");

class ExtensionService {
    /**
     * 删除扩展
     * @param extensionId 
     * @returns 
     */
    public async deleteExtension(extensionId: string) {
        const select = await showWaringMsg("Confirm that you'd like to uninstall this extension?", "Yes", "No");
        if (select == "Yes") {
            const extensionsJson = await extensionsJsonHandler.readExtensionsJson();
            const index = extensionsJson.findIndex(e => e.identifier.id == extensionId);
            if (index == -1) {
                await showCheckedErrMsg(`${extensionId} does not exist!`);
                return;
            }
            //移除extensions.json中的扩展信息
            const extensionInfo = extensionsJson.splice(index, 1)[0];
            await runTasks([
                emptyDirPromise(join(Global.RootPath, extensionInfo.relativeLocation)),
                extensionsJsonHandler.writeExtensionsJson(extensionsJson)
            ]);
            await refresh();
            await showInfoMsg(`${extensionId} uninstalled successfully!`);
        }
    }
    /**
     * 获取所有扩展
     * @returns 
     */
    public async getExtensions(webView: Webview) {
        const extensionsJson = await extensionsJsonHandler.readExtensionsJson();
        const extensions = await extensionHandler.readExtensions(extensionsJson.map(e => join(Global.RootPath, e.relativeLocation)));
        //回补iconWebViewUri
        return extensions.map(e => {
            const { icon } = e.packageJson;
            if (icon) {
                e.image = {
                    src: webView.asWebviewUri(Uri.file(join(e.path, icon))).toString(),
                    type: "webViewUri"
                }
            }
        });
    }

    /**
     * 创建扩展
     * @param extension 
     */
    public async createExtension(extension: Extension) {
        const select = await showWaringMsg("Confirm that you'd like to create this extension?", "Yes", "No");
        if (select == 'Yes') {
            const extensionsJson = await extensionsJsonHandler.readExtensionsJson();
            const { extensionId, packageJson } = extension;
            const relativeLocation = extensionId + '-' + packageJson.version;
            const absolutePath = join(Global.RootPath, relativeLocation);
            if (extensionsJson.find(e => e.identifier.id == extensionId) || existsSync(absolutePath)) {
                showCheckedErrMsg(`${extensionId} exists!`);
                return;
            }
            const extensionInfo = new ExtensionInfo(extensionId, relativeLocation, Uri.file(absolutePath).path);
            extensionsJson.push(extensionInfo);
            await runTasks([
                extensionHandler.writeExtension(extension, absolutePath),
                extensionsJsonHandler.writeExtensionsJson(extensionsJson)
            ]);
            await refresh();
            await showInfoMsg(`${extensionId} created successfully!`);
        }
    }
    /**
     * 更新扩展
     * @param extension 
     * @returns 
     */
    async updateExtension(extension: Extension) {
        const select = await showWaringMsg("Confirm that you'd like to update this extension?", "Yes", "No");
        if (select == 'Yes') {
            const { path, extensionId } = extension;
            await extensionHandler.writeExtension(extension, path);
            await refresh();
            await showInfoMsg(`${extensionId} updated successfully!`);
        }
    }

    /**
     * 导出所有自定义扩展
     * @returns 
     */
    async exportExtensions() {
        const path = await showSaveDialog("extensions.zip");
        try {
            if (!path) throw new Error("Export action has been cancelled");
            const zip = new AdmZip();
            const extensionsJson = await extensionsJsonHandler.readExtensionsJson();
            const extensions = await extensionHandler.readExtensions(extensionsJson.map(e => join(Global.RootPath, e.relativeLocation)), { withImage: true });
            for (const extension of extensions) {
                const { packageJson, image, extensionId } = extension;
                const extensionInfo = extensionsJson.find(e => e.identifier.id == extensionId);
                if (!extensionInfo) {
                    // showCheckedErrMsg(`${extensionId} does not exist!`);
                    continue;
                }
                const vsix = new AdmZip();
                const { relativeLocation } = extensionInfo;
                vsix.addFile(`extension/package.json`, Buffer.from(JSON.stringify(packageJson)));
                vsix.addFile(`extension/README.md`, Buffer.from(''));
                if (packageJson.icon && image?.type == "base64") {
                    vsix.addFile(`extension/${packageJson.icon}`, Buffer.from(image.src.replace(/data:.*?;base64,/g, ''), "base64"))
                }
                zip.addFile(`${relativeLocation}.vsix`, vsix.toBuffer());
            }
            await zip.writeZipPromise(path);
            await showInfoMsg(`Export successfully!`);
        } catch (e) {
            await showCheckedErrMsg(e as Error);
        }
    }
    /**
     * 导出一个扩展，vsix格式，可被vscode直接安装
     * @param extension 
     * @returns 
     */
    async exportSingleExtension(extensionPath: string) {
        const relativeLocation = dirname(extensionPath);
        const path = await showSaveDialog(`${relativeLocation}.vsix`);
        try {
            if (!path) throw new Error("Export action has been cancelled");
            const zip = new AdmZip();
            const extension = await extensionHandler.readExtension(extensionPath, { withImage: true });
            const { image, packageJson } = extension;
            zip.addFile(`extension/package.json`, Buffer.from(JSON.stringify(packageJson)));
            zip.addFile(`extension/README.md`, Buffer.from(""));
            if (packageJson.icon && image?.type == "base64") {
                zip.addFile(`extension/${packageJson.icon}`, Buffer.from(image.src.replace(/data:.*?;base64,/g, ''), "base64"));
            }
            await zip.writeZipPromise(path);
            await showInfoMsg(`Export successfully!`);
        } catch (e) {
            await showCheckedErrMsg(e as Error);
        }
    }

    async loadZipExtensions() {
        const path = await showOpenDialog();
        try {
            if (!path) throw new Error("Export action has been cancelled");
            if (!existsSync(path)) throw new Error(`${path} does not exist!`);
            const extensionsJson = await extensionsJsonHandler.readExtensionsJson();
            const tasks:Promise<void>[] = [];
            const zip = new AdmZip(path);
            const zipEntries = zip.getEntries(); // an array of ZipEntry records
            zipEntries.forEach(zipEntry => {
                tasks.push(new Promise<void>(resolve => {
                    const innerZip = new AdmZip(zipEntry.getData());
                    const entryDict: Dict<AdmZip.IZipEntry> = {};
                    innerZip.forEach(innerEntry => {
                        entryDict[innerEntry.entryName] = innerEntry;
                    });
                    innerZip.forEach(async innerEntry => {
                        const { entryName } = innerEntry;
                        if (entryName.includes("package.json")) {
                            const absolutePath = join(Global.RootPath, entryName);
                            const packageJson = JSON.parse(innerEntry.getData().toString()) as PackageJson;
                            const extension = new Extension(packageJson, absolutePath);
                            extension.image = {
                                type: "base64",
                                src: entryDict[innerEntry.entryName].getData().toString("base64")
                            }
                            const extensionId = packageJson.publisher + '.' + packageJson.name;
                            extensionsJson.push(new ExtensionInfo(extensionId, entryName, Uri.file(absolutePath).path));
                            await extensionHandler.writeExtension(extension, absolutePath);
                            resolve();
                        }
                    })
                }))
            });
            await runTasks(tasks);
            await extensionsJsonHandler.writeExtensionsJson(extensionsJson);
            await showInfoMsg("Load extensions.zip successfully!");
        } catch (e) {
            await showCheckedErrMsg(e as Error);
        }
    }
}

export const extensionService = new ExtensionService();