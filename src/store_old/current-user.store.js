import { AuthAPI } from '@/api';
import cookie from 'js-cookie';

export default {
  namespaced: true,
  state: {
    data: {},
    loaded: false,
    logged: false,
  },
  mutations: {
    // FETCH_USER(state, token){
    //   state.
    // },
    auth(state, token) {
      state.logged = true;
      cookie.set('YTT_JWT', token, { expires: 1, secure: true });
      // localStorage.setItem('auth', token);
      // const auth = `Bearer ${token}`;
      // env.API.defaults.headers.common['Authorization'] = auth;
    },
    saveData(state, data) {
      state.data = data;
    },
    // eslint-disable-next-line no-unused-vars
    logout(state, data) {
      state.data = {};
      state.logged = false;
      // delete env.API.defaults.headers.common['Authorization'];
      // localStorage.removeItem('auth');
    },
    load(state) {
      state.loaded = true;
    },
  },
  actions: {
    fetchUser({ commit }){
      return AuthAPI.getCurrentUser()
        .then(res => commit('FETCH_USER', res.data))
        .catch(console.error)
    },
    updateData({ commit }) {
      return AuthAPI.getCurrentUser().then(res => {
        commit('saveData', res.data);
        return res.data;
      });
    },
  },
  getters: {
    // eslint-disable-next-line no-unused-vars
    token(state) {
      return localStorage.getItem('auth');
    },
    auth(state, getters) {
      if(getters.token) {
        return `Bearer ${getters.token}`;
      } else {
        return null;
      }
    },
    isLogged(state) {
      return state.logged;
    },
    isLoaded(state) {
      return state.loaded;
    },
    data(state) {
      return state.data;
    },
    // eslint-disable-next-line no-unused-vars
    rolePrefix(state){

    },
  },
}
