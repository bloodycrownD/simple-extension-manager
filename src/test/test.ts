class callBackArray {
    private static callBacks: Map<string, Function> = new Map();

    public static setCallBack(index: string, cb: Function) {
        this.callBacks.set(index,cb);
    }

    public static getCallBack(index: string,data?:any): any {
        const cb = this.callBacks.get(index);
        this.callBacks.delete(index);
        return <Function>cb!(data);
    }

}


callBackArray.setCallBack("4",()=>{
    console.log("test");
})

callBackArray.getCallBack("4");
