import Vue from 'vue';
import VueRouter from 'vue-router';
import Landing from '../views/Landing.vue';
import Login from '../views/Login.vue';
import TrainNow from '../views/TrainNow.vue';
import WorkoutSummary from '../views/WorkoutSummary.vue';
import MyAccount from '../views/MyAccount.vue';

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
        path: '/train',
        name: 'TrainNow',
        component: TrainNow
    },
    {
        path: '/summary',
        name: 'WorkoutSummary',
        component: WorkoutSummary
    },
    {
        path: '/account',
        name: 'MyAccount',
        component: MyAccount
    },
];

// Create router
export default new VueRouter({ routes });
