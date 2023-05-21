import { createRouter, createWebHashHistory} from 'vue-router';

const router = createRouter({ // 区别1
	history: createWebHashHistory(process.env.BASE_URL),  // 区别2
	routes: [
        {
            path:'/',
            redirect:"/home"
        },
        {
            path:'/home',
            component:()=>import("../pages/HomePage.vue")
        },
        {
            path:'/update',
            name:'update',
            component:()=>import("../pages/UpdatePage.vue"),
        },
        {
            path:"/test",
            name:'test',
            component:()=>import("../pages/ColorTest.vue")
        }
    ]
});
export default router ;