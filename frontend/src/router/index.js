import Vue from 'vue';
import VueRouter from 'vue-router';
import Landing from '../views/Landing.vue';

// Load Vue Router
Vue.use(VueRouter);

const routes = [
    {
        path: '/',
        name: 'Landing',
        component: Landing
    }
];

// Create router
export default new VueRouter({ routes });
