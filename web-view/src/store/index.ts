import { defineStore } from 'pinia';
import { Cmd, Extension, Msg, vscode ,extensionsPostResolver} from '../utils';

interface StateShape {
  extensionArray: Extension[],
  updatePage: {
    currentExtension:Extension,
    extensionPack: Extension[],
    extensionList:Extension[],
    isUpdate: boolean
  }
}
export const extensionStore = defineStore('extensions', {
  state: (): StateShape => {
    return {
      extensionArray: [],
      updatePage: {
        currentExtension:new Extension(),
        extensionPack: [],
        extensionList:[],
        isUpdate: false
      }
    };
  },
  actions: {
    getExtensions(cb?:Function) {
      //GLOBAL_EXTENSION_ID为undefined表示不需要进度条
      vscode.postMessage(new Msg(Cmd.getExtensions,GLOBAL_EXTENSION_ID), (data: string) => {
        this.extensionArray = <Extension[]>JSON.parse(data);
        !cb||cb();
      });
    },
    getExtensionInPack(pack: string[]) {
      return this.extensionArray.filter(f => pack.includes(f.pck.publisher + '.' + f.pck.name));
    }
  },
  getters: {
    //change
    customExtensionPack(): Extension[] {
      const arr = this.extensionArray.filter(element => element.pck.keywords?.includes("extension manager"));
      extensionsPostResolver(arr);
      return arr;
    },
    currentDisplayName():string{
      return this.updatePage.currentExtension.pck.displayName;
    },
    currentDiscription():string{
      return this.updatePage.currentExtension.pck.description;
    },
    currentImg():string{
      return this.updatePage.currentExtension.img;
    }
  }
  
});