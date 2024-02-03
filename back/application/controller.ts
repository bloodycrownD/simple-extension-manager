import { Webview } from "vscode";
import { Dict, Extension, Request, Response } from "../share";
import { extensionService } from "../service";
export function dispatcher(webView: Webview) {
    /**
     * controller函数注册器
     */
    const functionList: Dict<Function> = {};
    /**
     * Mapping注解,将controller中的函数放到functionList
     * @param command 注册命令
     * @returns 
     */
    function Mapping(command: string) {
        return function (_: any, propertyKey: string, descriptor: PropertyDescriptor) {
            const origin = descriptor.value;
            //改写原函数
            const target = (param: any, message: Request) => {
                const result = origin(param);
                //处理异步函数
                if (result instanceof Promise) {
                    result.then(v => webView.postMessage(new Response(v, message.requestId)));
                    return;
                }
                webView.postMessage(new Response(result, message.requestId));
            };
            functionList[command] = target;
        };
    }
    /**
     * 控制器，必须提前声明，getMapping会在声明时就执行
     */
    class Controller {
        //测试函数
        @Mapping("test")
        async test():Promise<void> {
            console.log("---");
            
            return ;
        }
        @Mapping("/get/extensions")
        async getExtensions() {
            return extensionService.getExtensions(webView);
        }
        @Mapping("/delete/extension")
        async deleteExtension(extensionId: string) {
            await extensionService.deleteExtension(extensionId);
        }
        @Mapping("/put/extension")
        async createExtension(extension: Extension) {
            await extensionService.createExtension(extension);
        }
        @Mapping("/update/extension")
        async updateExtension(extension: Extension){
            await extensionService.updateExtension(extension);
        }
    }
    //返回分发器
    return function dispatch(msg: Request) {
        functionList[msg.command](msg.data, msg);
    }
}