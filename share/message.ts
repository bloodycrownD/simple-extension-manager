export { Request, Response, getRandomKey };
function getRandomKey() {
    let text = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

/**
 * 请求格式
 */
class Request {
    /**
     * 请求消息的id
     */
    readonly requestId: string;
    /**
     * 数据
     */
    readonly data: any;
    /**
     * 命令，等同于网页中的url
     */
    readonly command: string;
    constructor(cmd: string, data: any) {
        this.requestId = getRandomKey();
        this.command = cmd;
        this.data = data;
    }
}

class Response {
    /**
     * 对应的请求消息的id
     */
    readonly requestId: string;
    /**
     * 数据
     */
    readonly data: any;
    constructor( data: any,requestId:string) {
        this.requestId = requestId;
        this.data = data;
    }
}