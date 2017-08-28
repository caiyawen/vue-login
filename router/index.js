import User from '../src/User.vue';
import Activity from '../src/Activity.vue';
import A from '../src/A.vue';
import Login from '../src/Login.vue';

const routes = [{
    path: '/login',
    component: Login,
    name: 'login',
}, {
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
}];

export default routes;