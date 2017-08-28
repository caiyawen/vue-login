/**
 * Created by wubo on 2017/8/20.
 */
import 'babel-polyfill';
import Vue from 'vue';
import App from './app.vue';
import VueRouter from 'vue-router';
import routes from '../router';
import VueCookie from 'vue-cookie';
import Axios from 'axios';

Vue.prototype.$axios = Axios;

Vue.use(VueRouter);
Vue.use(VueCookie);
// Vue.use(Axios);

const router = new VueRouter({
    routes
})

router.beforeEach((to, from, next) => {
    var isLogin = Vue.cookie.get('username');
    var toPage = to.name;
    console.log(isLogin, toPage)
    if (!isLogin && toPage !== 'login') {
        next('/login');
        return;
    }
    next();
})

new Vue({
    el: '#app',
    router,
    render: h => h(App)
});