<template>
  <ContentContainer class="shuffle-lesson-view">
    <div class="shuffle-lesson-view__header">
      <BackBtn class="shuffle-lesson-view__back-btn"></BackBtn>
      <div class="u-text-h2">Lesson</div>

      <LessonTimer class="shuffle-lesson-view__timer" v-if="sliderMode && displayLessonTimer"/>
      <div class="shuffle-lesson-view__checkboxes" v-if="sliderMode && displayHidings">
        <UCheckbox 
          class="shuffle-lesson-view__checkbox" 
          :value="hideLessonImages"
          @input="UPDATE_HIDE_LESSON_IMAGE"
        >
          Hide Images
        </UCheckbox>
        <UCheckbox 
          class="shuffle-lesson-view__checkbox" 
          :value="hideLessonTranslations"
          @input="UPDATE_HIDE_LESSON_TRANSLATION"
        >
          Hide English
        </UCheckbox>
      </div>
      <WordsViewModeController
        class="teacher-check-lesson__words-view-mode-controller"
        v-model="sliderMode"
      ></WordsViewModeController>
    </div>

    <ShuffleWordsView
      class="shuffle-lesson-view__words-view"
      :slider-mode="sliderMode"
      :display-known="true"
      :display-all-words="displayAllWords"
      :default-active-tab="displayAllWords ? 4 : 2"
      :display-words-controls="true"
      :active-tab="activeTab"
      :display-tabs="displayTabs"
      @tab-change="onTabChange"
    ></ShuffleWordsView>

    <div class="shuffle-lesson-view__shuffle-btn-wrap" v-if="!sliderMode">
      <UBtn
        class="shuffle-lesson-view__shuffle-btn"
        size="x-large"
        width="352"
        @click="handleShuffle"
        :disabled="shuffleBottomEdge === null || shuffleTopEdge === null"
      >
        Shuffle
      </UBtn>
    </div>

    <div class="shuffle-lesson-view__player" v-if="!displayVoiceRecord">
      <UAudioPlayer :value="recordUrl" v-if="recordUrl"/>
    </div>
    <div class="shuffle-lesson-view__submit-row" v-if="displayVoiceRecord">
      <VoiceRecordSubmit
        @after-submit="onAfterSubmit"
      ></VoiceRecordSubmit>
    </div>
    <div class="shuffle-lesson-view__log-history">
      <LessonLogHistory v-if="sliderMode && displayLogs"/>
    </div>
    <LessonResult/>

  </ContentContainer>
</template>

<script>
import ContentContainer from "@/components/common/ContentContainer";
import WordsViewModeController from "@/components/lessons/WordsViewModeController";
import LessonTimer from "@/components/lessons/LessonTimer";
import BackBtn from "@/components/common/BackBtn";
import ShuffleWordsView from "@/components/lessons/ShuffleWordsView";
import VoiceRecordSubmit from "@/components/partials/PassLesson/VoiceRecordSubmit";
import UAudioPlayer from "@/components/common/UAudioPlayer";
import UCheckbox from '@/components/common/UCheckbox.vue';
import LessonResult from '@/components/modals/LessonResult';
import LessonLogHistory from "@/components/lessons/LessonLogHistory";

import { mapActions, mapGetters, mapMutations } from 'vuex';
// import { SHUFFLED_WORDS } from "@/constants/words";

export default {
  components: {
    BackBtn,
    ContentContainer,
    WordsViewModeController,
    LessonTimer,
    ShuffleWordsView,
    VoiceRecordSubmit,
    UAudioPlayer,
    UCheckbox,
    LessonResult,
    LessonLogHistory,
  },
  props: {
    displayVoiceRecord: {
      type: Boolean,
      default: true,
    },
    displayLessonTimer: {
      type: Boolean,
      default: false,
    },
    displayHidings: {
      type: Boolean,
      default: false,
    },
    displayLogs: {
      type: Boolean,
      default: false,
    },
    displayTabs: {
      type: Boolean,
      default: true,
    },
    displayAllWords: {
      type: Boolean,
      default: false,
    },
    shouldFetchLesson: {
      type: Boolean,
      default: true
    }
  },
  data: () => ({
    sliderMode: false,
    activeTab: 0,
    hideImages: false,
    hideTranslation: false,
  }),
  computed: {
    ...mapGetters('Words', ['shuffleBottomEdge', 'shuffleTopEdge']),
    ...mapGetters('Auth', ['userRole']),
    ...mapGetters('Lessons', ['lesson', 'hideLessonImages', 'hideLessonTranslations']),
    recordUrl(){
      let recordUrl = null;
      if(this.lesson !== null && this.lesson.records && this.lesson.records.length){
        recordUrl = this.lesson.records[0].url;
      }
      return recordUrl;
    }
  },
  methods: {
    ...mapActions('Lessons', ['sendRecord', 'fetchLesson']),
    ...mapMutations('Lessons', ['RESET_LESSON_TIME', 'UPDATE_HIDE_LESSON_IMAGE', 'UPDATE_HIDE_LESSON_TRANSLATION']),
    ...mapMutations('Words', {
      SHUFFLE: 'SHUFFLE',
      RESET_WORDS: 'RESET',
      SET_TAB: 'SET_TAB',
      RESET_COUNT_INDEX_FOR_TIMER: 'RESET_COUNT_INDEX_FOR_TIMER'
    }),
    handleShuffle(){
      this.SHUFFLE();
      // this.sliderMode = true;
    },
    onAfterSubmit(){
      this.$router.push({ name: 'student-lessons-all' });
    },
    onTabChange(tabId){
      this.SET_TAB(tabId);
    }
  },
  mounted(){
    if(this.shouldFetchLesson)
      this.fetchLesson({
        role: this.userRole,
        id: this.$route.params.id,
      })
        .catch(({ message }) => {
          this.$notify({
            title: 'Lesson load error',
            text: message,
            type: 'error'
          });
        });
  },
  beforeDestroy() {
    this.RESET_WORDS();
    this.RESET_LESSON_TIME();
    this.RESET_COUNT_INDEX_FOR_TIMER();
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/mixins';

.shuffle-lesson-view{
  &__header{
    position: relative;
    display: flex;
    flex-wrap: wrap;
  }
  &__back-btn{
    margin-right: 20px;
  }
  &__words-view{
    margin-top: 30px;
    margin-bottom: 30px;
  }
  &__checkboxes {
    position: absolute;
    right: 125px;
    top: 20px;
  }
  &__checkbox {
    margin-right: 20px;
  }
  &__shuffle-btn-wrap{
    display: flex;
    justify-content: center;

    margin-bottom: 30px;
  }

  &__player{
    display: flex;
    justify-content: center;
  }
  &__log-history {
    margin-top: 100px;
  }
}

@include media(">phone", "<=tablet") {
  .shuffle-lesson-view{
    &__back-btn{
      margin-top: 29px;
      margin-left: 10px;
      margin-bottom: 30px;
      font-size: 14px;
      width: 100%;

    }
    &__header{
      margin-bottom: 30px;
      .u-text-h2{
        padding-left: 14px;
      }
    }
  }
}
</style>
