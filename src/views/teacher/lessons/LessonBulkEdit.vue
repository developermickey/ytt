<template>
  <div>
    <div class="mt-5" v-if="loading">
      <Loader class="loader" :show="loading" :fixedPosition="false" />
    </div>
    <div v-else class="px-5">
      <ContentContainer class="view-lesson">
        <div class="view-lesson__title-line">
          <BackBtn class="view-lesson__back-button"></BackBtn>
          <div class="u-text-h1">{{ lesson.title }}</div>
          <WordsViewModeController
            class="teacher-edit-lesson__words-view-mode-controller"
            v-model="sliderMode"
          ></WordsViewModeController>
        </div>
        <UTabs
          class="teacher-edit-lesson__tabs"
          :disabled="false"
          v-model="activeTab"
        >
          <UTab :label="`All Words (${lesson.words_count})`">
            <WordsView
              :slider-mode="sliderMode"
              :status="'allWords'"
              :display-words-controls="true"
            ></WordsView>
          </UTab>
        </UTabs>
      </ContentContainer>

      <u-card class="p-4 my-5">
        <h2 class="mb-4">Student List</h2>
        <div class="row">
          <div
            class="col col-xs-12 col-md-3 my-3"
            v-for="(student, index) in studentList"
            :key="index"
          >
            <div class="d-flex align-items-center">
              <input
                type="checkbox"
                class="checkbox"
                v-model="selectedStudentsId"
                :value="student.id"
              />
              <div class="ml-2">{{ student.name }}</div>
            </div>
          </div>
        </div>
        <!-- selected Student Ids:
        {{ selectedStudentsId }} -->
      </u-card>

      <div class="text-center my-5">
        <UBtn @click="bulkEdit">
          Save
        </UBtn>
      </div>
    </div>
  </div>
</template>

<script>
import { LessonsApi } from "@/api";
import Loader from "@/components/Loader";
import UCard from "@/components/common/UCard";
import { mapActions, mapGetters } from "vuex";
import BackBtn from "@/components/common/BackBtn";
import ContentContainer from "@/components/common/ContentContainer";
import WordsView from "@/components/lessons/WordsView";
import UTabs from "@/components/common/UTabsIndepended/UTabs";
import UTab from "@/components/common/UTabsIndepended/UTab";
import WordsViewModeController from "@/components/lessons/WordsViewModeController";
import UBtn from "@/components/common/UBtn.vue";
import axios from "axios";
export default {
  async mounted() {
    try {
      await this.getStudentsList();
      await this.fetchWords();
      this.loading = false;
    } catch (error) {
      this.loading = false;
    }
  },
  data() {
    return {
      loading: true,
      studentList: [],
      selectedStudentsId: [],
      wordsList: [],
      selectedWords: [],
      sliderMode: false,
      activeTab: 0,
    };
  },
  components: {
    Loader,
    UCard,
    BackBtn,
    ContentContainer,
    WordsView,
    UTabs,
    UTab,
    WordsViewModeController,
    UBtn,
  },
  methods: {
    ...mapActions("Lessons", ["fetchLesson"]),
    async getStudentsList() {
      let self = this;
      await LessonsApi.getPage({}, "teacher").then((response) => {
        const userId = JSON.parse(localStorage.getItem("user")).id;

        let allStudent = response.data.find(
          (x) => x.id == self.$route.params.id
        ).students;

        console.log(allStudent);
        // allStudent.map((element) => {
        //   console.log(element.teacher_id);
        // });

        // debugger;

        self.studentList = allStudent.filter((x) => x.teacher_id === userId);
      });
    },

    async fetchWords() {
      await this.fetchLesson({
        role: this.userRole,
        id: this.$route.params.id,
      });
    },

    async bulkEdit() {
      const allWords = this.allWords.map((item) => {
        var data = {
          word_id: item.id,
          status: item.status,
        };
        return data;
      });

      let words = allWords.filter((element) => element.status !== undefined);
      if (words.length > 0 && this.selectedStudentsId.length > 0) {
        this.loading = true;
        const url = `teacher/lessons/${this.$route.params.id}/bulk-update`;
        const payload = {
          student_ids: this.selectedStudentsId,
          student_words: words,
        };
        let self = this;
        axios
          .post(url, payload)
          .then(() => {
            self.$router.push({ name: "teacher-lessons-all" });
            self.loading = false;
          })
          .catch((err) => {
            console.log(err);
            this.loading = false;
          });
      }
    },
  },
  computed: {
    ...mapGetters("Auth", ["userRole", "user"]),
    ...mapGetters("Words", ["allWords"]),
    ...mapGetters("Lessons", ["lesson"]),
  },
};
</script>

<style scoped>
.loader {
  position: inherit !important;
}
.checkbox {
  height: 20px;
  width: 20px;
  cursor: pointer;
}
</style>
<style lang="scss">
@import "@/styles/vars";
@import "@/styles/mixins";

.view-lesson {
  &__title-line {
    display: flex;
    margin-bottom: 58px;
  }
  &__back-button {
    margin-right: 60px;
  }
  &__lesson-words-list {
    margin-bottom: 40px;
  }
  &__download {
    display: flex;
    justify-content: center;
  }
  &__download-text {
    font-size: 24px;
    font-weight: 500;
  }
  &__download-icon {
    fill: none;
    stroke: $clr-grey2;
    width: 25px;
    height: 27px;
    margin-right: 15px;
  }
}
@include media(">phone", "<=tablet") {
  .u-text-h1 {
    font-size: 26px;
    line-height: 30px;
  }
  .view-lesson__title-line {
    padding-top: 40px;
    margin-bottom: 30px;
  }
}
</style>
