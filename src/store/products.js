import axios from 'axios';
import ErrorHelper from "@/helpers/ErrorHelper";
import { ROLE_MAP } from '@/constants/roles';

export default {
    namespaced: true,
    state: {
        loading: false,
        products: {},
    },
    mutations: {
        SET_PRODUCTS(state, payload){
            state.products = payload;
        },
        RESET_PRODUCTS_LIST(state){
            state.products = [];
        }
    },
    actions: {
        createProduct(context, product){
            this.commit('SET_LOADING', true)

            const formData = new FormData();
            for(let field in product)
                formData.append(field, product[field]);

            return new Promise((resolve, reject) => {
                axios.post(`products`, formData)
                  .then(this.fetchProducts)
                  .then(resolve)
                  .catch(err => reject(ErrorHelper.getErrorWithMessage(err)))
                  .then(() => this.commit('SET_LOADING', false))
            });
        },
        deleteProduct(context, productId){
            this.commit('SET_LOADING', true)

            return new Promise((resolve, reject) => {
                axios.delete(`products/${productId}`)
                  .then(resolve)
                  .catch(err => reject(ErrorHelper.getErrorWithMessage(err)))
                  .then(() => this.commit('SET_LOADING', false))
            });
        },
        fetchProducts(context){

            this.commit('SET_LOADING', true)

            const role = ROLE_MAP[this.getters['Auth/user'].role_id];

            return new Promise((resolve, reject) => {
               axios.get(`/${role === 'admin' ? '' : `${role}/`}products`)
                   .then(res => context.commit('SET_PRODUCTS', res.data))
                   .then(resolve)
                   .catch(err => reject(ErrorHelper.getErrorWithMessage(err)))
                   .then(() => this.commit('SET_LOADING', false))
            });
        },
        purchaseProduct(context, productId){

            this.commit('SET_LOADING', true)

            return new Promise((resolve, reject) => {
                axios.post(`/products/${productId}/purchase`, )
                  .then(resolve)
                  .catch(err => reject(ErrorHelper.getErrorWithMessage(err)))
                  .then(() => this.commit('SET_LOADING', false))
            });
        },
    },
    getters: {
        products: (state) => state.products,
        loading: (state) => state.loading,
    }
}
