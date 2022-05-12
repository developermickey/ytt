import axios from 'axios';
import ErrorHelper from "@/helpers/ErrorHelper";
import { ROLE_MAP } from '@/constants/roles';

export default {
    namespaced: true,
    state: {
        loading: false,
        student: {}
    },
    mutations: {
        SET_STUDENT(state, payload) {
            state.student = payload;
        }
    },
    actions: {
        chargeCoins(context, data) {
            this.commit('SET_LOADING', true)

            const role = ROLE_MAP[this.getters['Auth/user'].role_id];
            return new Promise((resolve, reject) => {
                // eslint-disable-next-line no-undef
                axios.post(`/${role}/coins`, {user_id: data.userId, amount: data.amount})
                    .then(resolve)
                    .catch(err => reject(ErrorHelper.getErrorWithMessage(err)))
                    .then(() => this.commit('SET_LOADING', false))
            });
        },
    },
    getters: {
        student: (state) => state.student
    }
}
