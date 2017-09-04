import Login from '../src/Login.vue';
import Room from '../src/Room.vue';
import Group from '../src/Group.vue';
import Player from '../src/Player.vue';

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
    }],
}, {
    path: '/player/:id',
    component: Player,
    name: 'player',
}];

export default routes;