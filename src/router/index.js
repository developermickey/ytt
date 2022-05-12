
import Vue from 'vue';
import VueRouter from 'vue-router';

import store from '@/store';

Vue.use(VueRouter);

import routes from './routes';



const router = new VueRouter({ routes });


router.beforeEach(async (to, from, next) => {
	const { auth, roleAccess, forUnauthorized } = to.meta;
	store.commit('Application/setSidebarStatus', false)
	let user;
	const userFetched = store.getters['Auth/userFetched']

	if(!userFetched)
		await store.dispatch('Auth/fetchUser');

	user = store.getters['Auth/user']

	if(user && forUnauthorized)
		return await store.dispatch('Auth/navigateToStartPage');

	if(!auth)
		return next();

	if(!user)
		return next({ name: 'auth-login' });

	const access = roleAccess ? Array.isArray(roleAccess) ? roleAccess : [roleAccess] : []

	if(!access.includes(user.role_id))
		return next(from);

	return next();
});


export default router;

