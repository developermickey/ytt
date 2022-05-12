import AuthView from '@/views/auth/AuthView';
import AuthLogin from '@/views/auth/AuthLogin';
import AuthRegister from '@/views/auth/AuthRegister';
import AuthResetPassword from '@/views/auth/AuthResetPassword';
import AuthInvite from '@/views/auth/AuthInvite';

import routesExtendMeta from '@/router/routesExtendMeta';

const auth = {
	path: '/auth',
	component: AuthView,
	name: 'auth',
	meta: {
		forUnauthorized: true
	},
	children: [
		{
			path: 'login',
			component: AuthLogin,
			name: 'auth-login'
		},
		{
			path: 'register',
			component: AuthRegister,
			name: 'auth-register',
		},
		{
			path: 'reset-password/:token',
			component: AuthResetPassword,
			name: 'auth-reset-password',
		},
		{
			path: 'invites/:token',
			component: AuthInvite,
			name: 'auth-invite'
		},
	]
};

export default routesExtendMeta(auth);


