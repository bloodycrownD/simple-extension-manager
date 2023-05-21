import { defineStore } from 'pinia';
import { Cmd, Extension, Msg, vscode } from '../utils';

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
    getExtensions() {
      vscode.postMessage(new Msg(Cmd.getExtensions), (data: string) => {
        this.extensionArray = <Extension[]>JSON.parse(data);
        this.updatePage.extensionList = <Extension[]>JSON.parse(data);
      });
    },
    getExtensionInPack(pack: string[]) {
      return this.extensionArray.filter(f => pack.includes(f.pck.publisher + '.' + f.pck.name));
    }
  },
  getters: {
    customExtensionPack(): Extension[] {
      return this.extensionArray.filter(f => f.pck.keywords?.length && f.pck.keywords[0] === "extension manager");
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