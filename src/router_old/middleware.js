import store from '@/store';

export default {
  isLogged(to, from, next) {
    if(store.getters['CurrentUser/isLogged']) {
      next();
    } else {
      next({ name: 'auth-login' });
    }
  },
}