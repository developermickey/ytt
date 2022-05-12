import axios from 'axios';

var env = {
    regexp: {
        NAME: /^[a-zA-Z ]{2,}$/,
        // eslint-disable-next-line no-useless-escape
        EMAIL: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        // eslint-disable-next-line no-useless-escape
        PHONE: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im,
        PASS: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[0-9a-zA-Z!@#$%^&*()]{6,}$/,
    },
};

env.API = axios.create({
    baseURL: process.env['VUE_APP_API_URL'],
    headers: {"Content-Type": "application/json"}
});

env.env = process.env;

export default env;
