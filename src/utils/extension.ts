import { ExtensionPackage } from "./extensionPackage";
import { mkdir, existsSync, readdirSync, statSync, unlinkSync, rmdirSync, readFileSync, writeSync, write, writeFile, mkdirSync } from "fs";
import { join } from "path";
import { showErrMsg, showInfoMsg } from "./commonUtil";

const defaultREADME = '';
const defaultImg = '';
/**
 * 删除指定目录下所有子文件
 * @param {*} path 
 */
export function emptyDir(path: string) {
    const files = readdirSync(path);
    files.forEach(file => {
        const filePath = `${path}/${file}`;
        const stats = statSync(filePath);
        if (stats.isDirectory()) {
            emptyDir(filePath);
        } else {
            unlinkSync(filePath);
        }
    });
    rmdirSync(path);
}

export default class Extension {
    public pck: ExtensionPackage;
    public img: string = defaultImg;
    private _readme: string = defaultREADME;
    public dirName: string = '';
    public imgUri: string = '';
    private rootPath;

    constructor(pck: ExtensionPackage, rootPath: string, dirName?: string) {
        this.pck = pck;
        this.rootPath = rootPath;
        //package.json icon attribute may be not exist
        if(pck.icon){
            if (dirName && existsSync(join(rootPath, dirName, pck.icon))) {
                this.img =  "data:image/png;base64," +  readFileSync(join(rootPath, dirName, pck.icon)).toString("base64");            
                this.dirName = dirName;
            }
        }
    }


    /**
     * 
     * @param path extensionDirPath
     * @returns if extension exists,then return Extension,otherwise return undefined
     */
    public static readFromFile(rootPath: string, dirName: string): Extension | undefined {
        if(!rootPath || !dirName){
            return undefined;
        }
        const tmpPck = ExtensionPackage.readFromFile(rootPath, dirName);        
        if (tmpPck) {
            const tmpExtension = new Extension(tmpPck, rootPath, dirName);
            return tmpExtension;
        }
        //to many messages
        // showErrMsg(`${join(rootPath, dirName)} does not exists!`); 
        return undefined;
    }

    /**
     * 
     * @param path root path
     * @param pck extensionPackage
     */
    public static deleteExtension(path: string, pck: ExtensionPackage,cb?:Function) {       
        //only use for pck from webview
        function extensionId(pck:ExtensionPackage):string{
            return pck.publisher + "." + pck.name;
        }         
        const extensionRegisterInfos = <RegisterInfo[]>JSON.parse(readFileSync(join(path, "extensions.json"), "utf-8"));
        const tmp = extensionRegisterInfos.find(e => e.identifier.id === extensionId(pck));     
        if (tmp) {
            emptyDir(join(path, tmp.relativeLocation));
            writeFile(join(path, "extensions.json"),
                JSON.stringify(extensionRegisterInfos.filter(e => e.identifier.id !== extensionId(pck))),
                "utf8",
                err => {
                    if (err) {
                        showErrMsg(`Error while deleting pack :${err.message}`);
                    }
                    else {
                        if (cb) {
                            cb();
                            showInfoMsg(`Pack successfully removed!`);
                        }
                    }
                });
            return;
        }
        showErrMsg(`${extensionId(pck)} has been deleted`);
    }

    /**
     * 
     * @param path root path
     */
    public createExtension(cb?: Function) {
        const dirPath = join(this.rootPath, this.pck.extensionDirName);
        if (existsSync(dirPath)) { emptyDir(dirPath); }
        mkdir(dirPath, err => {
            if (!err) {
                writeFile(join(dirPath, "package.json"), this.pck.toString(), "utf8", err => {
                    if (err) {
                        showErrMsg(`Creation failed with error :${err?.message}`);
                    }
                });
                writeFile(join(dirPath, "logo.png"), Buffer.from(this.img, "base64"), err => {
                    if (err) {
                        showErrMsg(`Creation failed with error:${err?.message}`);
                    }
                });
                writeFile(join(dirPath, "README.md"), this.readme, "utf8", err => {
                    if (err) {
                        showErrMsg(`Creation failed with error:${err?.message}`);
                    }
                });
            }
            else {
                showErrMsg(`Creation failed with error:${err?.message}`);
            }
        });
        const extensionRegisterInfos = <RegisterInfo[]>JSON.parse(readFileSync(join(this.rootPath, "extensions.json"), "utf-8"));
        extensionRegisterInfos.push(new RegisterInfo(this.pck, this.rootPath));
        writeFile(join(this.rootPath, "extensions.json"), JSON.stringify(extensionRegisterInfos), "utf8", err => {
            if (err) {
                showErrMsg(`Creation failed with error:${err?.message}`);
            }
            else {
                showInfoMsg("Extension pack successfully created!");
                if (cb) { cb();}
            }
        });
    }
    public get readme(): string {
        return this._readme;
    }
    public set readme(value: string) {
        this._readme = value;
    }

}

export class RegisterInfo {
    public identifier: { id: string; };
    private version: string = "1.0.0";
    private location: { $mid: number, path: string, scheme: string };
    public relativeLocation: string;
    private metadata: { installedTimestamp: number };

    constructor(pck: ExtensionPackage, path: string) {
        this.identifier = { id: pck.extensionID };
        this.location = {
            $mid: 1,
            path: "/" + join(path, pck.extensionDirName).replace(/\\/g, "/"),
            scheme: "file"
        };
        this.relativeLocation = pck.extensionDirName;
        this.metadata = pck.metadata;
    }

}
