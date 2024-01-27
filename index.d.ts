declare class PackageJson {
    public readonly name: string;
    public readonly publisher: string;
    public readonly version?: string;
    public readonly repository?: {
        readonly type: string,
        readonly url: string
    };
    public readonly engines?: {
        readonly vscode: string
    };
    public readonly keywords?: string[];
    public readonly categories?: string[];
    public readonly description?: string;
    public readonly extensionPack?: string[];
    public readonly icon?: string;
    public readonly displayName?: string;
    constructor(displayName: string, extensionPack: string[],description?: string);
}