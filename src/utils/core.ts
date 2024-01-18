import { ExtensionPackage } from "./extensionPackage";
import { existsSync, readFileSync } from "fs";
import { join } from "path";
import { showErrMsg, showInfoMsg } from "./commonUtil";
import { State } from "./commonUtil";
import { emptyDirPromise, existPromise, mkdirPromise, readFilePromise, writeFilePromise } from "./promiseUtils";

const defaultREADME = '';
const defaultImg =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHgAAAB4CAMAAAAOusbgAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAATlBMVEUAAADx8vLx8vLx8vLx8vLx8vLx8vLx8vLx8vLx8vLx8vLx8vLx8vLx8vLx8vLx8vLx8vLe39/o6enj5OTY2dnl5uba29vr7Ozv8PD///+VH9SVAAAAEHRSTlMAQHCAv+8gYJ/fz1CPMBCv0SKY+gAAAAFiS0dEGexutYgAAAAHdElNRQfiCwYULSNcgV7VAAACjElEQVRo3u2b247iMAyGU1L3EEJxmWFm3/9J92IX1KKmcWo7Hmn4LxHSp1SxHZ+cK1Vz8m0L+BS0rT81TlVdP4yYUBj6Tod6jknoQ2M8S1MvEZAkiBc56tQHLFDoJxmsBywU+MkCK4I+hv2HZmCbERkajxr3dEWmroe+9xmQLSi36ymiiGLhobuAQgpFjrQBFBMU3LEeRdWTjReFRTTpAcU1GHFJZBUugexRSb7qfSbf7QYVtWPPHWiCIenDpoCqCim/HVFZMREHUV2bUXICfTBsfewrVtC1siXt2VTqXTendEPEj3lHH5svQLKr/Ezpjojz545miutM3yxp8Mv9SscGafD6yDumJA5eHXknGIqDl0fe8x3y4MWR96KwPHgRmQMbvLTfrxw4POsMyAavXE4OjBdKONQAP8Ij1AYDJQ5rgP/H5UgGz6QARADH3bikCB6dc67D+mDs8m94HXCfT5Zewd/J21YCHjJuSw0cnHNoAcb8I08J3LiTKJh8FU/ZhFgJ7F1rA27twGADhpw1aYHxDWaCs0mbFpiuN5gJvi90e5vTGmzmMn9fdDJ7CJg9fRobcFP8vP3znVIROJuzFaYw1H+H8hRG5t+DdNJG/XdflqZ+bVVwb8sfqOCuLDHfLEfci+tcj+JxrA+OnOILB3zmlJsYYGAV2BjgyCopMsAXVhH1ODjwysbHwT2vUH4YvOwN+Jpgz2yGHAWv+z++HthXb6VuN1R9LbCnNjWFNf6cNq5Z49quVW82nGA3jmE3gGI2cmM3ZGQ3VmU3SGY3Omc3LGg3Hmk3EGo3Ams39Gs35mw32G03ym44vG+3rmC4oGG4kmK3hGO4dmS4aGW5WvZcpkt+dL1lOuH1wb8Dn/C3GCuwnwAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAxOC0xMS0wNlQyMDo0NTozNSswMDowMEkH/xoAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMTgtMTEtMDZUMjA6NDU6MzUrMDA6MDA4WkemAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAABJRU5ErkJggg==";


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
        if(dirName){
            this.dirName = dirName;
            if (pck.icon&& existsSync(join(rootPath, dirName, pck.icon))) {                
                this.img = "data:image/png;base64," + readFileSync(join(rootPath, dirName, pck.icon)).toString("base64");
            }
        }
    }

    public static copy(src:Extension,rootPath: string, dirName?: string):Extension{
        const res = new Extension(ExtensionPackage.copy(src.pck),rootPath,dirName);
        res.img = src.img.replace(/data:.*?;base64,/g, '');        
        return res; 
    }
    /**
     * 
     * @param path extensionDirPath
     * @returns if extension exists,then return Extension,otherwise return undefined
     */
    public static readFromFile(rootPath: string, dirName: string): Extension | undefined {
        if (!rootPath || !dirName) {
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
    public static async deleteExtension(path: string, pck: ExtensionPackage) {
        //only use for pck from webview
        function extensionId(pck: ExtensionPackage): string {
            return pck.publisher + "." + pck.name;
        }
        const content = await readFilePromise(join(State.rootPath, "extensions.json"), "utf-8");
        const extensionRegisterInfos = <RegisterInfo[]>JSON.parse(content);
        const isExists = extensionRegisterInfos.find(e => e.identifier.id === extensionId(pck));
        if (isExists) {
            emptyDirPromise(join(path, isExists.relativeLocation));
            writeFilePromise(
                join(path, "extensions.json"),
                JSON.stringify(extensionRegisterInfos.filter(e => e.identifier.id !== extensionId(pck))),
                "utf8");
            showInfoMsg(`Pack successfully removed!`);
            return;
        }
        showErrMsg(`${extensionId(pck)} has been deleted`);
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
export async function bulkCreate(newExtensionPcks: Extension[]) {
    try {
        const tasks: Promise<void>[] = [];
        const content = await readFilePromise(join(State.rootPath, "extensions.json"), "utf-8");
        const extensionRegisterInfos = <RegisterInfo[]>JSON.parse(content);
        for (const newExtensionPck of newExtensionPcks) {
            const finalExtension = new Extension(ExtensionPackage.copy(newExtensionPck.pck), State.rootPath);
            finalExtension.img = newExtensionPck.img.replace(/data:.*?;base64,/g, '');
            if (!extensionRegisterInfos.find(e => e.identifier.id === finalExtension.pck.extensionID)) {
                tasks.push(createExtension(finalExtension));
                extensionRegisterInfos.push(new RegisterInfo(finalExtension.pck, State.rootPath));
            }
        }
        await writeFilePromise(join(State.rootPath, "extensions.json"), JSON.stringify(extensionRegisterInfos), "utf8");
        await Promise.all(tasks);
    } catch (error) {
        console.log("1:", error);
    }
}
export async function createExtension(finalExtension: Extension) {
    try {
        const dirPath = join(State.rootPath, finalExtension.pck.extensionDirName);
        const isExists = await existPromise(dirPath);
        if (isExists) { await emptyDirPromise(dirPath); }
        await mkdirPromise(dirPath);
        writeFilePromise(join(dirPath, "package.json"), finalExtension.pck.toString(), "utf8");
        writeFilePromise(join(dirPath, "logo.png"), Buffer.from(finalExtension.img, "base64"));
        writeFilePromise(join(dirPath, "README.md"), finalExtension.readme, "utf8");
    } catch (error) {
        console.log("2:", error);

    }
}