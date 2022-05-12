<template>
  <div>
    <u-card elevation="3">
      <table class="u-data-table is-striped">
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
          <tr v-for="item in items" :key="item.id">
            <td class="u-pl-13">
              <div class="u-flex is-align-center">
                <div class="avatar-wrap u-mr-6">
                  <img :src="item.avatar" alt="" />
                </div>
                {{ item.name }}
              </div>
            </td>
            <td class="grey-col">{{ item.email }}</td>
            <td class="grey-col">{{ item.phone }}</td>
            <td class="u-pr-25 u-text-right">
              <div class="actions-col actions-cell">
                <UBtn
                  class="u-mx-1 qa-open-add-lesson-popup-btn"
                  color="primary"
                  size="small"
                  @click="openAddLessonPopup(item)"
                >
                  Add lesson
                </UBtn>

                <!-- Dropdown -->
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
                    <UIconBtn
                      class="u-mx-1 qa-login-as-teacher-btn login-as-icon-btn"
                      icon="icon-enter"
                      icon-hover-color="blue"
                      @click.native="onLoginAsUserClick(item)"
                      title="Login as user"
                    >
                    </UIconBtn>
                  </b-dropdown-item>
                  <b-dropdown-item>
                    <UIconBtn
                      class="u-mx-1 qa-edit-teacher-btn"
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
                      class="u-mx-1 qa-delete-teacher-btn"
                      icon="icon-trash"
                      icon-color="grey"
                      icon-hover-color="blue"
                      bg-hover-color="white"
                      hoverable
                      @click.native="deleteUserAlert(item)"
                    >
                    </UIconBtn>
                  </b-dropdown-item>
                </b-dropdown>
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

    <select-lesson
      v-model="selectedLessons"
      @save="addTeacherToLesson"
      multiple
    >
    </select-lesson>
  </div>
</template>

<script>
import { BDropdown, BDropdownItem } from "bootstrap-vue";
import UCard from "@/components/common/UCard";
import UIconBtn from "@/components/common/UIconBtn";
import SelectLesson from "@/components/modals/SelectLesson";

import { UsersApi } from "@/api";
import { mapActions, mapGetters, mapMutations } from "vuex";
import { ADMIN } from "@/constants/roles";

import DeleteUserMixin from "@/mixins/delete-user.mixin";

export default {
  components: {
    UCard,
    SelectLesson,
    UIconBtn,
    BDropdown,
    BDropdownItem,
  },
  mixins: [DeleteUserMixin],
  data: () => ({
    selectedTeacher: null,
    selectedLessons: null,
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
        text: "Phone",
        value: "phone",
        breakpoint: false,
      },
      {
        text: "",
        value: "actions",
        breakpoint: false,
      },
    ],
  }),
  computed: {
    ...mapGetters("Teachers", {
      items: "filteredTeachersList",
    }),
  },
  methods: {
    ...mapActions("Auth", ["loginAsUser"]),
    ...mapActions("Users", ["deleteUser"]),
    ...mapActions("Teachers", ["fetchTeachersList"]),
    ...mapMutations("Teachers", ["RESET_TEACHERS_LIST"]),
    openAddLessonPopup(item) {
      this.selectedTeacher = item;
      this.selectedLessons = [...item.lessons];
      this.$modal.show("select-lesson");
    },
    addTeacherToLesson() {
      UsersApi.addAccessToLesson(this.selectedTeacher.id, {
        lessons: this.selectedLessons.map((item) => item.id),
      }).then((response) => {
        this.selectedTeacher.lessons = response.data.lessons;
      });
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
  },
  mounted() {
    this.fetchTeachersList(ADMIN);
  },
  beforeDestroy() {
    this.RESET_TEACHERS_LIST();
  },
};
</script>

<style lang="scss">
.actions-cell {
  .dropdown-menu {
    min-width: 2rem;
  }
  .dropdown-toggle {
    background: linear-gradient(227.7deg, #ecbf8c 32.81%, #dfc188 69.13%);
    border: none;
  }
}

.u-data-table {
  tr:hover {
    .b-dropdown {
      svg {
        fill: #2c4cc1;
      }
    }
  }
}
</style>

<style lang="scss" scoped>
@import "@/styles/vars";
@import "@/styles/mixins";

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

tr:hover .grey-col {
  color: #fff;
}
.grey-col {
  color: $clr-grey;
}

.edit-user-btn {
  height: 40px;
  width: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 15px;
  svg {
    width: 18px;
    height: 18px;
  }
  &:hover {
    background-color: #fff;
    svg {
      fill: $clr-blue;
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

.u-data-table tr:hover svg {
  fill: #2c4cc1;
}

.btn.dropdown-toggle.btn-secondary {
  background: #000;
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
  .qa-delete-teacher-btn {
    padding-right: 5px;
  }
}
</style>
