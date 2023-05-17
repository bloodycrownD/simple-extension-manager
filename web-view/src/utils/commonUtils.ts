export class ExtensionPackage {
    publisher: string ;
    extensionPack: string[] ;
    description: string ;
    displayName: string ;
    name:string;
    constructor(p:string,e:string[],d1:string,d2:string,n:string){
        this.publisher = p;
        this.extensionPack = e;
        this.description =d1;
        this.displayName = d2;
        this.name = n
    }
}

export class Extension{
    pck:ExtensionPackage;
    img:string;
    dirName:string;
    imgUri:string;
    constructor(p:ExtensionPackage,i1:string,d:string,i2:string){
        this.pck = p;
        this.img = i1;
        this.dirName = d;
        this.imgUri = i2;
    }
}