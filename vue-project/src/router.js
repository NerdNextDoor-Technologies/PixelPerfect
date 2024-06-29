import { createRouter, createWebHistory } from 'vue-router';
import HelloWorld from './components/HelloWorld.vue';
import HelloEarth from './components/HelloEarth.vue';
import LandingPage from './components/LandingPage.vue';

const routes = [
    { path: '/', component: LandingPage, name: 'landing-page' },
    { path: '/hello-world', component: HelloWorld, name: 'hello-world' },
    { path: '/hello-earth', component: HelloEarth, name: 'hello-earth' }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;
