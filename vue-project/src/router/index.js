// Requiring module 
import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Profile from '../views/Profile.vue'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    //  Added our new route file named profile.vue 
    {
        path: '/profile',
        name: 'Profile',
        Component: Profile

    },
    {
        path: '/about',
        name: 'About',
        // The route level code-splitting 
        // this generates a separate chunk  
        // (about.[hash].js) for this route 
        // which is lazy-loaded when the 
        // route is visited. 
        component: () => import(
            /* webpackChunkName: "about" */
            '../views/About.vue'
        )
    },
]

// Create Vue Router Object 
const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router