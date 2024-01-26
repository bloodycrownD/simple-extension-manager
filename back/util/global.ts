import { ExtensionContext } from "vscode";

export class Global{
    /**
     * 扩展所在跟目录路径
     */
    static RootPath:string;
    /**
     * 扩展上下文
     */
    static Context: ExtensionContext;
}