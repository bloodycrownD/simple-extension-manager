import { join } from "path";
import { Extension, PackageJson, runTasks } from "../share";
import { packageJsonHandler as pjh } from "./packageJsonHandler";
import { existsSync, readFileSync } from "fs";
import { showCheckedErrMsg } from "../util";
import { mkdir, writeFile } from "fs/promises";

class ExtensionHandler {
    /**
     * 读取所有扩展
     * @returns 
     */
    public async readExtensions(paths: string[]): Promise<Extension[]> {
        const tasks = [];
        for (const path of paths) {
            tasks.push(this.readExtension(path));
        }
        return runTasks(tasks);
    }

    /**
     * 读取扩展
     * @param path 扩展文件夹路径
     * @returns 
     */
    public async readExtension(path: string): Promise<Extension> {
        const packageJson = pjh.readPackageJson(path);
        if (!packageJson) throw new Error(`${join(path, "package.json")} does not exist!`);
        if (packageJson.icon && existsSync(join(path, packageJson.icon))) {
            return new Extension(packageJson, "data:image/png;base64," + readFileSync(join(path, packageJson.icon), "base64"));
        }
        return new Extension(packageJson);
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
        await mkdir(path);
        await runTasks([
            pjh.writePackageJson(packageJson, path),
            //手动创建的扩展一定存在icon，并将处理base64格式的图片数据
            writeFile(join(path, packageJson.icon as string), Buffer.from(image!.replace(/data:.*?;base64,/g, ''))),
            writeFile(join(path, "README.md"), ""),
        ]);
    }



    /**
     * 更新扩展，更新图片
     * @param packageJson 
     * @param path 
     * @param image 
     */
    public async updateExtension(packageJson: PackageJson, path: string, image: string | undefined) {
        const tasks = [pjh.writePackageJson(packageJson, path)];
        if (image) {
            tasks.push(writeFile(join(path, packageJson.icon as string), Buffer.from(image.replace(/data:.*?;base64,/g, ''))));
        }
        await runTasks(tasks);
    }
}

export const extensionHandler = new ExtensionHandler();