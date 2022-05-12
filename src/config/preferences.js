import Vue from 'vue';
window.axios = require('axios');
import env from './env'

window.env = env;
Vue.prototype.$env = env;
// Vue.prototype.$storage_url = process.env['VUE_APP_STORAGE_URL'];

Math.UUID = function () {
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}

Math.getRandomColor = function() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}