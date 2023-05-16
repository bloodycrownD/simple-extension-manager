export interface ExtensionPackage {
    publisher: string,
    extensionPack: string[],
    description: string,
    displayName: string
}

export interface Extension{
    pck:ExtensionPackage;
    img:string;
    originExtensionDirPath:string;
    imgUri:string;
}