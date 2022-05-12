import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

import Application from "@/store/application.store";
// import CurrentUser from '@/store/current-user.store';
import Auth from "@/store/auth";
// import WindowWidth from '@/store/window-width.store';
import Lessons from "@/store/lessons";
import Users from "@/store/users";
import Students from "@/store/students";
import Teachers from "@/store/teachers";
import School from "@/store/School";
import Words from "@/store/words";
import Coins from "@/store/coins";
import Products from "@/store/products";

export default new Vuex.Store({
  state: {
    loading: false,
  },
  mutations: {
    SET_LOADING(state, payload) {
      state.loading = payload;
    },
  },
  actions: {},
  getters: {
    loading: (state, getters) =>
      state.loading || getters["Auth/userIsFetching"],
  },
  modules: {
    Application,
    Auth,
    Lessons,
    Users,
    Students,
    Teachers,
    Words,
    Coins,
    Products,
    School,
  },
});
