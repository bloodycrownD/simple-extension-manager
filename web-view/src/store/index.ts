import { defineStore } from 'pinia'
import { Cmd, DataShape, Extension,Msg,vscode } from '../utils';

interface StateShape{
  extensionArray:Extension[]
}
export const extensionStore = defineStore('extensions', {
    state: ():StateShape => {
        return {
            extensionArray:[]
        };
      },
    actions:{
        getExtensions(){
          vscode.postMessage(new Msg(Cmd.getExtensions),(data:string)=>{
            const res = <DataShape>JSON.parse(data);
            this.extensionArray = <Extension[]>res.result;            
          })
        }
    }
})