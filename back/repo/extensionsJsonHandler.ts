import { ExtensionInfo, ExtensionsJson } from "../share";
import { join } from "path";
import { Global, showUnCheckedErrMsg } from "../util";
import { readFile, writeFile } from "fs/promises";
class ExtensionsJsonHandler {
    /**
     * 读取extensions.Json
     * @returns 
     */
    public async readExtensionsJson(): Promise<ExtensionsJson> {
        try {
            const strs = await readFile(join(Global.RootPath, "extensions.json"), 'utf-8');
            return <ExtensionsJson>JSON.parse(strs);
        } catch (e: any) {                     
            await showUnCheckedErrMsg((e as Error));
            throw e;
        }
    }
    /**
     * 全量更新extensions.Json
     * @param extensionInfoList 
     */
    public async writeExtensionsJson(extensionsJson:ExtensionsJson){
        await writeFile(join(Global.RootPath, "extensions.json"), JSON.stringify(extensionsJson),'utf-8');
    }

}

export const extensionsJsonHandler = new ExtensionsJsonHandler();