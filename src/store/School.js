import axios from "axios";
import ErrorHelper from "@/helpers/ErrorHelper";
export default {
  namespaced: true,
  state: {
    loading: false,
    schoolList: null,
  },
  mutations: {
    SET_LOADING(state, payload) {
      state.loading = payload;
    },
    SET_SCHOOL_LIST(state, payload) {
      state.schoolList = payload;
    },
  },
  actions: {
    async fetchSchoolList(context) {
      // context.commit("SET_LOADING", true);
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
  },
  getters: {
    loading: (state) => state.loading,
    schoolList: (state) => state.schoolList,
  },
};
