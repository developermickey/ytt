import axios from 'axios';
import ErrorHelper from "@/helpers/ErrorHelper";
import {ROLE_MAP} from "@/constants/roles";

export default {
    namespaced: true,
    state: {
        user: null,
        loading: false,
    },
    mutations: {
        SET_LOADING(state, loading){
            state.loading = loading;
        },
        SET_USER(state, user){
            state.user = user;
        },
    },
    actions: {
        create(context, user){

            context.commit('SET_LOADING', true);
            let url = `/admin/users/${ROLE_MAP[user.role]}s`;
            delete user.role;

            const formData = new FormData();
            for(let field in user){
                formData.append(field, user[field]);
            }

            return new Promise((resolve, reject) => {
                axios.post(url, formData)
                    .then(resolve)
                    .catch(err => reject(ErrorHelper.getErrorWithMessage(err)))
                    .then(() => context.commit('SET_LOADING', false))
            });
        },
        updateProfile(context, user){

            context.commit('SET_LOADING', true);

            const formData = new FormData();
            for(let field in user){
                formData.append(field, user[field]);
            }

            return new Promise((resolve, reject) => {
                axios.post('/profile', formData)
                    .then(response => {
                        context.commit('Auth/SET_USER', response.data, { root: true });
                        resolve();
                    })
                    .catch(err => reject(ErrorHelper.getErrorWithMessage(err)))
                    .then(() => context.commit('SET_LOADING', false))
            });
        },

        fetchUser({ commit }, { id }){

            commit('SET_LOADING', true);
            return new Promise((resolve, reject) => {
                axios.get(`/admin/users/${id}`)
                    .then(response => {
                        commit('SET_USER', response.data);
                        resolve();
                    })
                    .catch(err => reject(ErrorHelper.getErrorWithMessage(err)))
                    .then(() => commit('SET_LOADING', false))
            })

        },
        updateUser(context, {id, user}){

            context.commit('SET_LOADING', true);

            const formData = new FormData();
            for(let field in user){
                formData.append(field, user[field]);
            }

            return new Promise((resolve, reject) => {
                axios.post(`admin/users/${id}`, formData)
                    .then(response => {
                        context.commit('SET_USER', response.data);
                        resolve();
                    })
                    .catch(err => reject(ErrorHelper.getErrorWithMessage(err)))
                    .then(() => context.commit('SET_LOADING', false))
            });
        },
        deleteUser(context, { userId }){
            context.commit('SET_LOADING', true);
            return new Promise((resolve, reject) => {
                axios.delete(`/admin/users/${userId}`)
                    .then(resolve)
                    .catch(err => reject(ErrorHelper.getErrorWithMessage(err)))
                    .then(() => context.commit('DELETE_USER', userId))
                    .then(() => context.commit('SET_LOADING', false));
            });
        },
    },
    getters: {
        loading: state => state.loading,
        user: state => state.user,
    },
}
