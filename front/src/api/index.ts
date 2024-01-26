import { Request } from "../share"
import { vscode } from "./vscode";
/**
 * 请求函数生成器
 * @param command 命令
 * @returns 请求函数
 */
export function reqFuncBuilder<P, R>(command: string) {
    return async (param?: P) => new Promise<R>((resolve, reject) => {
        //设置超时
        const timer = setTimeout(() => { reject("超时！") }, 500);
        vscode.postMessage(new Request(command, param), (res: R) => {
            console.log(`${command} success!`);
            //清除计时器
            clearTimeout(timer);
            resolve(res)
        });
    })
}