import Vue from 'vue';
import VueRouter from 'vue-router';

import { AuthApi } from '@/api';
import store from '@/store';

Vue.use(VueRouter);

import admin from './admin/admin.router';
import teacher from './teacher/teacher.router';
import auth from './auth.router';
import Index from '@/views/Index';


const routes = [
	{
		path: '/',
		component: Index,
		name: 'index',
		redirect: { name: 'auth-login'}
	},
	auth,
	admin,
	teacher,
];

const router = new VueRouter({
	// mode: 'history',
	routes,
});


router.beforeEach(async (to, from, next) => {

  window.scrollTo(0, 0);

  if(!store.getters['CurrentUser/isLoaded']) {
    if(store.getters['CurrentUser/token']) {
      await AuthApi.getCurrentUser(store.getters['CurrentUser/token']).then(res => {
        store.commit('CurrentUser/auth', store.getters['CurrentUser/token']);
        store.commit('CurrentUser/saveData', res.data);

          // eslint-disable-next-line no-unused-vars
      }).catch(err => {
        console.error('Wrong auth token!');
      });
    }
    store.commit('CurrentUser/load');
  }

  next();
});


export default router;

