import { runTasks, ExtensionInfo, Extension } from "../share";
import { extensionHandler, extensionsJsonHandler } from "../repo";
import {
    Global,
    emptyDirPromise,
    refresh,
    showCheckedErrMsg,
    showInfoMsg,
    showWaringMsg
} from "../util";
import { join } from "path";
import { execSync } from "child_process";
import { Uri } from "vscode";

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
        return extensionHandler.readExtensions();
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
            if (extensionsJson.find(e => e.identifier.id == extensionId) || execSync(absolutePath)) {
                showCheckedErrMsg(`${extensionId} exists!`);
                return;
            }
            const extensionInfo = new ExtensionInfo(extensionId, relativeLocation, Uri.file(absolutePath).path);
            extensionsJson.push(extensionInfo);
            await runTasks([
                extensionHandler.writeExtension(extension,absolutePath),
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
    async updateExtension(extension: Extension){
        const select = await showWaringMsg("Confirm that you'd like to update this extension?", "Yes", "No");
        if (select == 'Yes') {
            const {packageJson,image,extensionId } = extension;
            const extensionsJson = await extensionsJsonHandler.readExtensionsJson();
            const extensionInfo = extensionsJson.find(e => e.identifier.id == extensionId);
            if (!extensionInfo) {
                await showCheckedErrMsg(`${extensionId} does not exist!`);
                return;
            }
            await extensionHandler.updateExtension(packageJson,join(Global.RootPath,extensionInfo.relativeLocation),image);
            await refresh();
            await showInfoMsg(`${extensionId} updated successfully!`);
        }
    }
}

export const extensionService = new ExtensionService();