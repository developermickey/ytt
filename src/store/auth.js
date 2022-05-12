import router from "@/router";
import cookie from "js-cookie";
import axios from "axios";
import moment from "moment";
import { ADMIN, TEACHER, STUDENT, ROLE_MAP } from "@/constants/roles";
import ErrorHelper from "@/helpers/ErrorHelper";

export default {
  namespaced: true,
  state: {
    user:
      localStorage.getItem("user") === null
        ? null
        : JSON.parse(localStorage.getItem("user")),
    loading: false,
    userIsFetching: false,
    userFetched: true,
    resetTokenValid: false,
  },
  mutations: {
    SET_USER(state, user) {
      state.user = user;
      localStorage.setItem("user", JSON.stringify(user));
    },
    SET_LOADING(state, loading) {
      state.loading = loading;
    },
    SET_USER_FETCHING(state, isFetching) {
      state.userIsFetching = isFetching;
    },
    SET_USER_FETCHED(state, userFetched) {
      state.userFetched = userFetched;
    },
    SET_RESET_TOKEN_VALID(state, valid) {
      state.resetTokenValid = valid;
    },
  },
  actions: {
    async fetchUser({ commit }) {
      if (!cookie.get("YTT_JWT")) return;

      commit("SET_USER_FETCHING", true);
      try {
        const res = await axios.get("/user");
        commit("SET_USER", res.data);
      } catch (err) {
        console.error(err);
      }
      commit("SET_USER_FETCHING", false);
      return commit("SET_USER_FETCHED", true);
    },
    logout({ commit }) {
      const clearAuthData = () => {
        cookie.remove("YTT_JWT");
        commit("SET_USER", null);
        localStorage.clear();
        if (router.history.current.name !== "auth-login")
          router.push({ name: "auth-login" });
      };

      axios
        .post("/auth/logout")
        .then(clearAuthData)
        .catch(clearAuthData);
    },
    login(context, credentials) {
      context.commit("SET_LOADING", true);
      return new Promise((resolve, reject) => {
        axios
          .post("/auth/login", credentials)
          .then((res) => processAuthResponse(context, res.data))
          .then(resolve)
          .catch((err) => reject(ErrorHelper.getErrorWithMessage(err)))
          .then(() => context.commit("SET_LOADING", false));
      });
    },
    googleLogin(context, googleUser) {
      context.commit("SET_LOADING", true);

      const tokenData = googleUser.getAuthResponse();
      return new Promise((resolve, reject) => {
        axios
          .post("/auth/login/google", {
            google_token_id: tokenData.id_token,
          })
          .then((res) => processAuthResponse(context, res.data))
          .then(resolve)
          .catch((err) => reject(ErrorHelper.getErrorWithMessage(err)))
          .then(() => context.commit("SET_LOADING", false));
      });
    },
    loginAsUser(context, userId) {
      context.commit("SET_LOADING", true);
      const currentRoleId = context.state.user.role_id;
      return new Promise((resolve, reject) => {
        axios
          .get(`/${ROLE_MAP[currentRoleId]}/impersonate/${userId}`)
          .then((res) => processAuthResponse(context, res.data))
          .then(resolve)
          .catch((err) => reject(ErrorHelper.getErrorWithMessage(err)))
          .then(() => context.commit("SET_LOADING", false));
      });
    },
    register(context, credentials) {
      return new Promise((resolve, reject) => {
        axios
          .post("/auth/register", credentials)
          .then((res) => processAuthResponse(context, res.data))
          .then(resolve)
          .catch((err) => reject(ErrorHelper.getErrorWithMessage(err)));
      });
    },
    forgotPassword(context, login) {
      return new Promise((resolve, reject) => {
        axios
          .post("/auth/forgot-password", { login })
          .then(resolve)
          .catch((err) => reject(ErrorHelper.getErrorWithMessage(err)));
      });
    },
    resetTokenValid(context, token) {
      this.commit("SET_LOADING", true);
      return new Promise((resolve, reject) => {
        axios
          .get(`/auth/forgot-password/${token}`)
          .then((res) => res.data.isValid)
          .then(resolve)
          .catch((err) => reject(ErrorHelper.getErrorWithMessage(err)))
          .then(() => this.commit("SET_LOADING", false));
      });
    },
    resetPassword(context, { token, password, password_confirmation }) {
      this.commit("SET_LOADING", true);
      return new Promise((resolve, reject) => {
        axios
          .post(`/auth/forgot-password/${token}`, {
            password,
            password_confirmation,
          })
          .then(resolve)
          .catch((err) => reject(ErrorHelper.getErrorWithMessage(err)))
          .then(() => this.commit("SET_LOADING", false));
      });
    },
    inviteUser(context, { email, role }) {
      context.commit("SET_LOADING", true);
      return new Promise((resolve, reject) => {
        axios
          .post(`/admin/invites`, { email, role })
          .then(resolve)
          .catch((err) => reject(ErrorHelper.getErrorWithMessage(err)))
          .then(() => context.commit("SET_LOADING", false));
      });
    },
    inviteTokenValid(context, token) {
      this.commit("SET_LOADING", true);
      return new Promise((resolve, reject) => {
        axios
          .get(`/auth/invites/${token}`)
          .then((res) => resolve(res.data))
          .catch((err) => reject(ErrorHelper.getErrorWithMessage(err)))
          .then(() => this.commit("SET_LOADING", false));
      });
    },
    createAccountInvite(context, { token, ...account }) {
      this.commit("SET_LOADING", true);
      return new Promise((resolve, reject) => {
        axios
          .post(`/auth/invites/${token}`, account)
          .then((res) => processAuthResponse(context, res.data))
          .then(resolve)
          .catch((err) => reject(ErrorHelper.getErrorWithMessage(err)))
          .then(() => this.commit("SET_LOADING", false));
      });
    },
    navigateToStartPage({ getters }) {
      if (!getters.user)
        return new Error("Store/NavigateToStartPage: user is not defined");

      switch (getters.user.role_id) {
        case ADMIN:
          return router.push({ name: "admin-lessons-all" });
        case TEACHER:
          return router.push({ name: "teacher-lessons-all" });
        case STUDENT:
          return router.push({ name: "student-lessons-all" });
      }
    },
  },
  getters: {
    user: (state) => state.user,
    userRole: (state) => {
      let userRole = null;
      if (state.user) {
        userRole = state.user.role_id;
      }
      return userRole;
    },
    loading: (state) => state.loading,
    userIsFetching: (state) => state.userIsFetching,
    userFetched: (state) => state.userFetched,
  },
};

const processAuthResponse = async (
  { dispatch },
  { access_token, expires_at }
) => {
  cookie.set("YTT_JWT", access_token, { expires: moment(expires_at).toDate() });
  await dispatch("fetchUser");
  await dispatch("navigateToStartPage");
};
