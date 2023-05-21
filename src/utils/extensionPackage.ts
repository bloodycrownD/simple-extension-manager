import {readFileSync,existsSync, writeFile} from "fs";
import { showErrMsg, showInfoMsg } from "./commonUtil";
import { dirname, join } from "path";




export class ExtensionPackage {
    private _name: string = 'simple-extension-manager';
    private version: string = '1.0.0';
    public publisher: string = 'bloodycrown';
    public icon: string = "logo.png";
    public keywords: string[] = ['extension manager'];
    private repository: { type: string, url: string } = { type: 'git', url: 'https://github.com/bloodycrownD/simple-extension-manager.git' };
    private engines: { vscode: string } = { vscode: '*' };
    private _extensionPack: string[] = [];
    public categories: string[] = ["Extension Packs", "Custom Extension"];
    private _description: string = "an extension pack managing other extensions";
    private _displayName: string = 'simple-extension-manager';
    private _metadata: { installedTimestamp: number; };
    
    constructor(displayName: string, extensionPack: string[] = [],discription:string) {
        this.displayName = displayName;
        this.name = this.nameTransfer(displayName);
        this.extensionPack = extensionPack;
        this._metadata = { installedTimestamp: Date.now() };
        this.description = discription;
    }
    /**
     * 
     * @param src 被拷贝的对象
     * @returns 
     */
    public static copy(src:ExtensionPackage):ExtensionPackage{
        return new ExtensionPackage(src.displayName,src.extensionPack,src.description);
    }

    /**
     * 
     * @param path dir path
     */
    public updatePackage(path:string,img?:string,cb?:Function){
        if (img) {
            writeFile(join(path, "logo.png"), Buffer.from(img, "base64"), err => {
                if (err) {
                    showErrMsg(`create failed:${err?.message}`);
                }
            });
        }
        writeFile(join(path,"package.json"),this.toString(),"utf8",error=>{
            if (error) {
                showErrMsg(`update failed:${error?.message}`);
            }
            else{
                showInfoMsg("update successfully");
                !cb||cb();
            }
        });
    }

    

    /**
     * 
     * @param path package.json path
     * @returns 
     */
    public static readFromFile(path:string,dirName:string):ExtensionPackage|undefined{
        if(!existsSync(join(path,dirName,"package.json"))){
            return undefined;
        }
        const tmpExtension = <ExtensionPackage>JSON.parse(readFileSync(join(path,dirName,"package.json"),'utf-8')) ;
        //处理国际化命名
        if (existsSync(join(path,dirName,`package.nls.json`))) {
            const nls = <Record<string,string>>JSON.parse(readFileSync(join(path,dirName,`package.nls.json`),"utf-8"));
            if (tmpExtension.description.includes("%")) {
                const key = tmpExtension.description.replace(/\%/g,'');                
                tmpExtension.description = <string>nls[key];
            }
            if (tmpExtension.displayName.includes("%")) {
                const key = tmpExtension.displayName.replace(/\%/g,'');
                tmpExtension.displayName = <string>nls[key];
            }            
        }

        return tmpExtension;
    }

    /**
     * transfer the display name to name
     * @param displayName 
     * @returns name
     */
    private nameTransfer(displayName: string): string {
        return displayName.replace(/[。~!@#$%\^\+\*&\\\/\?\|:\.<>{}()';="\s]/g, '-');
    }

    public get extensionID():string{
        return this.publisher + "." + this.name;
    }

    public get extensionDirName():string{
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

    public get name(): string {
        return this._name;
    }
    public set name(value: string) {
        this._name = value;
    }
    
    public get metadata(): { installedTimestamp: number; } {
        return this._metadata;
    }
    public set metadata(value: { installedTimestamp: number; }) {
        this._metadata = value;
    }

    public get displayName(): string {
        return this._displayName;
    }

    public set displayName(value: string) {
        this._displayName = value;
    }

    public get description(): string {
        return this._description;
    }

    public set description(value: string) {
        this._description = value;
    }

    public get extensionPack(): string[] {
        return this._extensionPack;
    }

    public set extensionPack(value: string[]) {
        this._extensionPack = value;
    }
}

