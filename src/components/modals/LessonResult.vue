<template>
  <modal 
    name="lesson-result" 
    :width="deviceWidth" 
    height="auto" 
    classes="u-modal lesson-result" 
    scrollable
    @before-close="resetTimer"
  >
    <u-card class="u-modal-card u-px-24 u-pt-24 u-pb-15">
      <div class="lesson-result__cross" @click="hideModal">
        <svg
          v-svg
          symbol="icon-cross"
          size="0 0 72 72"
        />
      </div>
      <div class="lesson-result__title">
        Logged Result
      </div>
      <div class="lesson-result__log">
        <div class="lesson-result__log-item">
          <div class="lesson-result__log-item-icon" >
            <img src="@/assets/svg/quotes.svg">
          </div>
          <div>
            <span class="lesson-result__log-item-count">{{ words }}</span>
            <span class="lesson-result__log-item-text">
              words <br>
              passed
            </span>
          </div>
        </div>
        <div class="lesson-result__log-item lesson-result__log-time">
          <div class="lesson-result__log-item-icon" >
            <img src="@/assets/svg/timer.svg">
          </div>
          <div>
            <span class="lesson-result__log-item-count">{{ lessonTime }}</span>
            <span class="lesson-result__log-item-text">seconds</span>
          </div>
        </div>
        <div class="lesson-result__log-item lesson-result__log-per-minute">
          <div class="lesson-result__log-item-icon" >
            <img src="@/assets/svg/tasks.svg">
          </div>
          <div>
            <span class="lesson-result__log-item-count">{{ wordsPerMinute }}</span>
            <span class="lesson-result__log-item-text">
              words <br>
              per minute
            </span>
          </div>
        </div>
      </div>
      <div class="lesson-result__submit">
        <UBtn
          color="primary"
          size="x-large"
          width="262"
          @click="saveResult"
        >
          Save
        </UBtn>
      </div>

    </u-card>
  </modal>
</template>

<script>
import { LessonsApi } from '@/api';
import { mapMutations, mapGetters } from 'vuex';
import UCard from '@/components/common/UCard.vue';
import * as moment from 'moment';


export default {
  components: {
    UCard,
  },
  computed: {
    ...mapGetters('Lessons', ['lessonTime', 'lesson']),
    ...mapGetters('Students', ['student']),
    ...mapGetters('Auth', { teacher: 'user' }),
    ...mapGetters('Words', { words: 'totalWordsCountForTimer'}),
    wordsPerMinute(){
      let mins = this.lessonTime/60;
      return Math.round(this.words/mins)
    },
    deviceWidth(){
      const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
      return vw > 1250 ? '1250px' : '100%'
    }
  },
  methods: {
    ...mapMutations('Words', ['RESET_COUNT_INDEX_FOR_TIMER']),
    ...mapMutations('Lessons', ['RESET_LESSON_TIME']),
    saveResult() {
      let dateNow = Date.now();
      const date = moment(dateNow).format('YYYY-MM-DD');
      const end = moment(dateNow).format('HH:mm:ss');
      const start = moment(dateNow - this.lessonTime * 1000).format('HH:mm:ss');

      const data = {
          date: date,
          time_start: start,
          time_end: end,
          duration: this.lessonTime.toString(),
          word_count: this.words.toString(),
          student_id: this.student.id,
          teacher_id: this.teacher.id,
          lesson_id: this.lesson.id
      }

      LessonsApi.addLessonLog(data)
      .then(() => {
        this.$notify({
          title: 'Lesson log sent',
          type: 'success'
        });

        this.hideModal();
      })
      .catch(({ message }) => {
        this.$notify({
          title: 'Lesson log sending error',
          text: message,
          type: 'error'
        });
      });
    },
    hideModal(){
      this.$modal.hide('lesson-result');
    },
    resetTimer() {
      this.RESET_LESSON_TIME();
      this.RESET_COUNT_INDEX_FOR_TIMER();
    }
  },
}
</script>

<style lang="scss">
@import '@/styles/vars';
@import '@/styles/mixins';
.lesson-result {
  &__title {
    font-family: Poppins, sans-serif;
    font-weight: 300;
    font-size: 48px;
    line-height: 72px;
    text-align: center;
    color: change-color(black, $alpha: 0.8);
  }

  &__log {
    display: flex;
    justify-content: space-around;

    &-item {
      display: flex;
      align-items: center;
      padding-top: 30px;
      div {
        display: flex;
        flex-direction: column;
      }
      &-icon {
        background: #f5f5f5;
        height: 80px;
        width: 80px;
        border-radius: 50%;
        margin-right: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        img{
          height: 45px;
        }
      }
      &-count {
        font-weight: bold;
        font-size: 34px;
        line-height: 46px;
        color: $clr-blue;
      }
    }

  }

  &__submit {
    margin-top: 44px;
    display: flex;
    justify-content: center;
  }
  &__cross {
    position: absolute;
    top: 38px;
    right: 58px;
    cursor: pointer;
  }
}

@include media(">phone", "<=tablet") {
  .lesson-result {
    .u-modal-card {
      padding: 45px 35px !important;
    }
    &__cross {
      svg {
        width: 20px;
        height: 20px;
      }
      top: 16px;
      right: 16px;
    }
    &__title {
      font-size: 28px;
    }
    
    &__field-label {
      font-size: 16px;
    }
    &__preview {
      padding: 0;
      font-size: 18px;
      &-coin {
        width: 40px;
        height: 40px;
        font-size: 17px;
      }
    }
  }
}
</style>
