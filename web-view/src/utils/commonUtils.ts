export class ExtensionPackage {
    publisher: string = "Lorem ipsum dolor sit amet." ;
    extensionPack: string[] =['Lorem', 'ipsum', 'dolor', 'sit', 'amet'] ;
    description: string = "Lorem ipsum dolor sit amet.";
    displayName: string = "Lorem ipsum dolor sit amet." ;
    name:string = "Lorem ipsum dolor sit amet.";
    keywords:string[]=['extension manager'];
    constructor(){}
}

export class Extension{
    pck:ExtensionPackage = new ExtensionPackage();
    img:string = "Lorem ipsum dolor sit amet.";
    dirName:string = "Lorem ipsum dolor sit amet.";
    imgUri:string = "Lorem ipsum dolor sit amet.";
    constructor(){}
}