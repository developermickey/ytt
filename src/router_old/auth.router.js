// eslint-disable-next-line no-unused-vars
import multiguard from 'vue-router-multiguard';
// eslint-disable-next-line no-unused-vars
import middleware from './middleware';

import AuthView from '@/views/auth/AuthView.vue';
import AuthLogin from '@/views/auth/AuthLogin.vue';
import AuthRegister from '@/views/auth/AuthRegister.vue';

export default {
  path: '/auth',
  component: AuthView,
  name: 'auth',
  children: [
    {
      path: 'login',
      component: AuthLogin,
      name: 'auth-login',
    },
    {
      path: 'register',
      component: AuthRegister,
      name: 'auth-register',
    },
  ]
}
