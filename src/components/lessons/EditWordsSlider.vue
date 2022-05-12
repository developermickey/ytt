<template>
  <UCard 
    class="edit-words-slider" 
    v-if="words.length"
  >
    <div class="edit-words-slider__inner" @click="hideLists">
      <div class="edit-words-slider__item" ref="editWordsSliderList">
        <div class="edit-words-slider__slide">
          <div class="edit-words-slider__slide-row">
            <div 
              class="edit-words-slider__image"
              @contextmenu.prevent="showImagesList"
            >
              <img 
              :src="currentSlide.image_default" 
              alt=""
            >
            </div>
            <ul
              class="edit-words-slider__images-list"
              v-show="showImgList"
            >
              <li 
                class="edit-words-slider__images-list-item"
                v-for="img in currentSlide.all_images"
                :key="img.id"
                @click="setDefaultImg(img.id)"
              >
                <img
                  :class="{'edit-words-slider__images-list-item_default': img.default}"
                  :src="img.image" 
                  alt=""
                >
              </li>
            </ul>
            <div class="edit-words-slider__hebrew">{{ currentSlide.word }}</div>
          </div>
          <div 
            class="edit-words-slider__english" 
            @contextmenu.prevent="showTransationList"
            v-show="currentIndex % 2"
          >
            {{ currentSlide.translation_default }}
            <ul
              class="edit-words-slider__transation-list"
              v-show="showTransationsList"
            >
              <li
                class="edit-words-slider__transation-list-item"
                :class="{'edit-words-slider__transation-list-item_default': translation.default}"
                v-for="translation in currentSlide.all_translations"
                :key="translation.id"
                @click="setDefaultTranslation(translation.id)"
              >
                {{ translation.eng }}
              </li>
            </ul>
          </div>
        </div>
        <div class="edit-words-slider__slide-row">
          <img class="edit-words-slider__logo" src="@/assets/logo.svg" alt="">
          <div class="edit-words-slider__page-number">({{currentSlide.serial}})</div>
        </div>
      </div>

      <div class="edit-words-slider__prev" @click="prevSlide"></div>
      <div class="edit-words-slider__next" @click="nextSlide"></div>
      <div class="edit-words-slider__test"></div>

      <div class="edit-words-slider__progress">
        <div class="edit-words-slider__progress-text">
           {{ Math.round((currentIndex + 1)/2) }}/{{computedSlides.length/2}}
          <svg
            v-svg
            symbol="icon-shuffle"
            class="edit-words-slider__shuffle-icon"
          >
          </svg>
        </div>
        <div 
          class="edit-words-slider__progress-line" 
          @mousemove="onProgressBarMousemove" 
          @click="onProgressBarClick" 
          id="slider-progress"
        >
          <div 
            class="edit-words-slider__progress-level" 
            :style="progressBarStyle"
          ></div>
          <div 
            class="edit-words-slider__progress-label" 
            :style="progressBarLabelStyle"
          >
             {{ Math.round((currentIndex + 1)/2) }}
          </div>
        </div>
      </div>

    </div>
  </UCard>
</template>

<script>
import UCard from "@/components/common/UCard";
import { mapGetters } from "vuex";

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
    isFliped: false,
    showImgList: false,
    showTransationsList: false,
    all_images: [
        {
            "id": 16,
            "image": "http://api.ytt.calibrr.ai/storage/word/tx19V5mnqypPwUbH4qsj2fCj3UMjQMsDE1TNa6yH.png",
            "default": 1
        },
        {
            "id": 25,
            "image": "http://api.ytt.calibrr.ai/storage/word/ovvKJmXpHSHZiKZyLMXkVQdlUCZ5krV67qQj8zRD.jpeg",
            "default": 0
        },
        {
            "id": 26,
            "image": "http://api.ytt.calibrr.ai/storage/word/iDqgiKKAC3Vxp33G25vGvhzQHQMXD6vYFxUUs7Km.jpeg",
            "default": 0
        },
        {
            "id": 27,
            "image": "http://api.ytt.calibrr.ai/storage/word/os0drMwPmtnRvLyt8O7JjbqJdPhMQaVRvrCSvQm1.jpeg",
            "default": 0
        }
    ],
    all_translations: [
        {
            "id": 18,
            "eng": "Static 1",
            "default": 1
        },
        {
            "id": 19,
            "eng": "Static 2",
            "default": 0
        }
    ],
  }),
  mounted() {
    window.addEventListener('keyup', this.handleKeyPress);
    window.addEventListener('keydown', this.preventScrollOnSpacebar);

    this.$refs.editWordsSliderList.addEventListener('mousedown', this.handleSwipeStart, false);
    this.$refs.editWordsSliderList.addEventListener('touchstart', this.handleSwipeStart, false);

    this.$refs.editWordsSliderList.addEventListener('mouseup', this.handleSwipeEnd, false);
    this.$refs.editWordsSliderList.addEventListener('touchend', this.handleSwipeEnd, false);
  },
  beforeDestroy() {
    window.removeEventListener('keyup', this.handleKeyPress);
    window.removeEventListener('keydown', this.preventScrollOnSpacebar);

    this.$refs.editWordsSliderList.removeEventListener('mousedown', this.handleSwipeStart);
    this.$refs.editWordsSliderList.removeEventListener('touchstart', this.handleSwipeStart);

    this.$refs.editWordsSliderList.removeEventListener('mouseup', this.handleSwipeEnd);
    this.$refs.editWordsSliderList.removeEventListener('touchend', this.handleSwipeEnd);
  },
  computed: {
    ...mapGetters('Lessons', ['lessonTimerIsActive', 'hideLessonImages', 'hideLessonTranslations']),
    progressBarStyle(){
      return {
        width: (Math.floor((this.currentIndex + 1))) / (this.computedSlides.length) * 100 + '%'
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
    prevSlide(){
      if(this.currentIndex !== 0){
        this.currentIndex --
      }
    },
    nextSlide(){
      if(this.currentIndex !== this.computedSlides.length - 1){
        this.currentIndex++;
      }      
    },
    handleKeyPress(e){
      e.preventDefault();
      if(e.keyCode === 32 || e.keyCode === 39){
        this.nextSlide();
      }
      else if(e.keyCode === 37){
        this.prevSlide();
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
}
</script>

<style lang="scss">
@import '@/styles/vars';
@import '@/styles/mixins';

.edit-words-slider{
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
      .edit-words-slider__progress-label{
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
}
@include media(">phone", "<=tablet") {
  .edit-words-slider{
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
</style>
