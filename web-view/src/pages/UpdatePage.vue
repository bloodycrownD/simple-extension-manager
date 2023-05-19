<script setup lang="ts">
import { ref, Ref } from "vue";

const items: Ref = ref([])

for (let index = 0; index < 10; index++) {
    items.value.push(index)
}
const show = ref(0);
let time:NodeJS.Timer;
const clik = ref(false);
function test() {
    clik.value = !clik.value;
    if(time){
        clearInterval(time);
    }
    if(clik.value){
        extend()
    }
    else{
        contract();
    }
}

function extend(){
    time = setInterval(()=>{
        if(show.value >= 600){
            clearInterval(time)
        }
        show.value += 3;
    },5)
}
function contract(){
    time = setInterval(()=>{
        if(show.value <= 0){
            clearInterval(time)
        }
        show.value -= 3;
    },5)
}
</script>


<template>
    <button @click="test">compont</button>
    <div class="box" :style="{height:show + 'px'}">
        <li v-for="item in items" :key="item">
            {{ item }}
        </li>
    </div>
</template>


<style scoped lang="less">
.box {
    position: absolute;
    width: 204px;
    margin: 0;
    padding: 0;
    list-style-type: none;
    overflow: hidden;
    li {
        padding: 10px;
        box-sizing: border-box;
        height: 60px;
        background: white;
        border-bottom: solid thin #eee;
        border-left: solid medium #cbc;
    }
}
</style>
