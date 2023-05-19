export class ExtensionPackage {
    publisher: string = "Lorem" ;
    extensionPack: string[] =['Lorem.ipsum'] ;
    description: string = "Lorem ipsum dolor sit amet.";
    displayName: string = "Lorem ipsum dolor sit amet." ;
    name:string = "ipsum";
    keywords:string[]=['extension manager'];
    constructor(){}
}

export class Extension{
    pck:ExtensionPackage = new ExtensionPackage();
    img:string = "Lorem ipsum dolor sit amet.";
    dirName:string = "Lorem ipsum dolor sit amet.";
    imgUri:string = "Lorem ipsum dolor sit amet.";
    isClicked = false;
    height:number = 0;
    constructor(){}
}

class UnfoldAnimation{
    private timer:NodeJS.Timer|undefined;
    public speed:number = 0.3;
    private unitTime:number = 100;
    private close() {
        clearInterval(this.timer);
    }
    private extend(item:Extension,height:number){
        this.timer = setInterval(()=>{                        
            if (item.height >= height) {
                this.close();
            }
            item.height += 30;
        },this.unitTime)
    }

    private contract(item:Extension){
        this.timer = setInterval(()=>{
            if (item.height <= 0) {
                this.close();
            }
            item.height -= this.unitTime * this.speed;
        },this.unitTime)
    }

    public act(item:Extension,height:number){                
        if (this.timer) {
            this.close();
        }
        if (item.isClicked) {
            this.extend(item,height);
        }
        else{
            this.contract(item);
        }
    }
}

export const unfold =  new UnfoldAnimation();