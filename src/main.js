import Vue from 'vue'
import SvgSprite from 'vue-svg-sprite';
import VModal from 'vue-js-modal';
import AlertPlugin from '@/lib/AlertPlugin';
import App from './App.vue';
import '@/styles/app.scss';
import router from './router';
import store from './store';
import axios from 'axios';
import { extend, ValidationProvider, ValidationObserver } from 'vee-validate';
import * as rules from 'vee-validate/dist/rules';
import cookie from 'js-cookie';
import Notifications from 'vue-notification';
import vuescroll from 'vuescroll';
import VuePapaParse from 'vue-papa-parse';

axios.defaults.baseURL = process.env.VUE_APP_API_URL;
console.log(process.env.VUE_APP_API_URL)
axios.defaults.headers.common['Content-Type'] = 'application/json';

axios.interceptors.request.use(config => {
  const token = cookie.get('YTT_JWT');
  
  if(token)
    config.headers.Authorization = `Bearer ${token}`;
  
  return config;
});

axios.interceptors.response.use(
  null,
  error => {
  if(error.response.status === 401
    && error.response.data.message === 'Unauthenticated.'
    && error.response.config.url.split('/').reverse()[0] !== 'logout')
    store.dispatch('Auth/logout');
  
  return Promise.reject(error);
});


import UBtn from "@/components/common/UBtn";

Vue.use(SvgSprite, {
  url: '/sprite.svg',
});

Vue.use(VModal, {
  dynamicDefaults: {
    height: 'auto',
    classes: 'u-modal',
    width: '1140',
  }
});
Vue.use(AlertPlugin);
Vue.use(Notifications);
Vue.use(vuescroll, {
  ops: {
    scrollPanel: {
      scrollingX: false,
    },
    rail: {
      background: 'rgba(0,0,0,.1)',
      opacity: 1,
      size: '1px',
      specifyBorderRadius: 0,
      gutterOfEnds: null,
      gutterOfSide: '2px',
    },
    bar: {
      background: '#2C4CC1',
      keepShow: true,
      size: '3px',
      specifyBorderRadius: 0,
    },
  }
});

Vue.use(VuePapaParse);

Vue.component('ValidationProvider', ValidationProvider);
Vue.component('ValidationObserver', ValidationObserver);
Vue.component('UBtn', UBtn);

import validateRules from "@/config/validateRules";
validateRules();

Vue.config.productionTip = false

Object.keys(rules).forEach(rule => {
  extend(rule, rules[rule]);
});

window.app = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
