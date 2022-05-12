<template>
  <UCard class="words-slider" v-if="words.length">
    <div class="words-slider__inner">
      <div class="words-slider__list" ref="wordsSliderList">
        <img class="words-slider__slide_plug" :src="currentSlide.image_url" alt="">
        <img class="words-slider__logo" src="@/assets/logo.svg" alt="">
        <div class="words-slider__page-number">{{ currentSlide.serial }}</div>
        <div
          class="words-slider__slide"
          :class="{ 'words-slider__slide_show': currentIndex === index }"
          v-for="(slide, index) in computedSlides"
          :key="slide.keyId"
        >
          <img class="words-slider__image" :src="slide.image_url" alt="">
          <div class="words-slider__last-word-indicator" v-if="slide.isLastWord && !displayWordsControls">Last word</div>
          <div class="words-slider__word-controls" v-if="displayWordsControls">
            <ToggleWordButton
              class="words-slider__toggle-word-button"
              :word-id="slide.id"
              :active="true"
            ></ToggleWordButton>
            <LastWordButton
              class="words-slider__last-word-button"
              :word-id="slide.id"
              :active="slide.isLastWord"
            ></LastWordButton>
          </div>
        </div>
      </div>

      <div class="words-slider__prev" @click="prevSlide"></div>
      <div class="words-slider__next" @click="nextSlide"></div>
      <div class="words-slider__test"></div>

      <div class="words-slider__progress">
        <div class="words-slider__progress-text">
          {{ (currentIndex - currentIndex % 2) / 2 + 1 }}/{{computedSlides.length/2}}
          <svg
            v-svg
            symbol="icon-shuffle"
            class="words-slider__shuffle-icon"
          >
          </svg>
        </div>
        <div class="words-slider__progress-line" @mousemove="onProgressBarMousemove" @click="onProgressBarClick" id="slider-progress">
          <div class="words-slider__progress-level" :style="progressBarStyle"></div>
          <div class="words-slider__progress-label" :style="progressBarLabelStyle">{{ currentWord }}</div>
        </div>
        <div class="words-slider__jump-icon" @click="jumpCard"></div>
      </div>

    </div>
  </UCard>
</template>

<script>
import idGenerator from "@/helpers/idGenerator";
import randomIntFromInterval from "@/helpers/randomIntFromInterval";
import UCard from "@/components/common/UCard";
import LastWordButton from "@/components/partials/WordsControlls/LastWordButton";
import ToggleWordButton from "@/components/partials/WordsControlls/ToggleWordButton";
import { mapGetters, mapMutations } from "vuex";

export default {
  components: {
    UCard,
    LastWordButton,
    ToggleWordButton,
  },
  props: {
    words: {
      type: Array,
      default: () => [],
    },
    displayWordsControls: {
      type: Boolean,
      default: false,
    }
  },
  data: () => ({
    currentIndex: 0,
    currentWord: 1,
    mousePos: { x: 0 },
    touchData: {
      startX: 0,
      startY: 0,
      endX: 0,
      endY: 0,
    }
  }),
  mounted() {
    console.log('WORDS SLIDER MOUNTED 4');
    window.addEventListener('keyup', this.handleKeyPress);
    window.addEventListener('keydown', this.preventScrollOnSpacebar);

    this.$refs.wordsSliderList.addEventListener('mousedown', this.handleSwipeStart, false);
    this.$refs.wordsSliderList.addEventListener('touchstart', this.handleSwipeStart, false);

    this.$refs.wordsSliderList.addEventListener('mouseup', this.handleSwipeEnd, false);
    this.$refs.wordsSliderList.addEventListener('touchend', this.handleSwipeEnd, false);
  },
  beforeDestroy() {
    window.removeEventListener('keyup', this.handleKeyPress);
    window.removeEventListener('keydown', this.preventScrollOnSpacebar);

    this.$refs.wordsSliderList.removeEventListener('mousedown', this.handleSwipeStart);
    this.$refs.wordsSliderList.removeEventListener('touchstart', this.handleSwipeStart);

    this.$refs.wordsSliderList.removeEventListener('mouseup', this.handleSwipeEnd);
    this.$refs.wordsSliderList.removeEventListener('touchend', this.handleSwipeEnd);
  },
  computed: {
    ...mapGetters('Words', ['lastWord']),
    ...mapGetters('Lessons', ['lessonTimerIsActive']),
    progressBarStyle(){
      return {
        width: (Math.floor((this.currentIndex + 1) / 2)) / (this.computedSlides.length / 2) * 100 + '%'
      }
    },
    progressBarLabelStyle(){
      return {
        left: `${this.mousePos.x - 15}px`
      }
    },
    currentSlide(){
      let slide = this.computedSlides[this.currentIndex];
      if(!slide) {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.currentIndex = 0;
        slide = this.computedSlides[this.currentIndex];
      }
      return slide;
    },
    computedSlides(){

      //
      let slides = [];
      this.words.forEach((el) => {
        slides.push(
          {
            keyId: idGenerator(),
            id: el.id,
            image_url: el.cropped_image_url,
            isLastWord: el.id === this.lastWord,
            serial: el.serial,
          },
          {
            keyId: idGenerator(),
            id: el.id,
            image_url: el.image_url,
            isLastWord: el.id === this.lastWord,
            serial: el.serial,
          },
        );
      });

      // let slidesToPlaceInEnd = slides.slice(0, this.currentIndex);
      // let slidesToPlaceInStart = slides.slice(this.currentIndex);

      return slides;// slidesToPlaceInStart.concat(slidesToPlaceInEnd);
    },
  },
  methods: {
    ...mapMutations('Words', ['ADD_COUNT_INDEX_FOR_TIMER']),
    prevSlide(){

      if(this.currentIndex !== 0)
        this.currentIndex--;

    },
    nextSlide(){
      if(this.currentIndex !== this.computedSlides.length - 1){
        this.currentIndex++;
        if(this.lessonTimerIsActive) {
          this.ADD_COUNT_INDEX_FOR_TIMER()
        }
      }

    },
    jumpCard(){
      const slideId = this.currentSlide.id;
      const slide = this.words.find(el => el.id === slideId);
      let index = this.currentIndex;
      let jumpSlideToIndex = index + randomIntFromInterval(12,22);

      if(jumpSlideToIndex % 2 !== 0){
        jumpSlideToIndex--;
      }

      if (jumpSlideToIndex > this.computedSlides.length - 1 ){
        jumpSlideToIndex = this.computedSlides.length
      }

      if(index % 2 !== 0){
        index--;
      }
      this.computedSlides.splice(index, 2);

      this.computedSlides.splice(jumpSlideToIndex, 0,
        {
          keyId: idGenerator(),
          id: slide.id,
          image_url: slide.cropped_image_url,
          isLastWord: slide.id === this.lastWord,
          serial: slide.serial,
        },
        {
          keyId: idGenerator(),
          id: slide.id,
          image_url: slide.image_url,
          isLastWord: slide.id === this.lastWord,
          serial: slide.serial,
        },
      );
      //update currentIndex for reactive
      this.currentIndex++;
      this.currentIndex = index;
    },
    handleKeyPress(e){
      e.preventDefault();
      if(e.keyCode === 32 || e.keyCode === 39){
        this.nextSlide();
      }
      else if(e.keyCode === 37){
        this.prevSlide();
      }
      else if(e.keyCode === 74){
        this.jumpCard();
      }
    },
    preventScrollOnSpacebar(e){
      if(e.keyCode === 32 && e.target == document.body){
        e.preventDefault();
      }
    },
    onProgressBarClick(){
      this.currentIndex = (this.currentWord - 1) * 2;
    },
    onProgressBarMousemove(event) {
      const bounds = document.getElementById('slider-progress').getBoundingClientRect();
      const x = event.clientX - bounds.left;
      const width = bounds.right - bounds.left;
      this.currentWord = Math.ceil(x / (width / this.words.length));
      this.mousePos = { x };
    },
    handleSwipeStart(event) {
      this.touchData.startX = event.screenX;
      this.touchData.startY = event.screenY;
    },
    handleSwipeEnd(event) {
      this.touchData.endX = event.screenX;
      this.touchData.endY = event.screenY;

      if (this.touchData.startX < this.touchData.endX) {
        // swipe right
        this.nextSlide();
      } else if(this.touchData.startX > this.touchData.endX) {
        // swipe left
        this.prevSlide();
      }
    },
  },
  watch: {
    computedSlides(newVal){
      this.computedSlides = newVal
    }
  }
}
</script>

<style lang="scss">
@import '@/styles/vars';
@import '@/styles/mixins';

.words-slider{
  padding: 25px 115px 65px;

  &__inner{
    position: relative;
  }

  &__logo{
    position: absolute;
    z-index: 1;
    bottom: 16px;
    left: 15px;
  }
  &__page-number{
    position: absolute;
    z-index: 1;
    bottom: 30px;
    right: 65px;
    text-align: center;
  }

  &__list{
    display: flex;
    justify-content: flex-start;
    //justify-content: center;
    overflow: hidden;
    width: 100%;
    //min-height: 780px;
    position: relative;
  }
  &__slide{
    flex: 0 0 100%;
    min-height: 490px;
    position: absolute;
    $transition-duration: 0.2s;
    transition: all $transition-duration linear;
    transition-delay: $transition-duration;
    opacity: 0;
    visibility: hidden;
    width: 100%;

    &_plug{
      width: 100%;
      opacity: 0;
      z-index: 0;
    }

    &_show{
      opacity: 1;
      visibility: visible;
      transition: all $transition-duration linear;
    }
  }

  &__image{
    width: 100%;
    height: auto;
    display: block;
    user-select: none;
    pointer-events: none;
  }


  &__last-word-indicator{
    position: absolute;
    color: $clr-blue;
    top: 8%;
    right: 20px;
    font-size: 20px;
  }

  &__word-controls{
    position: absolute;
    top: 30px;
    right: 45px;
  }
  &__toggle-word-button,
  &__last-word-button{
    width: 48px;
    height: 48px;
    background-size: 27px 18px;
  }
  &__last-word-button{
    margin-left: 15px;
  }


  &__prev,
  &__next{
    width: 29px;
    height: 48px;
    position: absolute;
    cursor: pointer;
    top: 50%;
    background-image: url('~@/assets/svg/words-slider-prev.svg');
    background-size: 29px 48px;
    //border: 1px solid green;
  }
  &__prev{
    left: -39px;
    transform: translate( -100%, -50%);
  }
  &__next{
    right: -39px;
    transform-origin: 50% 50%;
    transform: rotate(180deg) translate( -100%, 50%);
  }


  &__progress{
    display: flex;
    align-items: center;
    flex-wrap: nowrap;

    margin-top: 25px;
  }
  &__progress-text{
    font-size: 22px;
    font-weight: 300;
    margin-right: 43px;

    display: flex;
    align-items: center;
    flex-shrink: 0;
  }
  &__progress-line{
    height: 4px;
    position: relative;
    background-color: #F3F3F3;
    flex-grow: 1;
    cursor: pointer;

    &:hover{
      .words-slider__progress-label{
        opacity: 1;
        visibility: visible;
      }
    }
  }
  &__progress-level{
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    background-color: $clr-primary;
    transition: width .3s ease-in-out;
  }

  &__progress-label{
    width: 30px;
    color: black;
    text-align: center;
    position: absolute;
    top: -25px;
    opacity: 0;
    visibility: hidden;
  }

  &__shuffle-icon{
    width: 25px;
    height: 19px;
    stroke: rgba(#585858, .23);
    margin-left: 12px;
  }
  &__jump-icon{
    background-image: url('~@/assets/svg/fast-forward.svg');
    width: 25px;
    height: 25px;
    margin-left: 30px;
    cursor: pointer;
  }
}
@include media(">phone", "<=tablet") {
  .words-slider{
    padding: 40px 47px 40px;
    &__page-number{
      bottom: 0;
    }
    &__logo{
      width: 35px;
      bottom: 0;
      pointer-events: none;
      user-select: none;
    }
    &__prev{
      left: -15px;
      width: 15px;
    }
    &__next{
      right: -15px;

      width: 15px;
    }
    &__word-controls{
      position: absolute;
      top: 2px;
      right: 3px;
    }
    &__toggle-word-button,&__last-word-button{
      width: 24px;
      height: 24px;
      background-size: 20px 22px;
    }
  }
}
</style>
