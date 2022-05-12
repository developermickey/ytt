import axios from "axios";
import ErrorHelper from "@/helpers/ErrorHelper";
import { STUDENT, TEACHER, ADMIN, ROLE_MAP } from "@/constants/roles";
import moment from "moment";
export default {
  namespaced: true,
  state: {
    loading: false,
    studentsList: null,
    student: null,
    filteredStudentsList: null,
  },
  mutations: {
    SET_LOADING(state, payload) {
      state.loading = payload;
    },
    SET_STUDENTS_LIST(state, payload) {
      state.studentsList = payload;
      state.filteredStudentsList = payload;
    },
    SET_STUDENT(state, payload) {
      state.student = payload;
      state.filteredStudentsList = payload;
    },
    DELETE_STUDENT(state, { studentId }) {
      state.studentsList = state.studentsList.filter((e) => e.id !== studentId);
    },
    UPDATE_STUDENTS_LESSONS(state, { studentId, lessons }) {
      state.studentsList = state.studentsList.map((item) => {
        if (item.id === studentId) {
          item.lessons = lessons;
          item.lessons_count = lessons.length;
        }
        return item;
      });
    },
    RESET_STUDENTS_LIST(state) {
      state.studentsList = null;
      state.filteredStudentsList = null;
    },
    FILTER_STUDENTS_LIST(state, payload) {
      state.filteredStudentsList = state.studentsList.filter((imtem) => {
        return imtem.name.toLowerCase().includes(payload.toLowerCase());
      });
    },
  },
  actions: {
    async fetchStudentsList(context, role) {
      context.commit("SET_LOADING", true);

      let url = "",
        params = {};
      if (role === ADMIN) {
        url = `/${ROLE_MAP[ADMIN]}/users`;
        params.role = STUDENT;
      } else if (role === TEACHER) {
        url = `/${ROLE_MAP[TEACHER]}/students`;
      }
      await axios
        // .get("/admin/getStudentTest")
        .get(url, { params })
        .then((response) => {
          console.log(response.data);
          let inactiveStudentList = response.data.filter(
            (x) => x.status === "inactive"
          );
          inactiveStudentList.map((e) => {
            e.color = "#d3d3d3";
          });
          let activeStudentList = response.data.filter(
            (x) => x.status === "active" || x.status === null
          );
          let whiteBlock = activeStudentList.filter(
            (x) => x.called_date === null
          );
          whiteBlock.map((e) => {
            e.color = "white";
          });
          let calledStudentList = activeStudentList.filter(
            (x) => x.called_date !== null
          );
          let redBlockTwo = [];
          let yellowBlock = [];
          let greenBlock = [];
          let currentDate = moment();
          calledStudentList.map((e) => {
            let called_date = "";
            called_date = moment(e.called_date, "YYYY-MM-DD HH:mm:ss ").format(
              "YYYY-MM-DD"
            );
            let difference = "";
            // week
            difference = currentDate.diff(called_date, "week");
            if (difference > 6) {
              e.color = "red";
              redBlockTwo.push(e);
            } else if (difference >= 4 && difference <= 6) {
              yellowBlock.push(e);
              e.color = "yellow";
            } else {
              e.color = "green";
              greenBlock.push(e);
            }
          });
          console.log(greenBlock);
          let mergeStudents = [
            ...whiteBlock,
            ...redBlockTwo,
            ...yellowBlock,
            ...greenBlock,
            ...inactiveStudentList,
          ];
          context.commit("SET_STUDENTS_LIST", mergeStudents);
        })
        .catch((err) => {
          ErrorHelper.getErrorWithMessage(err);
        });
    },

    fetchStudent({ commit }, { id, role }) {
      commit("SET_LOADING", true);

      return new Promise((resolve, reject) => {
        axios
          .get(`/${ROLE_MAP[role]}/students/${id}`)
          .then((response) => {
            let student = response.data;
            if (student.lessons && student.lessons.length) {
              commit("Lessons/SET_LESSONS_LIST", response.data.lessons, {
                root: true,
              });
              delete student.lessons;
            }
            commit("SET_STUDENT", student);
          })
          .catch((err) => reject(ErrorHelper.getErrorWithMessage(err)))
          .then(() => commit("SET_LOADING", false));
      });
    },

    addAccessToLessons(context, { studentId, lessons }) {
      context.commit("SET_LOADING", true);
      return new Promise((resolve, reject) => {
        axios
          .post(`/teacher/students/${studentId}/lessons/access`, {
            lessons: lessons,
          })
          .then((response) => {
            context.commit("UPDATE_STUDENTS_LESSONS", {
              studentId,
              lessons: response.data.lessons,
            });
            resolve();
          })
          .catch((err) => reject(ErrorHelper.getErrorWithMessage(err)))
          .then(() => context.commit("SET_LOADING", false));
      });
    },
  },
  getters: {
    loading: (state) => state.loading,
    studentsList: (state) => state.studentsList,
    filteredStudentsList: (state) => state.filteredStudentsList,
    student: (state) => state.student,
  },
};
