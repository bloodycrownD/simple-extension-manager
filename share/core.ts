//这里定义的对象都是实体对象，只有get/set方法，没有其他方法
/**
 * package.json的实体对象。
 * PackageJson属性全置为可空，用来处理不合法json的情况
 */
class PackageJson {
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
    //构造方法可以存在，构造方法只是用来生成对象的，对于json转的对象无意义
    constructor(displayName: string, extensionPack: string[],description?: string) {
        //会重名也无所谓，直接创建扩展失败，因为路径已存在
        this.name = displayName
            .replace(/[。~!@#$%\^\+\*&\\\/\?\|:\.<>{}()';="\s]/g, '-')
            .split('-') //去除多余的'-',只保留一个'-'
            .filter(x => x != '-')
            .join('-')
            .toLocaleLowerCase();
        this.publisher = 'user';
        this.version = '1.0.0';
        this.repository = {
            type: "git",
            url: "https://github.com/bloodycrownD/simple-extension-manager.git"
        };
        this.engines = { vscode: "*" };
        this.keywords = ["extension manager"];
        this.categories = [
            "Extension Packs",
            "Custom Extension"
        ];
        this.description = description || "a simple extension pack";
        this.extensionPack = extensionPack;
        this.icon = 'logo.png';
        this.displayName = displayName;
    }
}
/**
 * 用来更新package.json的部分属性
 */
interface MutablePackage {
    extensionPack?: string[];
    icon?: string;
    displayName?: string;
    description?: string;
}
/**
 * 扩展实体类
 */
class Extension {
    readonly packageJson: PackageJson;
    readonly extensionId: string;
    readonly image?: string; //base64格式的图片,带"data:image/png;base64,"
    readonly extensionPack?: Extension[]; //包含的扩展
    readonly customized?: boolean; //是否自定义扩展，是->true
    //认为packageJson的.publisher、name都是合法属性，不是空值以及undifine
    constructor(packageJson: PackageJson,image?:string) {
        this.packageJson = packageJson;
        this.extensionId = packageJson.publisher + '.' + packageJson.name;
        this.image = image;
        if (packageJson.categories?.includes("Extension Packs")) {
            this.extensionPack = [];
        };
        if (packageJson.keywords?.includes("Custom Extension")) {
            this.customized = true;
        }
    }
}
/**
 * 扩展的注册信息
 */
class ExtensionInfo {
    public readonly identifier: {
        readonly id: string;
    };
    public readonly version: string;
    public readonly location: {
        readonly path: string,
        readonly scheme: string
    };
    public readonly relativeLocation: string;
    /**
     * 
     * @param id 扩展id
     * @param relativeLocation 扩展文件夹名称
     * @param path 扩展文件夹绝对路径，linux格式，以'/'开头。例如'/c:/Users'
     */
    constructor(id: string, relativeLocation: string, path: string) {
        this.identifier = { id };
        this.relativeLocation = relativeLocation;
        this.location = {
            path,
            scheme: "file"
        };
        this.version = '1.0.0';
    }
}
type ExtensionsJson = ExtensionInfo[];
//Re-exporting a type when the '--isolatedModules' flag is provided requires using 'export type'
export { Extension, PackageJson,type MutablePackage, ExtensionInfo ,type ExtensionsJson };