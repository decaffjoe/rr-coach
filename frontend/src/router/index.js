import Vue from 'vue';
import VueRouter from 'vue-router';
import Landing from '../views/Landing.vue';
import Pairs from '../views/Pairs.vue';

// Load Vue Router
Vue.use(VueRouter);

const routes = [
    {
        path: '/',
        name: 'Landing',
        component: Landing
    },
    {
        path: '/pairs',
        name: 'Pairs',
        component: Pairs
    },
];

// Create router
export default new VueRouter({ routes });
