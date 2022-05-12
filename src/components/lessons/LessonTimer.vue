<template>
  <div class="lesson-timer">
    <div class="lesson-timer__icon"></div>
    <div 
      class="lesson-timer__btn"
      :class="{'lesson-timer__btn_active': lessonTimerIsActive}"
      @click="toggleTimer"
    >
      <div v-if="!lessonTimerIsActive">
        <svg class="lesson-timer__btn-play" width="10" height="12" viewBox="0 0 10 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0.333984 0L9.66732 6L0.333984 12V0Z" fill="#2B4BBE"/>
        </svg>
        <span>Start</span>
      </div>
      <div v-else>
        <svg class="lesson-timer__btn-pause"  width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 0H0V10H10V0Z" fill="white"/>
        </svg>
        
        <span>Stop</span>
      </div>
      
    </div>
    <div class="lesson-timer__status">
      <span id="mins">{{ minutes }}:</span>
      <span id="seconds">{{ seconds }}</span>
      <span>s</span>
    </div>
  </div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex';
export default {
  name: 'LessonTimer',
  computed: {
    ...mapGetters('Lessons', ['lessonTimerIsActive', 'lessonTime']),
    minutes() {
      let val = Math.floor(this.lessonTime/60);
      if(val <= 9){
        val = "0" + val;
      }
      return val;
    },
    seconds() {
      let val = this.lessonTime % 60;
      if(val <= 9){
        val = "0" + val;
      }
      return val;
    }
  },
  methods: {
    ...mapActions('Lessons', ['toggleLessonTimer']),
    toggleTimer() {
      this.toggleLessonTimer();
      if (!this.lessonTimerIsActive) {
        this.$modal.show('lesson-result');
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/vars';
.lesson-timer {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: auto;
  &__icon {
    background-image: url('~@/assets/svg/timer.svg');
    width: 33px;
    height: 40px;
  }
  &__btn {
    background: #FFFFFF;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 30px;
    width: 120px;
    padding: 15px 30px;
    box-sizing: border-box;
    border: 1px solid $clr-blue;
    border-radius: 30px;
    cursor: pointer;
    user-select: none;
    span {
      margin-left: 7px;
    }
    &_active {
      background: $clr-blue;
      color: #fff;
    }
  }
  &__status {
    font-family: monospace;
    font-weight: bold;
    color: $clr-blue;
  }
}
</style>