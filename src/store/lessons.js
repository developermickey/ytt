import axios from 'axios';
import ErrorHelper from '@/helpers/ErrorHelper';
import {
    // STUDENT, TEACHER, ADMIN,
    ROLE_MAP } from '@/constants/roles';

export default {
    namespaced: true,
    state: {
        lesson: null,
        lessonsList: null,
        loading: false,
        lessonTimerIsActive: false,
        lessonTime: 0,
        interval: null,
        hideLessonImages: false,
        hideLessonTranslations: false,
        editLesson: false,
    },
    mutations: {
        SET_LOADING(state, payload){
            state.loading = payload;
        },
        SET_LESSONS_LIST(state, payload){
            state.lessonsList = payload;
        },
        SET_LESSON(state, payload){
            state.lesson = payload;
        },
        RESET_LESSONS_LIST(state){
            state.lessonsList = null;
        },
        RESET_LESSON(state){
            state.lesson = null;
        },
        DELETE_LESSON(state, lessonId){
            state.lessonsList = state.lessonsList.filter(lesson => lesson.id !== lessonId);
        },
        TOGGLE_HIDE_LESSON(state, lessonId){
            state.lessonsList = state.lessonsList.map(lesson => {
                if(lesson.id === lessonId){
                    lesson.hidden = !(lesson.hidden);
                }
                return lesson;
            });
        },
        SET_INTERVAL(state, payload) {
            state.interval = payload;
        },
        SET_LESSON_TIMER_IS_ACTIVE(state, payload) {
            state.lessonTimerIsActive = payload;
        },
        ADD_LESSON_TIME(state) {
            state.lessonTime++;
        },
        RESET_LESSON_TIME(state) {
            state.lessonTime = 0;
        },
        UPDATE_HIDE_LESSON_IMAGE(state, payload) {
            state.hideLessonImages = payload;
        },
        UPDATE_HIDE_LESSON_TRANSLATION(state, payload) {
            state.hideLessonTranslations = payload;
        },
        SET_EDIT_LESSON(state) {
            state.editLesson = true;
        },
        RESET_EDIT_LESSON(state) {
            state.editLesson = false;
        },
    },
    actions: {
        createLesson(context, lesson){

            context.commit('SET_LOADING', true);

            // const lessonData = new FormData();
            // for(let field in lesson){
            //     if(Array.isArray(lesson[field])){
            //         for (let i = 0; i < lesson[field].length; i++) {
            //             lessonData.append(`${field}[]`, lesson[field][i]);
            //         }
            //     }
            //     else{
            //         lessonData.append(field, lesson[field]);
            //     }
            // }

            return new Promise((resolve, reject) => {
                axios.post('/admin/lessons', lesson)
                  .then(resolve)
                  .catch(err => reject(ErrorHelper.getErrorWithMessage(err)))
                  .then(() => context.commit('SET_LOADING', false))
            });
        },

        fetchLesson({ commit }, { role, id}){

            commit('SET_LOADING', true);
            return new Promise((resolve, reject) => {
                axios.get(`/${ROLE_MAP[role]}/lessons/${id}`)
                    .then(response => {
                        setFetchedLesson({ commit }, response.data);
                        resolve(response.data);
                    })
                    .catch(err => reject(ErrorHelper.getErrorWithMessage(err)))
                    .then(() => commit('SET_LOADING', false))
            })

        },

        fetchStudentsLesson({ commit }, { studentId, lessonId}){

            commit('SET_LOADING', true);
            return new Promise((resolve, reject) => {
                axios.get(`/teacher/students/${studentId}/lessons/${lessonId}`)
                    .then(response => setFetchedLesson({ commit }, response.data))
                    .catch(err => reject(ErrorHelper.getErrorWithMessage(err)))
                    .then(() => commit('SET_LOADING', false))
            })

        },

        fetchLessonList({ commit }, role){

            commit('SET_LOADING', true);
            return new Promise((resolve, reject) => {
                axios.get(`/${ROLE_MAP[role]}/lessons`)
                  .then(response => {
                      commit('SET_LESSONS_LIST', response.data);
                      resolve();
                  })
                  .catch(err => reject(ErrorHelper.getErrorWithMessage(err)))
                  .then(() => commit('SET_LOADING', false))
            })

        },

        fetchStudentsLessonsByTeacher(context, id){
            context.commit('SET_LOADING', true);

            return new Promise((resolve, reject) => {
                axios.get(`/teacher/students/${id}`)
                    .then((response) => {
                        console.log(response.data);
                        resolve();
                    })
                    .catch(err => reject(ErrorHelper.getErrorWithMessage(err)))
                    .then(() => context.commit('SET_LOADING', false));
            });
        },

        addAccessForStudents(context, { lessonId, students }){
            context.commit('SET_LOADING', true);
            return new Promise((resolve, reject) => {
                axios.post(`/teacher/lessons/${lessonId}/students/access`, { students: students})
                    .then(resolve)
                    .catch(err => reject(ErrorHelper.getErrorWithMessage(err)))
                    .then(() => context.commit('SET_LOADING', false));
            });
        },

        sendRecord(context, { lessonId, ...answer }){
            context.commit('SET_LOADING', true);

            const postData = new FormData();
            for(let field in answer){
                postData.append(field, answer[field]);
            }

            return new Promise((resolve, reject) => {
                axios.post(`/student/lessons/${lessonId}/record`, postData)
                    .then((response) => {
                        console.log(response.data);
                        resolve();
                    })
                    .catch(err => reject(ErrorHelper.getErrorWithMessage(err)))
                    .then(() => context.commit('SET_LOADING', false));
            });
        },

        completeLesson(context, { lessonId, studentId}){

            context.commit('SET_LOADING', true);
            return new Promise((resolve, reject) => {
                axios.post(`/teacher/students/${studentId}/lessons/${lessonId}/complete`)
                    .then(resolve)
                    .catch(err => reject(ErrorHelper.getErrorWithMessage(err)))
                    .then(() => context.commit('SET_LOADING', false));
            });
        },

        deleteLesson(context, { lessonId }){
            context.commit('SET_LOADING', true);
            return new Promise((resolve, reject) => {
                axios.delete(`/admin/lessons/${lessonId}`)
                    .then(() => {
                        context.commit('DELETE_LESSON', lessonId);
                        resolve();
                    })
                    .catch(err => reject(ErrorHelper.getErrorWithMessage(err)))
                    .then(() => context.commit('SET_LOADING', false));
            });
        },

        hideLesson(context, { lessonId }){
            context.commit('SET_LOADING', true);
            return new Promise((resolve, reject) => {
                axios.post(`/admin/lessons/${lessonId}/hide`)
                    .then(resolve)
                    .catch(err => reject(ErrorHelper.getErrorWithMessage(err)))
                    .then(() => context.commit('TOGGLE_HIDE_LESSON', lessonId))
                    .then(() => context.commit('SET_LOADING', false));
            });
        },

        toggleLessonTimer({ commit, state }) {
            let isTimerActive = this.getters['Lessons/lessonTimerIsActive'];
            commit('SET_LESSON_TIMER_IS_ACTIVE', !isTimerActive);
      
            if(!isTimerActive){
                state.interval = setInterval(() => {
                    commit('ADD_LESSON_TIME')
                }, 1000);
            } else {
                clearInterval(state.interval);
            }
        }
    },
    getters: {
        lessonsList: state => state.lessonsList,
        loading: state => state.loading,
        lesson: state => state.lesson,
        words: state => {
            let words = [];
            if(state.lesson && state.lesson.words){
                words = state.lesson.words;
            }
            return words;
        },
        lessonTimerIsActive: state => state.lessonTimerIsActive,
        lessonTime: state => state.lessonTime,
        hideLessonImages: state => state.hideLessonImages,
        hideLessonTranslations: state => state.hideLessonTranslations,
        editLesson: state => state.editLesson,
    },
}

function setFetchedLesson({ commit }, lesson){

    if( lesson.words && lesson.words.length){
        let words = lesson.words.map(item => {
            item.isKnown = !!item.is_known;
            return item;
        });
        commit('Words/SET_WORDS', words, { root: true });
        delete lesson.words;
    }

    if(lesson.last_word){
        commit('Words/SET_LAST_WORD', lesson.last_word, { root: true });
    }

    commit('SET_LESSON', lesson);
}
