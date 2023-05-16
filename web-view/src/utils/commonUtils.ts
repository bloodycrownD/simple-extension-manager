export interface ExtensionPackage {
    publisher: string,
    extensionPack: string[],
    description: string,
    displayName: string,
    name:string
}

export interface Extension{
    pck:ExtensionPackage;
    img:string;
    dirName:string;
    imgUri:string;
}