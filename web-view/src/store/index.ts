import { defineStore } from 'pinia'
import { Extension } from '../utils';

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
        
    }
})