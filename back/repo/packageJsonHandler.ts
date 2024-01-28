import { existsSync, readFileSync } from "fs";
import { MutablePackage, PackageJson } from "../share";
import { env } from "vscode";
import { join } from "path";
import { writeFile } from "fs/promises";
class PackageJsonHandler {
    /**
     * 读取package.json
     * @param path 扩展文件夹路径
     * @returns PackageJson | undefined 读取不到扩展交给上方处理
     */
    public readPackageJson(path: string): PackageJson | undefined {
        try {
            const mutablePackage = <MutablePackage>JSON.parse(readFileSync(join(path, `package.json`), "utf-8"));
            const language = env.language;
            //处理国际化命名
            let nls: Record<string, string> = {};
            //默认显示英文
            if (existsSync(join(path, `package.nls.json`))) {
                nls = <Record<string, string>>JSON.parse(readFileSync(join(path, `package.nls.json`), "utf-8"));
            }
            else if (existsSync(join(path, `package.nls.${language}.json`))) {
                nls = <Record<string, string>>JSON.parse(readFileSync(join(path, `package.nls.${language}.json`), "utf-8"));
            }

            if (mutablePackage.description?.includes("%")) {
                const key = mutablePackage.description.replace(/\%/g, '');
                mutablePackage.description = <string>nls[key];
            }
            if (mutablePackage.displayName?.includes("%")) {
                const key = mutablePackage.displayName.replace(/\%/g, '');
                mutablePackage.displayName = <string>nls[key];
            }
            return mutablePackage as PackageJson;
        } catch (e) {

        };
    }
    /**
     * package.json存在则更新，不存在则创建该文件
     * @param packageJson 
     * @param path 扩展文件夹路径
     * @returns 
     */
    public async writePackageJson(packageJson: PackageJson, path: string) {
        return writeFile(join(path, "package.json"), JSON.stringify(packageJson));
    }

}

export const packageJsonHandler = new PackageJsonHandler();