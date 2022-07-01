import axios from "axios";
import ErrorHelper from "@/helpers/ErrorHelper";
export default {
  namespaced: true,
  state: {
    loading: false,
    schoolList: [],
    filteredSchoolList: [],
    schoolDetails: {},
  },
  mutations: {
    SET_LOADING(state, payload) {
      state.loading = payload;
    },
    SET_SCHOOL_LIST(state, payload) {
      state.schoolList = payload;
      state.filteredSchoolList = payload;
    },
    SET_SCHOOL_DETAILS(state, payload) {
      state.schoolDetails = payload;
    },
    FILTER_SCHOOL_LIST(state, payload) {
      state.filteredSchoolList = state.schoolList.filter((imtem) => {
        return imtem.name.toLowerCase().includes(payload.toLowerCase());
      });
    },
  },
  actions: {
    async fetchSchoolList(context) {
      context.commit("SET_LOADING", true);
      await axios
        .get("admin/users?role=4")
        .then((response) => {
          context.commit("SET_SCHOOL_LIST", response.data);
          context.commit("SET_LOADING", false);
        })
        .catch((err) => {
          ErrorHelper.getErrorWithMessage(err);
        });
    },
    async getSchoolInformationById(context, payload) {
      context.commit("SET_LOADING", true);
      await axios
        .get(`/school/${payload}`)
        .then((response) => {
          context.commit("SET_SCHOOL_DETAILS", response.data);
          context.commit("SET_LOADING", false);
        })
        .catch((err) => {
          ErrorHelper.getErrorWithMessage(err);
        });
    },
  },
  getters: {
    loading: (state) => state.loading,
    schoolList: (state) => state.schoolList,
    filteredSchoolList: (state) => state.filteredSchoolList,
    schoolDetails: (state) => state.schoolDetails,
  },
};
