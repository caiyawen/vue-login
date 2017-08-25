/**
 * Created by wubo on 2017/8/20.
 */
import 'babel-polyfill';
import Vue from 'vue';
import App from './app.vue';
import VueRouter from 'vue-router';

import User from './User.vue';
import Activity from './Activity.vue';
import A from './A.vue';

Vue.use(VueRouter);

const router = new VueRouter({
    routes: [{
        path: '/user',
        component: User,
        name: 'user',
        children: [{
                path: 'detail',
                component: Activity,
                beforeEnter: function(to, from, next) {
                    alert(123);
                    console.log(to);
                }
            },
            {
                path: 'info/:id',
                name: 'info',
                components: {
                    default: Activity,
                    'a': A,
                }
            }
        ]
    }]
})

new Vue({
    router,
    render: h => h(App)
}).$mount('#app');