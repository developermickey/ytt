import axios from "axios";
import ErrorHelper from "@/helpers/ErrorHelper";
import { STUDENT, TEACHER, ADMIN, SCHOOL, ROLE_MAP } from "@/constants/roles";
import moment from "moment";
export default {
  namespaced: true,
  state: {
    loading: false,
    studentsList: [],
    student: null,
    filteredStudentsList: [],
    paginationLinks: [],
    activeLink: 1,
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
      state.filteredStudentsList = state.studentsList.filter((student) => {
        return student.name.toLowerCase().includes(payload.toLowerCase());
      });
    },
    PAGINATION(state, links) {
      state.paginationLinks = links;
    },
    SET_PAGINATION_ACTIVE(state, payload) {
      state.activeLink = payload;
    },
  },
  actions: {
    async fetchStudentsList(context, role) {
      let url = "";
      let params = {};
      if (role === ADMIN) {
        url = `/${ROLE_MAP[ADMIN]}/users`;
        params.role = STUDENT;
        params.perPage = 20;
      } else if (role === TEACHER) {
        url = `/${ROLE_MAP[TEACHER]}/students`;
      } else if (role === SCHOOL) {
        url = `/school/students?role=3`;
      }
      context.commit("SET_LOADING", true);

      await axios
        // .get("/admin/getStudentTest")
        .get(url, { params })
        .then((response) => {
          let res = "";
          if (role === ADMIN) {
            res = response.data.data;
          } else {
            res = response.data;
          }
          let inactiveStudentList = res.filter((x) => x.status === "inactive");
          inactiveStudentList.map((e) => {
            e.color = "#d3d3d3";
          });
          let activeStudentList = res.filter(
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
          let mergeStudents = [
            ...whiteBlock,
            ...redBlockTwo,
            ...yellowBlock,
            ...greenBlock,
            ...inactiveStudentList,
          ];

          for (let index = 0; index < mergeStudents.length; index++) {
            const element = mergeStudents[index];
            if (element.license_expire_at === null) {
              element.needToPay = true;
            }
          }

          let canPay = "";
          let expireDate = "";
          for (let index = 0; index < mergeStudents.length; index++) {
            const element = mergeStudents[index];
            if (element.license_expire_at !== null) {
              expireDate = "";
              expireDate = moment(
                element.license_expire_at,
                "YYYY-MM-DD HH:mm:ss"
              ).format("YYYY-MM-DD");
              canPay = "";
              canPay = currentDate.isSameOrAfter(expireDate, "days");
              if (canPay) {
                element.needToPay = true;
              } else {
                element.needToPay = false;
              }
            }
          }
          context.commit("SET_STUDENTS_LIST", mergeStudents);
          if (role === ADMIN) {
            context.commit("PAGINATION", response.data.meta.links);
            context.commit(
              "SET_PAGINATION_ACTIVE",
              response.data.meta.links[1].url
            );
          }
          context.commit("SET_LOADING", false);
        })
        .catch((err) => {
          ErrorHelper.getErrorWithMessage(err);
          context.commit("SET_LOADING", false);
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
    async setPagination(context, payload) {
      if (payload.url !== null) {
        context.commit("SET_LOADING", true);
        let params = { perPage: 20, role: 3 };

        await axios
          .get(payload.url, { params })
          .then((response) => {
            let inactiveStudentList = response.data.data.filter(
              (x) => x.status === "inactive"
            );
            inactiveStudentList.map((e) => {
              e.color = "#d3d3d3";
            });
            let activeStudentList = response.data.data.filter(
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
              called_date = moment(
                e.called_date,
                "YYYY-MM-DD HH:mm:ss "
              ).format("YYYY-MM-DD");
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
            let mergeStudents = [
              ...whiteBlock,
              ...redBlockTwo,
              ...yellowBlock,
              ...greenBlock,
              ...inactiveStudentList,
            ];
            context.commit("SET_STUDENTS_LIST", mergeStudents);
            context.commit("SET_PAGINATION_ACTIVE", payload.url);
            context.commit("PAGINATION", response.data.meta.links);
            context.commit("SET_LOADING", false);
          })
          .catch((err) => {
            ErrorHelper.getErrorWithMessage(err);
            context.commit("SET_LOADING", false);
          });
      }
    },
  },
  getters: {
    loading: (state) => state.loading,
    studentsList: (state) => state.studentsList,
    filteredStudentsList: (state) => state.filteredStudentsList,
    student: (state) => state.student,
    pagination: (state) => state.paginationLinks,
    activeLink: (state) => state.activeLink,
  },
};
