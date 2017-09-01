import Login from '../src/Login.vue';
import Room from '../src/Room.vue';
import Group from '../src/Group.vue';
import Private from '../src/Private.vue';

const routes = [{
    path: '/login',
    component: Login,
    name: 'login',
}, {
    path: '/room',
    component: Room,
    name: 'room',
    childen: [{
        path: 'group',
        component: Group,
        name: 'group',
    }, {
        path: 'private/:nameId',
        component: Private,
        name: 'private',
    }]
}];

export default routes;