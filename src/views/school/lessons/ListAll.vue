<template>
  <div>
    <div class="u-container u-ml-auto u-mr-auto u-pt-15">
      <div class="u-row">
        <div class="u-col-7 lessons-wrap">
          <div class="u-flex is-align-center lessons--head">
            <div class="u-text-h1 u-mr-6">Lessons</div>
            <UBtn
              :to="{ name: 'school-lessons-create' }"
              id="create_lesson_link"
              class="add-button-school"
              size="x-large"
              color="blue"
              :width="deviceWidth > 1250 ? 251 : 120"
            >
              Add lesson
            </UBtn>
          </div>
        </div>
        <div class="u-col-5">
          <!-- search -->
        </div>
        <div class="u-col-12 list--content">
          <u-card class="table-card u-mt-10 u-mb-25">
            <table class="u-data-table is-striped">
              <colgroup>
                <col v-for="column in columns" :key="column.value" />
              </colgroup>
              <thead>
                <tr>
                  <template v-for="(column, index) in columns">
                    <th
                      v-if="index == 1"
                      :key="index"
                      class="u-text-center table--head"
                    >
                      {{ column.text }}
                    </th>
                    <th v-else :key="index" class="u-text-center table--head">
                      {{ column.text }}
                    </th>
                  </template>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="item in items"
                  :key="item.id"
                  :class="{ 'lesson-item_hidden': !!item.hidden }"
                  :style="{ backgroundColor: !item.ownLesson ? '#d3d3d3' : '' }"
                >
                  <td class="u-pl-13 u-font-weight-light list--item--title">
                    <svg
                      v-svg
                      symbol="icon-file"
                      size="0 0 22 22"
                      role="presentation"
                    ></svg>
                    {{ item.title }}
                  </td>
                  <td class="u-font-weight-light u-text-center pages-col">
                    {{ item.words_count }} pages
                  </td>
                  <td class="u-text-right u-pr-25 list--item--last">
                    <div class="u-flex is-justify-end">
                      <UBtn
                        class="u-mr-5 school-view-lesson-btn"
                        size="small"
                        color="blue"
                        width="220"
                        outlined
                        :to="{
                          name: 'school-lessons-edit',
                          params: { id: item.id },
                        }"
                        v-if="item.ownLesson"
                      >
                        <span class="u-font-weight-regular"> Edit Lesson </span>
                      </UBtn>
                      <UBtn
                        class="u-mr-5 school-view-lesson-btn"
                        size="small"
                        color="gray"
                        width="220"
                        v-if="!item.ownLesson"
                      >
                        <span class="u-font-weight-regular">
                          Admin Assigned
                        </span>
                      </UBtn>
                      <UBtn
                        class="u-mx-1 qa-school-add-teacher-to-lesson"
                        size="small"
                        color="primary"
                        @click="openSelectTeacherModal(item)"
                      >
                        <span class="u-font-weight-regular"
                          >Add to teacher</span
                        >
                      </UBtn>

                      <UIconBtn
                        class="u-mx-1 qa-hide-lesson-btn"
                        icon="icon-eye2"
                        icon-color="grey"
                        icon-hover-color="blue"
                        bg-hover-color="white"
                        hoverable
                        @click.native="hideLessonToggleAlert(item)"
                        v-if="item.ownLesson"
                      >
                      </UIconBtn>
                      <UIconBtn
                        class="u-mx-1 qa-delete-lesson-btn"
                        icon="icon-trash"
                        icon-color="grey"
                        icon-hover-color="blue"
                        bg-hover-color="white"
                        hoverable
                        @click.native="deleteLessonAlert(item)"
                        v-if="item.ownLesson"
                      >
                      </UIconBtn>
                      <UIconBtn
                        class="u-mx-1 qa-hide-lesson-btn"
                        icon=""
                        icon-color=""
                        icon-hover-color=""
                        bg-hover-color=""
                        v-if="!item.ownLesson"
                      >
                      </UIconBtn>
                      <UIconBtn
                        class="u-mx-1 qa-delete-lesson-btn"
                        icon=""
                        icon-color=""
                        icon-hover-color=""
                        bg-hover-color=""
                        v-if="!item.ownLesson"
                      >
                      </UIconBtn>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </u-card>
        </div>
      </div>
    </div>

    <select-teacher
      v-model="selectedTeachers"
      @save="shareLessonToTeacher"
      multiple
      type="school"
    ></select-teacher>
  </div>
</template>

<script>
import { LessonsApi } from "@/api";
import { mapActions, mapGetters } from "vuex";
import { SCHOOL } from "@/constants/roles";
import UCard from "@/components/common/UCard";
import UIconBtn from "@/components/common/UIconBtn";

import SelectTeacher from "@/components/modals/SelectTeacher";

export default {
  components: {
    UCard,
    SelectTeacher,
    UIconBtn,
  },
  data: () => ({
    selectedTeachers: [],
    selectedLesson: null,
    columns: [
      {
        text: "Name",
        value: "name",
        breakpoint: false,
      },
      {
        text: "Lessons",
        value: "pages",
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
    ...mapGetters("Lessons", {
      items: "lessonsList",
    }),
    deviceWidth() {
      const vw = Math.max(
        document.documentElement.clientWidth || 0,
        window.innerWidth || 0
      );
      return vw;
    },
  },
  methods: {
    ...mapActions("Lessons", [
      "deleteLessonForSchool",
      "hideLessonForSchool",
      "fetchLessonList",
    ]),
    shareLessonToTeacher() {
      LessonsApi.addAccessToSchool(this.selectedLesson.id, {
        users: this.selectedTeachers.map((item) => item.id),
      }).then((response) => {
        this.selectedLesson.teachers = response.data.teachers;
      });
    },
    openSelectTeacherModal(lesson) {
      this.selectedLesson = lesson;
      if (lesson.teachers) {
        this.selectedTeachers = [...lesson.teachers];
      }
      this.$modal.show("select-teacher");
    },
    hideLessonToggleAlert(lesson) {
      this.selectedLesson = { ...lesson };
      let title = this.selectedLesson.hidden
        ? "Are you sure you want to unhide lesson?"
        : "Are you sure you want to hide lesson?";
      this.$alert(
        {
          title: title,
          showCancelButton: true,
          confirmButtonText: "Yes",
          cancelButtonText: "No",
          onConfirm: this.onConfirmHideLessonToggle,
        },
        {
          width: this.deviceWidth > 1250 ? "1250px" : "100%",
          shiftX: this.deviceWidth > 1250 ? "50%" : 0,
        }
      );
    },
    onConfirmHideLessonToggle() {
      console.log(this.selectedLesson);
      this.hideLessonForSchool({
        lessonId: this.selectedLesson.id,
      })
        .then(() => {
          let message = this.selectedLesson.hidden
            ? "Lesson was successfully unhidden"
            : "Lesson was successfully hidden";
          this.$notify({
            title: message,
            type: "success",
          });
          this.selectedLesson = null;
        })
        .catch(({ message }) => {
          this.$notify({
            title: "Error",
            text: message,
            type: "error",
          });
        });
    },
    deleteLessonAlert(lesson) {
      this.selectedLesson = lesson;
      this.$alert(
        {
          title: "Are you sure you want to delete lesson?",
          showCancelButton: true,
          confirmButtonText: "Yes",
          cancelButtonText: "No",
          onConfirm: this.onConfirmDeleteLesson,
        },
        {
          width: this.deviceWidth > 1250 ? "1250px" : "100%",
          shiftX: this.deviceWidth > 1250 ? "50%" : 0,
        }
      );
    },
    onConfirmDeleteLesson() {
      this.deleteLessonForSchool({
        lessonId: this.selectedLesson.id,
      })
        .then(() => {
          this.selectedLesson = null;
          this.$notify({
            title: "Lesson successfully deleted",
            type: "success",
          });
        })
        .catch(({ message }) => {
          this.$notify({
            title: "Error",
            text: message,
            type: "error",
          });
        });
    },
  },
  mounted() {
    this.fetchLessonList(SCHOOL);
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/vars";
@import "@/styles/mixins";

tr:hover {
  .pages-col {
    color: #fff;
  }
  .school-view-lesson-btn {
    color: #fff;
    &:hover {
      background-color: rgba(255, 255, 255, 0.09);
    }
  }
}
.pages-col {
  color: $clr-grey;
}

.lesson-item {
  &_hidden {
    opacity: 0.3;
  }
}

@include media(">phone", "<=tablet") {
  .u-col-7.lessons-wrap {
    max-width: unset;
    flex: auto;
  }
  .u-text-h1.u-mr-6 {
    font-size: 26px;
    line-height: 30px;
  }
  .lessons--head {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
  }
  .list--content {
    padding: 0;
  }
  .table--head {
    font-size: 10px;
  }
  .list--item--title {
    display: flex;
    align-items: center;
    padding-left: 15px !important;
    font-size: 11px;
  }
  .pages-col {
    font-size: 9px;
  }
  .list--item--last {
    padding-right: 0 !important;
  }
  .add-button-school {
    width: 154px;
    height: 34px;
  }
  .school-view-lesson-btn {
    margin-right: 0 !important;
  }
  .qa-delete-lesson-btn {
    margin-right: 8px !important;
  }
}
</style>
