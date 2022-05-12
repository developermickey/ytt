<template>
  <div>
    <div v-if="loading">
      <Loader class="loader" :show="loading" :fixedPosition="false" />
    </div>
    <u-card v-else>
      <table key="tableKey" class="u-data-table ">
        <colgroup>
          <col v-for="column in columns" :key="column.value" />
        </colgroup>
        <thead>
          <tr>
            <template v-for="(column, index) in columns">
              <th
                class="u-pl-13 u-text-left table-head"
                v-if="index == 0"
                :key="index"
              >
                {{ column.text }}
              </th>
              <th v-else class="u-text-left table-head" :key="index">
                {{ column.text }}
              </th>
            </template>
          </tr>
        </thead>
        <tbody v-if="items && items.length">
          <tr
            v-for="item in items"
            :key="item.id"
            :style="{ backgroundColor: item.color }"
          >
            <td class="u-pl-13">
              <div class="u-flex is-align-center">
                <div class="avatar-wrap u-mr-6">
                  <img :src="item.avatar" alt="" />
                </div>
                {{ item.name }}
              </div>
            </td>
            <td class="grey-col">{{ item.email }}</td>
            <!-- <td class="grey-col">{{item.phone}}</td> -->
            <td>
              <div
                class="progress-col"
                v-for="lesson in item.progress"
                :key="lesson.lesson_id"
              >
                <div class="progress-col__name">
                  {{ getLessonName(lesson.lesson_id) }}
                </div>
                <div class="progress-col__progress">
                  <div class="progress-col__progress-mastered">
                    M: <span>{{ lesson.status.mastered }}</span>
                  </div>
                  <div class="progress-col__progress-known">
                    K: <span>{{ lesson.status.known }}</span>
                  </div>
                  <div class="progress-col__progress-unknown">
                    U: <span>{{ lesson.status.unknown }}</span>
                  </div>
                </div>
              </div>
            </td>
            <td class="u-pr-13 u-text-right">
              <div class="actions-col actions-cell">
                <UBtn
                  class="qa-assign-students-teacher-btn u-mr-1 u-pr-3 u-pl-3"
                  color="primary"
                  size="small"
                  @click="openSelectTeacherModal(item)"
                  v-if="!item.teacher_id"
                >
                  Add teacher
                </UBtn>
                <UBtn
                  class="qa-change-students-teacher-btn u-mr-1 u-pr-3 u-pl-3"
                  color="primary"
                  size="small"
                  @click="openSelectTeacherModal(item)"
                  v-else
                >
                  {{ getTeacherName(item.teacher_id) }}
                </UBtn>
                <b-dropdown no-caret>
                  <template #button-content>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="feather feather-more-vertical"
                    >
                      <circle cx="12" cy="12" r="1"></circle>
                      <circle cx="12" cy="5" r="1"></circle>
                      <circle cx="12" cy="19" r="1"></circle>
                    </svg>
                  </template>

                  <b-dropdown-item>
                    <div
                      class="u-mx-1 reward"
                      @click="
                        () =>
                          showGiveCoinsModal({ id: item.id, name: item.name })
                      "
                    >
                      <img src="@/assets/svg/reward.svg" alt="" />
                    </div>
                  </b-dropdown-item>

                  <b-dropdown-item>
                    <UIconBtn
                      class="u-mx-1 qa-login-as-teacher-btn login-as-icon-btn"
                      icon="icon-enter"
                      icon-color="grey"
                      icon-hover-color="blue"
                      bg-hover-color="white"
                      hoverable
                      @click.native="onLoginAsUserClick(item)"
                      title="Login as user"
                    >
                    </UIconBtn>
                  </b-dropdown-item>

                  <b-dropdown-item>
                    <UIconBtn
                      class="u-mx-1 qa-edit-student-btn"
                      :to="{ name: 'admin-user-edit', params: { id: item.id } }"
                      icon="icon-pencil"
                      icon-color="grey"
                      icon-hover-color="blue"
                      bg-hover-color="white"
                      hoverable
                    >
                    </UIconBtn>
                  </b-dropdown-item>

                  <b-dropdown-item>
                    <UIconBtn
                      class="u-mx-1 qa-delete-student-btn"
                      icon="icon-trash"
                      icon-color="grey"
                      icon-hover-color="blue"
                      bg-hover-color="white"
                      hoverable
                      @click.native="deleteUserAlert(item)"
                    >
                    </UIconBtn>
                  </b-dropdown-item>

                  <b-dropdown-item v-if="item.status === 'inactive'">
                    <UIconBtn
                      class="u-mx-1 qa-delete-student-btn"
                      icon="icon-eye2"
                      icon-color="grey"
                      icon-hover-color="blue"
                      bg-hover-color="white"
                      hoverable
                      @click.native="activeStudent(item)"
                    >
                    </UIconBtn>
                  </b-dropdown-item>

                  <b-dropdown-item
                    v-if="item.status === null || item.status === 'active'"
                  >
                    <UIconBtn
                      class="u-mx-1 qa-delete-student-btn"
                      icon="icon-eye-crossed"
                      icon-color="grey"
                      icon-hover-color="blue"
                      bg-hover-color="white"
                      hoverable
                      @click.native="deactiveStudent(item)"
                    >
                    </UIconBtn>
                  </b-dropdown-item>
                  <b-dropdown-item
                    v-if="item.status === null || item.status === 'active'"
                  >
                    <img
                      class="ml-2 pb-3 mt-1"
                      src="@/assets/svg/phone.svg"
                      alt=""
                      @click="callStudent(item)"
                    />
                  </b-dropdown-item>
                  <b-dropdown-item>
                    <img
                      class="ml-2 pb-3 mt-1"
                      src="@/assets/svg/comment.svg"
                      alt=""
                      @click="comment(item)"
                    />
                  </b-dropdown-item>
                </b-dropdown>
              </div>
              <div class="calledDate">
                {{ formatDate(item.called_date) }}
              </div>
            </td>
          </tr>
        </tbody>
        <tbody v-else>
          <tr>
            <td class="u-text-center" colspan="4">
              No data available
            </td>
          </tr>
        </tbody>
      </table>
    </u-card>
    <select-teacher
      v-model="currentSelectedTeacher"
      @save="assignTeacher"
    ></select-teacher>
    <GiveCoins></GiveCoins>
    <basic-modal
      :title="student.modalTitle"
      @save="confirmModal"
      @closeModal="cancleModal"
    >
    </basic-modal>
    <comment-modal
      :title="student.modalTitle"
      @save="confirmModal"
      @closeModal="cancleModal"
    >
      <template v-slot:comment>
        <textarea
          class="px-3 py-4"
          style="font-size:24px;width:100%;"
          name=""
          v-model="student.payloadData.comment"
          id=""
          rows="6"
        ></textarea>
      </template>
    </comment-modal>
  </div>
</template>

<script>
import moment from "moment";
import { BDropdown, BDropdownItem } from "bootstrap-vue";
import UCard from "@/components/common/UCard";
import SelectTeacher from "@/components/modals/SelectTeacher";
import UIconBtn from "@/components/common/UIconBtn";
import GiveCoins from "@/components/modals/GiveCoins";
import Loader from "@/components/Loader";
import BasicModal from "@/components/modals/BasicModal.vue";
import CommentModal from "@/components/modals/CommentModal.vue";

import { StudentsApi } from "@/api";

import { mapActions, mapMutations, mapGetters } from "vuex";
import { ADMIN } from "@/constants/roles";
import DeleteUserMixin from "@/mixins/delete-user.mixin";

export default {
  components: {
    UCard,
    SelectTeacher,
    UIconBtn,
    GiveCoins,
    BDropdown,
    BDropdownItem,
    Loader,
    BasicModal,
    CommentModal,
  },
  mixins: [DeleteUserMixin],
  data: () => ({
    currentSelectedTeacher: null,
    currentSelectedStudent: null,
    studentStatus: null,
    loading: false,
    commentProps: false,
    tableKey: 0,
    ModalMessage: " Are you sure to ",
    columns: [
      {
        text: "Name",
        value: "name",
        breakpoint: false,
      },
      {
        text: "Email",
        value: "email",
        breakpoint: false,
      },
      {
        text: "Progress",
        value: "Progress",
        breakpoint: false,
      },
      {
        text: "",
        value: "actions",
        breakpoint: false,
      },
    ],
    student: {
      payloadData: {},
      modalTitle: "",
      action: "",
      studentName: "",
    },
  }),
  computed: {
    ...mapGetters("Students", {
      items: "filteredStudentsList",
    }),
    ...mapGetters("Teachers", {
      teachers: "teachersList",
    }),
    ...mapGetters("Lessons", ["lessonsList"]),
  },
  methods: {
    ...mapActions("Auth", ["loginAsUser"]),
    ...mapActions("Users", ["deleteUser"]),
    ...mapActions("Students", ["fetchStudentsList"]),
    ...mapMutations("Students", ["RESET_STUDENTS_LIST"]),
    ...mapMutations("Coins", ["SET_STUDENT"]),
    activeStudent(item) {
      this.student.payloadData = {
        studentId: item.id,
        status: "active",
      };
      this.student.action = "active";
      this.student.modalTitle = `Are you sure to active ${item.name} ?`;
      this.$modal.show("confirm-modal");
    },
    deactiveStudent(item) {
      this.student.payloadData = {
        studentId: item.id,
        status: "inactive",
      };
      this.student.action = "inactive";
      this.student.modalTitle = `Are you sure to deactive ${item.name} ?`;
      this.$modal.show("confirm-modal");
    },
    callStudent(item) {
      this.student.payloadData = {
        id: item.id,
        calledDate: moment().format("YYYY-MM-DD HH:mm:ss"),
      };
      this.student.action = "callStudent";
      this.student.modalTitle = `Are you sure to call ${item.name} ?`;
      this.$modal.show("confirm-modal");
    },
    comment(item) {
      this.student.payloadData = {
        id: item.id,
        comment: item.comment,
      };
      this.student.action = "comment";
      this.student.modalTitle = `Add Comments for ${item.name} ?`;
      this.commentProps = true;
      this.$modal.show("comment-modal");
    },
    async confirmModal() {
      this.$modal.hide("confirm-modal");
      this.$modal.hide("comment-modal");
      this.loading = true;
      if (this.student.action === "active") {
        await StudentsApi.changeStudentStatus(this.student.payloadData);
      } else if (this.student.action === "inactive") {
        await StudentsApi.changeStudentStatus(this.student.payloadData);
      } else if (this.student.action === "callStudent") {
        await StudentsApi.callStudent(this.student.payloadData);
      } else if (this.student.action === "comment") {
        if (this.student.payloadData.comment !== "") {
          await StudentsApi.comment(this.student.payloadData);
        }
      }
      await this.fetchStudentsList(ADMIN);
      this.loading = false;
    },
    formatDate(e) {
      return e == null
        ? ""
        : moment(e, "YYYY-MM-DD HH:mm:ss").format("DD-MM-YYYY");
    },
    showGiveCoinsModal({ id, name }) {
      this.SET_STUDENT({ id, name });
      this.$modal.show("give-coins");
    },
    getTeacherName(id) {
      return this.teachers.filter((teacher) => teacher.id === id)[0].name;
    },
    onSelectTeachers(teacher) {
      console.log("selected teacher: ", teacher);
      this.currentSelectedTeacher = teacher;
    },
    openSelectTeacherModal(currentStudent) {
      this.currentSelectedStudent = currentStudent;

      if (currentStudent.teacher_id) {
        this.currentSelectedTeacher = { id: currentStudent.teacher_id };
      } else {
        this.currentSelectedTeacher = null;
      }

      this.$modal.show("select-teacher");
    },
    assignTeacher() {
      let teacherId = null;
      if (this.currentSelectedTeacher) {
        teacherId = this.currentSelectedTeacher.id;
      }
      StudentsApi.assignTeacher(this.currentSelectedStudent.id, teacherId).then(
        (response) => {
          this.currentSelectedStudent.teacher_id = response.data.teacher_id;
        }
      );
    },
    onLoginAsUserClick(user) {
      this.loginAsUser(user.id)
        .then(() => {
          this.$notify({
            title: "Welcome!",
            type: "success",
          });
        })
        .catch(({ message }) => {
          this.$notify({
            title: "Login error",
            text: message,
            type: "error",
          });
        });
    },
    getLessonName(id) {
      if (!id) return "";
      const lesson = this.lessonsList.find((lesson) => lesson.id === id);
      return lesson ? lesson.title : "";
    },
    cancleModal() {
      this.$modal.hide("confirm-modal");
      this.commentProps = false;
      this.$modal.hide("comment-modal");
    },
  },
  async mounted() {
    await this.fetchStudentsList(ADMIN);
    this.loading = false;
  },
  beforeDestroy() {
    this.RESET_STUDENTS_LIST();
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/vars";
@import "@/styles/mixins";
.calledDate {
  text-align: left;
  margin-left: 15px;
  margin-top: 10px;
  font-size: 22px;
}
.loader {
  position: inherit !important;
}
.inactiveStudentsBg {
  background-color: #d3d3d3 !important;
}

.avatar-wrap {
  border-radius: 50%;
  overflow: hidden;
  width: 40px;
  height: 40px;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

// tr:hover .grey-col {
//    color: #fff;
// }
.grey-col {
  color: $clr-grey;
}
.progress-col {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  min-width: 250px;
  font-weight: 500;
  &:not(:last-child) {
    margin-bottom: 7px;
  }
  &__name {
    margin-right: 10px;
  }
  &__progress {
    display: flex;
    &-mastered,
    &-known,
    &-unknown {
      display: flex;
      align-items: center;
      margin-right: 10px;
      span {
        margin-left: 5px;
        text-align: center;
        width: 30px;
        line-height: 30px;
        border-radius: 50%;
      }
    }
    &-mastered {
      color: blue;
      span {
        background-color: rgba(blue, 0.2);
      }
    }
    &-known {
      color: green;
      span {
        background-color: rgba(green, 0.2);
      }
    }
    &-unknown {
      color: red;
      span {
        background-color: rgba(red, 0.2);
      }
    }
  }
}
.actions-col {
  display: flex;
  justify-content: flex-end;
}

.login-as-icon-btn {
  position: relative;
  left: -2px;
}
.reward {
  width: 30px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  cursor: pointer;
  img {
    width: 100%;
  }
}
.qa-change-students-teacher-btn,
.qa-assign-students-teacher-btn {
  width: 100%;
}
@include media(">phone", "<=tablet") {
  .avatar-wrap {
    width: 24px;
    height: 24px;
    margin-right: 5px !important;
    img {
      width: 24px;
      height: 24px;
    }
  }
  .table-head {
    font-size: 11px;
  }
  .u-pl-13 {
    font-size: 11px;
    padding-left: 10px !important;
  }
  .grey-col {
    font-size: 10px;
    padding-left: 5px;
    word-break: break-word;
  }
  .u-pr-25.u-text-right {
    padding-right: 0 !important;
  }
}
</style>
