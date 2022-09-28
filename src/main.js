import Vue from "vue";
import App from "./App.vue";
import store from "./store";
import router from "./router";
import VueCookies from "vue-cookies";

Vue.config.productionTip = false;

Vue.use(VueCookies);

new Vue({
	store,
	router,
	render: (h) => h(App),
}).$mount("#app");
