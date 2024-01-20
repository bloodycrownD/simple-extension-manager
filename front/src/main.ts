import { createApp } from 'vue'
import 'vite/modulepreload-polyfill'
import App from './App.vue'
import {util} from "./shared";
createApp(App).mount('#app');
console.log(util());;
