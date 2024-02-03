import { join } from "path";
import { Extension, PackageJson, runTasks } from "../share";
import { packageJsonHandler as pjh } from "./packageJsonHandler";
import { existsSync, readFileSync } from "fs";
import { showCheckedErrMsg } from "../util";
import { mkdir, writeFile } from "fs/promises";
interface ReadOption {
    readonly withImage: boolean
}


class ExtensionHandler {
    /**
     * 读取所有扩展
     * @returns 
     */
    public async readExtensions(paths: string[], option?: ReadOption): Promise<Extension[]> {
        const tasks = [];
        for (const path of paths) {
            tasks.push(this.readExtension(path,option));
        }
        return runTasks(tasks);
    }

    /**
     * 读取扩展
     * @param path 扩展文件夹路径
     * @returns 
     */
    public async readExtension(path: string, option?: ReadOption): Promise<Extension> {
        const packageJson = pjh.readPackageJson(path);
        if (!packageJson) throw new Error(`${join(path, "package.json")} does not exist!`);
        const extension = new Extension(packageJson, path);
        if (option?.withImage && packageJson.icon) {
            extension.image = {
                type: "base64",
                src: "data:image/png;base64," + readFileSync(join(path, packageJson.icon), "base64")
            };
        }
        return extension;
    }

    /**
     * 仅将扩展写入到磁盘上，并不能将扩展进行注册，即无法在vscode上查看扩展
     * @param extension 
     * @param path 扩展文件夹路径
     */
    public async writeExtension(extension: Extension, path: string) {
        const { packageJson, image } = extension;
        if (existsSync(path)) {
            showCheckedErrMsg(`${path} exists!`);
            return;
        }
        const tasks = [
            pjh.writePackageJson(packageJson, path),
            writeFile(join(path, "README.md"), ""),
        ];
        if (image?.type == "base64" && packageJson.icon) {
            tasks.push(writeFile(join(path, packageJson.icon), Buffer.from(image.src.replace(/data:.*?;base64,/g, ''))))
        }
        await mkdir(path);
        await runTasks(tasks);
    }
}

export const extensionHandler = new ExtensionHandler();