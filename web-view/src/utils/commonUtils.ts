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
    constructor(){}
}