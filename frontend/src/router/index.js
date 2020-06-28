import Vue from 'vue';
import VueRouter from 'vue-router';
import Landing from '../views/Landing.vue';
import Login from '../views/Login.vue';
import Pairs from '../views/Pairs.vue';
import TrainingSummary from '../views/TrainingSummary.vue';

// Load Vue Router
Vue.use(VueRouter);

const routes = [
    {
        path: '/',
        name: 'Landing',
        component: Landing
    },
    {
        path: '/login',
        name: 'Login',
        component: Login
    },
    {
        path: '/pairs',
        name: 'Pairs',
        component: Pairs
    },
    {
        path: '/summary',
        name: 'TrainingSummary',
        component: TrainingSummary
    },
];

// Create router
export default new VueRouter({ routes });
