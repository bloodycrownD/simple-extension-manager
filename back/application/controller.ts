import { Webview } from "vscode";
import { Dict, Request, Response } from "../share";
import { extensionHandler } from "../repo";
export function dispatcher(webView: Webview) {
    /**
     * controller函数注册器
     */
    const functionList: Dict<Function> = {};
    /**
     * getMapping注解
     * @param command 注册命令
     * @returns 
     */
    function getMapping(command: string) {
        return function (_: any, propertyKey: string, descriptor: PropertyDescriptor) {
            const origin = descriptor.value;
            //改写原函数
            const target = (param: any, message: Request) => {
                const result = origin(param);
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
        @getMapping("test")
        test() {
            return extensionHandler.readExtensions();
        }
    }
    //返回分发器
    return function dispatch(msg: Request) {
        functionList[msg.command](msg.data, msg);
    }
}