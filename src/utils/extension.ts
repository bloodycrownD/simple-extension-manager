import { ExtensionPackage } from "./extensionPackage";
import { mkdir, existsSync, readdirSync, statSync, unlinkSync, rmdirSync, readFileSync, writeSync, write, writeFile, mkdirSync } from "fs";
import { join } from "path";
import { showErrMsg, showInfoMsg } from "./commonUtil";
import { Uri } from "vscode";

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
            // console.log(`删除${file}文件成功`);
        }
    });
    rmdirSync(path);
}

export default class Extension {
    public pck: ExtensionPackage;
    private _img: string = defaultImg;
    private _readme: string = defaultREADME;
    private dirName: string;
    public imgUri: string;


    constructor(pck: ExtensionPackage,rootPath:string, dirName: string) {
        this.pck = pck;
        this.dirName = dirName;
        if (existsSync(join(rootPath, dirName,pck.icon))) {
            this.imgUri = Uri.file(join(rootPath, dirName,pck.icon)).toString();            
        }
        else{
            this.imgUri = '';
        }
    }

    /**
     * 
     * @param path extensionDirPath
     * @returns if extension exists,then return Extension,otherwise return undefined
     */
    public static readFromFile(rootPath: string,dirName:string): Extension | undefined {
        const tmpPck = ExtensionPackage.readFromFile(rootPath,dirName);
        if (tmpPck) {
            const tmpExtension = new Extension(tmpPck, rootPath,dirName);                        
            return tmpExtension;
        }
        showErrMsg(`${join(rootPath,dirName)} does not exists!`);
        return undefined;
    }

    /**
     * 
     * @param path root path
     * @param pck extensionPackage
     */
    public static deleteExtension(path: string, pck: ExtensionPackage) {
        const extensionRegisterInfos = <RegisterInfo[]>JSON.parse(readFileSync(join(path, "extensions.json"), "utf-8"));
        emptyDir(join(path, extensionRegisterInfos.filter(e => e.identifier.id === pck.extensionID)[0].relativeLocation));
        writeFile(join(path, "extensions.json"),
            JSON.stringify(extensionRegisterInfos.filter(e => e.identifier.id !== pck.extensionID)),
            "utf8",
            err => {
                if (err) {
                    showErrMsg(`delete failed:${err.message}`);
                }
                else {
                    showInfoMsg(`delete successfully!`);
                }
            });
    }

    /**
     * 
     * @param path root path
     */
    public createExtension(path: string) {
        const dirPath = join(path, this.pck.extensionDirName);
        if (existsSync(dirPath)) { emptyDir(dirPath); }
        mkdir(dirPath, err => {
            if (!err) {
                writeFile(join(dirPath, "package.json"), this.pck.toString(), "utf8", err => {
                    if (err) {
                        showErrMsg(`create failed:${err?.message}`);
                    }
                });
                writeFile(join(dirPath, "logo.png"), Buffer.from(this.img,"base64"), err => {
                    if (err) {
                        showErrMsg(`create failed:${err?.message}`);
                    }
                });
                writeFile(join(dirPath, "README.md"), this.readme, "utf8", err => {
                    if (err) {
                        showErrMsg(`create failed:${err?.message}`);
                    }
                });
            }
            else {
                showErrMsg(`create failed:${err?.message}`);
            }
        });
        const extensionRegisterInfos = <RegisterInfo[]>JSON.parse(readFileSync(join(path, "extensions.json"), "utf-8"));
        extensionRegisterInfos.push(new RegisterInfo(this.pck, path));
        writeFile(join(path, "extensions.json"), JSON.stringify(extensionRegisterInfos), "utf8", err => {
            if (err) {
                showErrMsg(`create failed:${err?.message}`);
            }
            else {
                showInfoMsg("create extension pack successfully!");
            }
        });
    }
    public get readme(): string {
        return this._readme;
    }
    public set readme(value: string) {
        this._readme = value;
    }
    public get img(): string {
        return this._img;
    }
    public set img(value: string) {
        this._img = value;
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
