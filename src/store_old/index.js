import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

import Application from '@/store/application.store';
import CurrentUser from '@/store/current-user.store';
// import WindowWidth from '@/store/window-width.store';

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    Application,
    CurrentUser,
  }
})
