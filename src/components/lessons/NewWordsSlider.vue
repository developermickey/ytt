<template>
<transition name="flip">
  <UCard class="new-words-slider" v-if="words.length" :key="isFliped">
    <div class="new-words-slider__inner" v-show="!isFliped" @click="hideLists">
      <div class="new-words-slider__item" ref="wordsSliderList">
        <div class="new-words-slider__slide">
          <div class="new-words-slider__slide-row">
            <div
              class="new-words-slider__image"
              @contextmenu.prevent="showImagesList"
              >
              <img 
                :class="{'new-words-slider__image_hidden': hideLessonImages}" 
                :src="currentSlide.image_default" 
                alt=""
                @error="replaceByDefault"
              >
              <ul
                class="new-words-slider__images-list"
                v-show="showImgList"
              >
                <li 
                  class="new-words-slider__images-list-item"
                  v-for="img in currentSlide.all_images"
                  :key="img.id"
                  @click="setDefaultImg(img.id)"
                >
                  <img
                    :class="{'new-words-slider__images-list-item_default': img.default}"
                    :src="img.image" 
                    alt=""
                  >
                </li>
              </ul>
            </div>
            <div class="new-words-slider__hebrew">{{ currentSlide.word }}</div>
          </div>
          <div 
            class="new-words-slider__english" 
            @contextmenu.prevent="showTransationList"
            v-show="currentIndex % 2 && !hideLessonTranslations"
          >
            {{ currentSlide.translation_default }}
            <ul
              class="new-words-slider__transation-list"
              v-show="showTransationsList"
            >
              <li
                class="new-words-slider__transation-list-item"
                :class="{'new-words-slider__transation-list-item_default': translation.default}"
                v-for="translation in currentSlide.all_translations"
                :key="translation.id"
                @click="setDefaultTranslation(translation.id)"
              >
                {{ translation.eng }}
              </li>
            </ul>
          </div>
          
        </div>
        <div class="new-words-slider__slide-row">
          <img class="new-words-slider__logo" src="@/assets/logo.svg" alt="">
          <div class="new-words-slider__page-number"> ({{currentSlide.serial}})</div>
        </div>
      </div>

      <div class="new-words-slider__prev" @click="prevSlide"></div>
      <div class="new-words-slider__next" @click="nextSlide()"></div>
      <div class="new-words-slider__test"></div>

      <div class="new-words-slider__progress">
        <div class="new-words-slider__progress-text">
          {{ Math.round((currentIndex + 1)/2) }}/{{computedSlides.length/2}}

          <!-- {{ (currentIndex + 1 )}}/{{words.length}} -->
          <svg
            v-svg
            symbol="icon-shuffle"
            class="new-words-slider__shuffle-icon"
          >
          </svg>
        </div>
        <div 
          class="new-words-slider__progress-line" 
          @mousemove="onProgressBarMousemove" 
          @click="onProgressBarClick" 
          id="slider-progress"
        >
          <div 
            class="new-words-slider__progress-level" 
            :style="progressBarStyle"
          ></div>
          <div 
            class="new-words-slider__progress-label" 
            :style="progressBarLabelStyle"
          >
            {{ Math.round((currentIndex + 1)/2) }}
          </div>
        </div>
        <div class="new-words-slider__jump-icon" @click="jumpCard"></div>
      </div>

    </div>
    <div class="new-words-slider__quote" v-show="isFliped">
      {{ currentSlide.quote }}
    </div>
  </UCard>
</transition>
</template>

<script>
import randomIntFromInterval from "@/helpers/randomIntFromInterval";
import UCard from "@/components/common/UCard";
import { mapGetters, mapMutations } from "vuex";

export default {
  components: {
    UCard,
  },
  props: {
    words: {
      type: Array,
      default: () => [],
    },
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
    },
    showImgList: false,
    showTransationsList: false,
    isFliped: false,
  }),
  mounted() {
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
    ...mapGetters('Lessons', ['lessonTimerIsActive', 'hideLessonImages', 'hideLessonTranslations']),
    progressBarStyle(){
      if(this.hideLessonTranslations){
        return {
          width: (Math.floor((this.currentIndex + 2) / 2)) / (this.computedSlides.length / 2) * 100 + '%'
        }
      } else {
        return {
          width: (Math.floor((this.currentIndex + 1) / 2)) / (this.computedSlides.length / 2) * 100 + '%'
        }
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
        // slide = this.computedSlides[this.currentIndex];
      }
      return slide;
    },
    computedSlides(){
      //Duplicate words to hide and show translation
      let slides = [];
      this.words.forEach((el) => {
        // const slide = {
        //   id: el.id,
        //   image_url: el.image_default,
        //   translation: el.translation_default,
        //   hebrew: el.word,
        //   serial: el.serial,
        //   quote: el.quote,
        // };
        const slide = {
          ...el,
        };

        slides.push(slide, slide);
      });

      return slides;
    },
  },
  methods: {
    ...mapMutations('Words', ['ADD_COUNT_INDEX_FOR_TIMER']),
    prevSlide(){
      if(this.currentIndex !== 0){
        if(this.hideLessonTranslations){
            this.currentIndex -= 2;
        } else {
          this.currentIndex --
        }
      }
    },
    nextSlide(){
      //when translations are hidden, then we must increase the index by 2
      if(this.hideLessonTranslations) {
        if(this.currentIndex !== this.computedSlides.length - 2){
        // if(this.currentIndex !== this.words.length - 2){
          this.currentIndex += 2;
          if(this.lessonTimerIsActive) {
            this.ADD_COUNT_INDEX_FOR_TIMER(2);
          }
        }
      } else {
        if(this.currentIndex !== this.computedSlides.length - 1){
        // if(this.currentIndex !== this.words.length - 1){
          this.currentIndex++;
          if(this.lessonTimerIsActive) {
            this.ADD_COUNT_INDEX_FOR_TIMER(1);
          }
        }
      }
      
    },
    replaceByDefault(e) {
      e.style.opacity = "0"
    },
    showImagesList() {
      this.showImgList = true;
    },
    showTransationList() {
      this.showTransationsList = true;
    },
    hideLists() {
      this.showImgList = false;
      this.showTransationsList = false;
    },
    // setDefaultImg(id) {
    //   const img = this.currentSlide.all_images.find(img => img.id === id);
    //   this.currentSlide.all_images.forEach(img => {
    //     img.id === id ? img.default = 1 : img.default = 0
    //   })
    //   this.currentSlide.image_default = img.image;
    //   this.currentSlide.image_default_id = img.id;
    // },
    jumpCard(){
      const slide = this.currentSlide;
      let index = this.currentIndex;
      let jumpSlideToIndex = index + randomIntFromInterval(12,22);

      if(jumpSlideToIndex % 2 !== 0){
        jumpSlideToIndex--;
      }
      
      if (jumpSlideToIndex > this.computedSlides.length - 1){
        jumpSlideToIndex = this.computedSlides.length
      }

      // if (jumpSlideToIndex > this.words.length - 1){
      //   jumpSlideToIndex = this.words.length
      // }

      if(index % 2 !== 0){
        index--;
      }

      //Jump current lide to fututre
      this.computedSlides.splice(index, 2);
      this.computedSlides.splice(jumpSlideToIndex, 0, slide, slide);

      // this.words.splice(index, 2);
      // this.words.splice(jumpSlideToIndex, 0, slide, slide);

      //Update currentIndex for reactive
      this.currentIndex++;
      this.currentIndex = index;
    },
    flipCard() {
      this.isFliped = !this.isFliped;
    },
    handleKeyPress(e){
      e.preventDefault();
      console.log(e.keyCode);
      if(e.keyCode === 32 || e.keyCode === 39){
        if(this.isFliped){
          this.flipCard();
        }
        this.nextSlide();
      }
      else if(e.keyCode === 37){
        if(this.isFliped){
          this.flipCard();
        }
        this.prevSlide();
      }
      else if(e.keyCode === 74){
        this.jumpCard();
      }
      else if(e.keyCode === 70){
        this.flipCard();
      }
    },
    preventScrollOnSpacebar(e){
      if(e.keyCode === 32 && e.target == document.body){
        e.preventDefault();
      }
    },
    onProgressBarClick(){
     this.currentIndex = this.currentWord-1
    },
    onProgressBarMousemove(event) {
      const bounds = document.getElementById('slider-progress').getBoundingClientRect();
      const x = event.clientX - bounds.left;
      const width = bounds.right - bounds.left;
      this.currentWord = Math.ceil(x / (width / this.computedSlides.length));
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
    setDefaultImg(id) {
      const img = this.currentSlide.all_images.find(img => img.id === id);
      this.currentSlide.all_images.forEach(img => {
        img.id === id ? img.default = 1 : img.default = 0
      })
      this.currentSlide.image_default = img.image;
      this.currentSlide.image_default_id = img.id;
    },
    setDefaultTranslation(id) {
      const translation = this.currentSlide.all_translations.find(translation => translation.id === id);
      this.currentSlide.all_translations.forEach(translation => {
        translation.id === id ? translation.default = 1 : translation.default = 0
      })
      this.currentSlide.translation_default = translation.eng;
      this.currentSlide.translation_default_id = translation.id;
    },
  },
  
  // watch: {
  //   computedSlides(newVal){
  //     this.computedSlides = newVal
  //   }
  // }
}
</script>

<style lang="scss">
@import '@/styles/vars';
@import '@/styles/mixins';

.new-words-slider{
  padding: 50px 115px 65px;
  height: 873px;

  &__inner{
    position: relative;
  }

  &__item{
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    overflow: hidden;
    min-height: 700px;
    width: 100%;
    position: relative;
  }
  &__slide{
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-height: 600px;
    width: 100%;
    &-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }

  &__image{
    height: 250px;
    object-fit: cover;
    width: 40%;
    img{
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
    &_hidden {
      opacity: 0;
      visibility: hidden;
    }
  }
  &__images-list {
    list-style: none;
    position: absolute;
    top: 0;
    left: 40%;
    padding: 0;
    &-item {
      cursor: pointer;
      width: 120px;
      height: 120px;
      background: #fff;
      padding: 10px;
      box-shadow: 0px 3px 5px rgba(0, 0, 0, 0.08);
      &:hover {
        background: $clr-blue;
      }
      &_default {
        border: 2px solid $clr_blue;
      }
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
  }

  &__hebrew, &__english {
    font-size: 90px;
    font-weight: bold;
    user-select: none;
  }

  &__english {
    text-align: center;
    position: relative;
  }
   &__transation-list{
    list-style: none;
    position: absolute;
    top: 20px;
    left: 50%;
    padding: 0;
    font-size: 18px;
    font-weight: normal;
    text-align: left;
    &-item {
      position: relative;
      padding: 8px 20px;
      cursor: pointer;
      width: 220px;
      background: #fff;
      &:hover {
        background: $clr-blue;
        color: #fff;
      }
      &_default{
        font-weight: bold;
        &:hover::before{
          background: #fff;
        }
        &:before {
          content: '';
          display: inline-block;
          position: absolute;
          top: 19px;
          left: 7px;
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: $clr-blue;
        }
      }
    }
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
      .new-words-slider__progress-label{
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
  &__quote {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 60px;
    font-weight: bold;
    text-align: center;
  }
}
@include media(">phone", "<=tablet") {
  .new-words-slider{
    padding: 40px 47px 40px;
    &__prev{
      left: -15px;
      width: 15px;
    }
    &__next{
      right: -15px;

      width: 15px;
    }
  }
}

.flip-enter-active {
  transition: all 1s ease;
}

.flip-leave-active {
  display: none;
}

.flip-enter, .flip-leave {
  transform: rotateY(180deg);
  opacity: 0;

}
</style>
