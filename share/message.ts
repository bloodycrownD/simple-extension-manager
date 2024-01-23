export {Message };
/**
 * 通信协议
 */
class Message{
    /**
     * 回调函数id，只支持拉模式，即web端才有回调函数。
     */
    readonly callBackId: number;
    /**
     * 数据
     */
    readonly data: string;
    /**
     * 命令，等同于网页中的url
     */
    readonly cmd: string;
    constructor(cmd: string, data: string) {
        this.callBackId = Date.now();
        this.cmd = cmd;
        this.data = data;
    }
}