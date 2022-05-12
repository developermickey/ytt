import axios from "axios";
import { KNOWN_WORDS, UNKNOWN_WORDS, ALL_WORDS, SHUFFLED_WORDS, MASTERED_WORDS } from "@/constants/words";
import ErrorHelper from "@/helpers/ErrorHelper";

const getDefaultState = () => ({
    words: [],
    wordsToggled: [],
    wordsShuffled: [],
    shuffleTopEdge: null,
    shuffleBottomEdge: null,
    lastWord: null,
    loading: false,
    tab: 1,
    countIndexForTimer: 0,
});

export default {
    namespaced: true,
    state: getDefaultState(),
    mutations: {
        SET_WORDS(state, payload){
            state.words = payload;
        },
        SET_TAB(state, payload){
            state.shuffleTopEdge = null;
            state.shuffleBottomEdge = null;
            state.tab = payload;
        },
        RESET_TOGGLED_WORDS(state){
          state.wordsToggled = [];
        },
        SET_SHUFFLE_TOP_EDGE(state, payload){
            state.shuffleTopEdge = payload;
            // state.wordsShuffled = [];
        },
        SET_SHUFFLE_BOTTOM_EDGE(state, payload){
            state.shuffleBottomEdge = payload;
            // state.wordsShuffled = [];
        },
        TOGGLE_WORD(state, wordId){
            state.words = state.words.map((item) => {
                if(item.id === wordId)
                    item.isKnown = !item.isKnown
                return item;
            });

            if(state.wordsToggled.indexOf(wordId) !== -1){
                state.wordsToggled = state.wordsToggled.filter(item => item !== wordId);
            }
            else{
                state.wordsToggled.push(wordId);
            }
        },
        CHANGE_WORD_STATUS(state, { wordId, status }) {
            console.log(wordId, status)
            state.words = state.words.map((item) => {
                if(item.id === wordId)
                    item.status = status
                    
                return item;
            });
            console.log('state.words:', state.words)

            state.wordsToggled.forEach( word => {
                if(word.id === wordId && word.status !== status) {
                    word.status = status
                }
            })
            console.log('state.wordsToggled:', state.wordsToggled)

            if(state.wordsToggled.indexOf(wordId) === -1){
                state.wordsToggled.push(wordId);
            }
            console.log('state.wordsToggled:', state.wordsToggled)
        },
        SET_LOADING(state, payload){
            state.loading = payload;
        },
        SET_LAST_WORD(state, payload){
            state.lastWord = payload;
        },
        SHUFFLE(state){
            let words = this.getters['Words/words'].filter(word => word.serial >= state.shuffleBottomEdge && word.serial <= state.shuffleTopEdge);
            words.sort(() => Math.random() - 0.5);
            state.wordsShuffled = words;
            this.commit('Words/SET_TAB', SHUFFLED_WORDS);
        },
        RESET(state){
            Object.assign(state, getDefaultState());
        },
        ADD_COUNT_INDEX_FOR_TIMER(state, payload){
            state.countIndexForTimer += payload;
        },
        RESET_COUNT_INDEX_FOR_TIMER(state){
            state.countIndexForTimer = 0;
        }
    },
    actions: {
        updateStudentsWords({ commit, getters, state}, { studentId, lessonId, isLessonCheck }){

            let url = `/teacher/students/${studentId}/lessons/${lessonId}/words/update`;
            if(isLessonCheck){
                url += '/words';
            }
            
            const words = state.words.map((item) => {
                var data = {
                    'word_id':item.id,
                    'status':item.status,
                }
                if(item.translation_default_id){
                    data.default_word_translation_id = item.translation_default_id
                }
                if(item.image_default_id){
                    data.default_word_image_id = item.image_default_id
                    console.log('test')
                }
                console.log(item)
                console.log(data)
                return data

            });
            commit('SET_LOADING', true);
            return new Promise((resolve, reject) => {
                axios.post(url, {
                    student_words: words,
                    last_word: getters.lastWord,
                })
                .then(resolve)
                .catch(err => reject(ErrorHelper.getErrorWithMessage(err)))
                .then(() => {
                    commit('RESET_TOGGLED_WORDS');
                    commit('SET_LOADING', false);
                });
            });
        }
    },
    getters: {
        loading: state => state.loading,
        tab: state => state.tab,
        allWords: state => state.words,
        words: state => {
            switch(state.tab){
                case KNOWN_WORDS:
                    return state.words.filter(item => item.status === "known");
                case UNKNOWN_WORDS:
                    return state.words.filter(item => item.status === "unknown");
                case MASTERED_WORDS:
                    return state.words.filter(item => item.status === "mastered");
                case SHUFFLED_WORDS:
                    return state.wordsShuffled;
                case ALL_WORDS:
                    return state.words;
            }
        },
        wordsShuffled: state => state.wordsShuffled,
        shuffleBottomEdge: state => state.shuffleBottomEdge,
        shuffleTopEdge: state => state.shuffleTopEdge,
        knownWords: state => state.words.filter(item => item.status === "known"),
        unknownWords: state => state.words.filter(item => item.status === "unknown"),
        masteredWords: state => state.words.filter(item => item.status === "mastered"),
        wordsToggled: state => state.wordsToggled,
        lastWord: state => state.lastWord,
        countIndexForTimer: state => state.countIndexForTimer,
        totalWordsCountForTimer: state => Math.ceil(state.countIndexForTimer/2),
    }
}
