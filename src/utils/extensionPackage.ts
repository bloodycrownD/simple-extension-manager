import { readFileSync, existsSync, writeFile } from "fs";
import { State, showErrMsg, showInfoMsg } from "./commonUtil";
import { join } from "path";
import { writeFilePromise } from "./promiseUtils";




export class ExtensionPackage {
    public name: string = 'simple-extension-manager';
    public version: string = '1.0.0';
    public publisher: string = 'bloodycrown';
    public icon?: string = "logo.png";
    public keywords: string[] = ['extension manager'];
    public repository: { type: string, url: string } = { type: 'git', url: 'https://github.com/bloodycrownD/simple-extension-manager.git' };
    public engines: { vscode: string } = { vscode: '*' };
    //非扩展包插件可能没有这个属性
    public extensionPack?: string[] = [];
    public categories?: string[] = ["Extension Packs", "Custom Extension"];
    public description: string = "an extension pack management tool to manage other extensions";
    public displayName: string = 'simple-extension-manager';
    public metadata: { installedTimestamp: number; };

    constructor(displayName: string, extensionPack: string[] = [], discription: string) {
        this.displayName = displayName;
        this.name = this.nameTransfer(displayName);
        this.extensionPack = extensionPack;
        this.metadata = { installedTimestamp: Date.now() };
        this.description = discription;
    }
    /**
     * 
     * @param src 被拷贝的对象
     * @returns 
     */
    public static copy(src: ExtensionPackage): ExtensionPackage {
        return new ExtensionPackage(src.displayName, src.extensionPack, src.description);
    }

    /**
     * 
     * @param dirName dir Name
     */
    public async updatePackage(dirName: string, img?: string, cb?: Function) {
        const pkg = <ExtensionPackage>JSON.parse(readFileSync(join(State.rootPath, dirName, "package.json"), 'utf-8'))
        try {
            if (img) {
                pkg.icon = "logo.png";
                await writeFilePromise(join(State.rootPath, dirName, "logo.png"), Buffer.from(img, "base64"));
            }
            //这里pkg是直接JSON.parse出来的，没有toString方法
            pkg.extensionPack = this.extensionPack;            
            await writeFilePromise(join(State.rootPath, dirName, "package.json"), JSON.stringify(pkg))
            !cb || cb();
        }
        catch (err) {
            showErrMsg(`Update failed with error:${err}`);
        }
    }



    /**
     * 
     * @param path package.json path
     * @returns 
     */
    public static readFromFile(path: string, dirName: string): ExtensionPackage | undefined {
        if (!existsSync(join(path, dirName, "package.json"))) {
            return undefined;
        }
        const tmpExtension = <ExtensionPackage>JSON.parse(readFileSync(join(path, dirName, "package.json"), 'utf-8'));
        //处理国际化命名
        if (existsSync(join(path, dirName, `package.nls.json`))) {
            const nls = <Record<string, string>>JSON.parse(readFileSync(join(path, dirName, `package.nls.json`), "utf-8"));
            if (tmpExtension.description.includes("%")) {
                const key = tmpExtension.description.replace(/\%/g, '');
                tmpExtension.description = <string>nls[key];
            }
            if (tmpExtension.displayName.includes("%")) {
                const key = tmpExtension.displayName.replace(/\%/g, '');
                tmpExtension.displayName = <string>nls[key];
            }
        }
        if (!tmpExtension.displayName) tmpExtension.displayName = tmpExtension.name;
        //给所有插件加上扩展包属性
        if (!tmpExtension.extensionPack) tmpExtension.extensionPack = [];
        return tmpExtension;
    }

    /**
     * transfer the display name to name
     * @param displayName 
     * @returns name
     */
    private nameTransfer(displayName: string): string {
        return displayName.replace(/[。~!@#$%\^\+\*&\\\/\?\|:\.<>{}()';="\s]/g, '_').toLocaleLowerCase();
    }

    public get extensionID(): string {
        return this.publisher + "." + this.name;
    }

    public get extensionDirName(): string {
        return this.publisher + '.' + this.name + "-" + this.version;
    }

    public toString(): string {
        return JSON.stringify({
            name: this.name,
            version: this.version,
            publisher: this.publisher,
            icon: this.icon,
            keywords: this.keywords,
            repository: this.repository,
            engines: this.engines,
            extensionPack: this.extensionPack,
            categories: this.categories,
            description: this.description,
            displayName: this.displayName,
            //禁止驼峰命名
            // eslint-disable-next-line    
            __metadata: this.metadata
        });
    }
}

