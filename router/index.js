import Login from '../src/Login.vue';
import Room from '../src/Room.vue';

const routes = [{
    path: '/login',
    component: Login,
    name: 'login',
}, {
    path: '/room',
    component: Room,
    name: 'room',
}];

export default routes;