import { runTasks, ExtensionInfo, Extension } from "../share";
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
import { join } from "path";
import { Uri } from "vscode";
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
    public async getExtensions() {
        const extensionsJson = await extensionsJsonHandler.readExtensionsJson();
        return extensionHandler.readExtensions(extensionsJson.map(e => join(Global.RootPath,e.relativeLocation)));
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
            const { packageJson, image, extensionId } = extension;
            const extensionsJson = await extensionsJsonHandler.readExtensionsJson();
            const extensionInfo = extensionsJson.find(e => e.identifier.id == extensionId);
            if (!extensionInfo) {
                await showCheckedErrMsg(`${extensionId} does not exist!`);
                return;
            }
            await extensionHandler.updateExtension(packageJson, join(Global.RootPath, extensionInfo.relativeLocation), image);
            await refresh();
            await showInfoMsg(`${extensionId} updated successfully!`);
        }
    }

    /**
     * 导出所有自定义扩展
     * @returns 
     */
    async exportCustomedExtensions() {
        const path = await showSaveDialog("extensions.zip");
        try {
            if (!path) throw new Error("Export action has been cancelled");
            const zip = new AdmZip();
            const extensionsJson = await extensionsJsonHandler.readExtensionsJson();
            const extensions = await extensionHandler.readExtensions(extensionsJson.map(e => join(Global.RootPath,e.relativeLocation)));
            for (const extension of extensions) {                
                const { packageJson, image, extensionId } = extension;
                const extensionInfo = extensionsJson.find(e => e.identifier.id == extensionId);
                if (!extensionInfo) {
                    // showCheckedErrMsg(`${extensionId} does not exist!`);
                    continue;
                }
                const { relativeLocation } = extensionInfo;
                zip.addFile(`${relativeLocation}/package.json`, Buffer.from(JSON.stringify(packageJson)), extensionId);
                zip.addFile(`${relativeLocation}/README.md`, Buffer.from(''));
                if (image && packageJson.icon) {
                    zip.addFile(`${relativeLocation}/${packageJson.icon}`, Buffer.from(image.replace(/data:.*?;base64,/g, ''), "base64"))
                }
            }
            await zip.writeZipPromise(path,{overwrite:true});
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
    async exportCustomedExtension(extensionId: string) {
        const path = await showSaveDialog(`${extensionId}.vsix`);
        try {
            if (!path) throw new Error("Export action has been cancelled");
            const zip = new AdmZip();
            const extensionsJson = await extensionsJsonHandler.readExtensionsJson();
            const extensions = await extensionHandler.readExtensions(extensionsJson.map(e => join(Global.RootPath,e.relativeLocation)));
            const extension = extensions.find(e => e.extensionId == extensionId);
            const extensionInfo = extensionsJson.find(e => e.identifier.id == extensionId);
            if (!extension || !extensionInfo) {
                showInfoMsg(`${extensionId} does not exist!`);
                return;
            }
            const { image, packageJson } = extension;
            const { relativeLocation } = extensionInfo;
            zip.addFile(`${relativeLocation}/extension/package.json`, Buffer.from(JSON.stringify(packageJson)));
            zip.addFile(`${relativeLocation}/extension/README.md`, Buffer.from(""));
            if (image && packageJson.icon) {
                zip.addFile(`${relativeLocation}/extension/${packageJson.icon}`, Buffer.from(image.replace(/data:.*?;base64,/g, ''), "base64"));
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
            const tasks: Promise<void>[] = [];
            const zip = new AdmZip(path);
            const zipEntries = zip.getEntries(); // an array of ZipEntry records
            zipEntries.forEach(function (zipEntry) {
                if (zipEntry.entryName.includes("package.json")) {
                    extensionsJson.push(new ExtensionInfo(zipEntry.comment, zipEntry.entryName, Uri.file(join(Global.RootPath, zipEntry.entryName)).path));
                }
                tasks.push(new Promise(resolve => {
                    zip.extractEntryTo(zipEntry.entryName, Global.RootPath);
                }));
            });
            runTasks(tasks);
        } catch (e) {
            await showCheckedErrMsg(e as Error);
        }
    }
}

export const extensionService = new ExtensionService();