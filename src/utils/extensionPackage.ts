import {readFileSync,existsSync, writeFile} from "fs";
import { showErrMsg, showInfoMsg } from "./commonUtil";

export interface VsCodePackage {
    name: string
    version: string,
    publisher: string,
    icon: string,
    keywords: string[],
    repository: { type: string, url: string },
    engines: { vscode: string },
    extensionPack: string[],
    categories: string[],
    description: string,
    displayName: string
}


export class ExtensionPackage {
    private name: string = 'simple-extension-manager';
    private version: string = '1.0.0';
    private publisher: string = 'bloody-crown';
    public icon: string = "logo.png";
    private keywords: string[] = ['extension manager'];
    private repository: { type: string, url: string } = { type: 'git', url: 'https://github.com/bloodycrownD/simple-extension-manager.git' };
    private engines: { vscode: string } = { vscode: '*' };
    private _extensionPack: string[] = [];
    private categories: string[] = ["Extension Packs", "Custom Extension"];
    private _description: string = "an extension pack managing other extensions";
    private _displayName: string = 'simple-extension-manager';
    private _metadata: { installedTimestamp: number; };
    
    constructor(displayName: string, extensionPack: string[] = []) {
        this.displayName = displayName;
        this.name = this.nameTransfer(displayName);
        this.extensionPack = extensionPack;
        this._metadata = { installedTimestamp: Date.now() };
    }

    /**
     * 
     * @param path package.json path
     */
    public updatePackage(path:string){
        writeFile(path,this.toString(),"utf8",error=>{
            if (error) {
                showErrMsg(`update failed:${error?.message}`);
            }
            else{
                showInfoMsg("update successfully");
            }
        });
    }

    /**
     * 
     * @param path package.json path
     * @returns 
     */
    public static readFromFile(path:string):ExtensionPackage|undefined{
        if(!existsSync(path)){
            return undefined;
        }
        return <ExtensionPackage>JSON.parse(readFileSync(path,'utf-8')) ;
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

