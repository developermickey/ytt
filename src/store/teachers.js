import axios from 'axios';
import ErrorHelper from "@/helpers/ErrorHelper";
import {
    // STUDENT,
    TEACHER, ADMIN, ROLE_MAP } from '@/constants/roles';

export default {
    namespaced: true,
    state: {
        loading: false,
        teachersList: null,
        teacher: null,
        filteredTeachersList: null,
    },
    mutations: {
        SET_LOADING(state, payload) {
            state.loading = payload;
        },
        SET_TEACHERS_LIST(state, payload){
            state.teachersList = payload;
            state.filteredTeachersList = payload;
        },
        SET_TEACHER(state, payload){
            state.teacher = payload;
        },
        DELETE_TEACHER(state, { teacherId }){
            state.teachersList = state.teachersList.filter(e => e.id !== teacherId);
        },
        RESET_TEACHERS_LIST(state){
            state.teachersList = null;
            state.filteredTeachersList = null;
        },
        FILTER_TEACHER_LIST(state, payload){
            state.filteredTeachersList = state.teachersList.filter(imtem => {
                return imtem.name.toLowerCase().includes(payload.toLowerCase());
            })
        },
    },
    actions: {
        fetchTeachersList(context, role){
            context.commit('SET_LOADING', true);

            let url = '', params = {};
            if(role === ADMIN){
                url = `/${ROLE_MAP[ADMIN]}/users`;
                params.role = TEACHER;
            }

            return new Promise((resolve, reject) => {
                axios.get(url, {params})
                    .then(response => {
                        //console.log(response.data);
                        context.commit('SET_TEACHERS_LIST', response.data);
                    })
                    .catch(err => reject(ErrorHelper.getErrorWithMessage(err)))
                    .then(() => context.commit('SET_LOADING', false))
            })
        },

    },
    getters: {
        loading: state => state.loading,
        teachersList: state => state.teachersList,
        filteredTeachersList: state => state.filteredTeachersList,
        teacher: state => state.student,
    },
}
