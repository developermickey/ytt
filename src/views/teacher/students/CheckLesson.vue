<template>
  <ContentContainer>
    <div class="teacher-check-lesson">

      <div class="teacher-check-lesson__header">
        <BackBtn class="teacher-check-lesson__back-btn" label="Back"></BackBtn>
        <div class="u-text-h2">Edit lesson</div>

        <WordsViewModeController
          class="teacher-check-lesson__words-view-mode-controller"
          v-model="sliderMode"
        ></WordsViewModeController>
      </div>

      <UTabs
        class="teacher-check-lesson__tabs"
        :disabled="false"
        v-model="activeTab"
      >
        <UTab :label="`Known words (${knownWords.length})`">
          <WordsView
            :slider-mode="sliderMode"
            :status="'known'"
            :display-words-controls="true"
          ></WordsView>
        </UTab>
        <UTab :label="`Unknown words (${unknownWords.length})`">
          <WordsView
            :slider-mode="sliderMode"
            :status="'unknown'"
            :display-words-controls="true"
          ></WordsView>
        </UTab>
        <UTab :label="`Mastered words (${masteredWords.length})`">
          <WordsView
            :slider-mode="sliderMode"
            :status="'mastered'"
            :display-words-controls="true"
          ></WordsView>
        </UTab>
      </UTabs>

      <UAudioPlayer
        v-if="recordUrl"
        class="teacher-check-lesson__audio-player"
        :value="recordUrl">
      </UAudioPlayer>

      <div class="teacher-check-lesson__controls">
        <UBtn
          class="teacher-check-lesson__control-btn"
          color="success"
          size="x-large"
          width="245"
          :loading="completeBtnLoading"
          :disabled="saveBtnLoading || completeBtnLoading"
          @click="callAction('complete')"
        >
          Complete
        </UBtn>
        <UBtn
          class="teacher-check-lesson__control-btn"
          color="error"
          size="x-large"
          width="245"
          :loading="saveBtnLoading"
          :disabled="saveBtnLoading || completeBtnLoading"
          @click="callAction('save')"
        >
          Save
        </UBtn>
      </div>

    </div>
  </ContentContainer>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
// eslint-disable-next-line no-unused-vars
import { STUDENT, TEACHER } from '@/constants/roles';

import WordsView from "@/components/lessons/WordsView";
import ContentContainer from "@/components/common/ContentContainer";
import WordsViewModeController from "@/components/lessons/WordsViewModeController";

import UTabs from '@/components/common/UTabsIndepended/UTabs';
import UTab from '@/components/common/UTabsIndepended/UTab';
import UAudioPlayer from "@/components/common/UAudioPlayer";
import BackBtn from "@/components/common/BackBtn";

export default {
  data: () => ({
    activeTab: 0,
    sliderMode: false,
  }),
  components: {
    ContentContainer,
    WordsView,
    UTabs,
    UTab,
    BackBtn,
    UAudioPlayer,
    WordsViewModeController,
  },
  computed: {
    ...mapGetters('Lessons', {
      lesson: 'lesson',
      completeBtnLoading : 'loading',
    }),
    ...mapGetters('Words', {
      saveBtnLoading : 'loading',
      knownWords: 'knownWords',
      unknownWords: 'unknownWords',
      masteredWords: 'masteredWords',
    }),
    recordUrl(){
      let recordUrl = null;

      if(this.lesson !== null && this.lesson.records && this.lesson.records.length)
        recordUrl = this.lesson.records[0].url;

      return recordUrl;
    }
  },
  methods: {
    ...mapActions('Lessons', [
      'fetchStudentsLesson',
      'completeLesson',
    ]),
    ...mapActions('Words', [
      'updateStudentsWords'
    ]),
    callAction(action){
      let actionFunc;
      if(action ==='save'){
        actionFunc = this.updateStudentsWords;
      }
      else{
        actionFunc = this.completeLesson;
      }

      actionFunc({
        studentId: this.$route.params.studentId,
        lessonId: this.$route.params.lessonId,
        isLessonCheck: true,
      })
      .then(() => {
        this.$notify({
          title: 'Lesson saved.',
          type: 'success'
        });
        this.redirect();
      })
      .catch(({ message }) => {
        this.$notify({
          title: 'Lesson save error',
          text: message,
          type: 'error'
        });
      })
      .then();
    },
    redirect(){
      this.$router.push({
        name: 'teacher-students-lesson-list',
        params: { id: this.$route.params.studentId }
      })
    }
  },
  mounted(){
    this.fetchStudentsLesson({
      studentId: this.$route.params.studentId,
      lessonId: this.$route.params.lessonId,
    });
  }

}
</script>

<style lang="scss">
.teacher-check-lesson{
  &__header{
    display: flex;
    align-items: center;
    margin-bottom: 20px;
  }
  &__words-view-mode-controller{
    margin-left: auto;
  }
  &__back-btn{
    margin-right: 50px;
  }
  &__tabs{
    margin-bottom: 38px;
    .u-tabs__header{
      margin-bottom: 20px;
    }
  }

  &__audio-player{
    margin-bottom: 20px;
    display: flex;
    justify-content: center;
  }

  &__controls{
    display: flex;
    justify-content: center;
  }
  &__control-btn{
    margin-right: 10px;
    margin-left: 10px;
  }
}
</style>
