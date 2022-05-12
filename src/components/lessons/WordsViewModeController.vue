<template>
  <div class="words-view-mode-controller">
    <div class="words-view-mode-controller__button-wrap">
      <div
        class="words-view-mode-controller__button words-view-mode-controller__button-slider"
        :class="{'words-view-mode-controller__button-slider_active' : this.value }"
        @click="setSliderView"
      >
      </div>
    </div>
    <div class="words-view-mode-controller__button-wrap">
      <div
        class="words-view-mode-controller__button words-view-mode-controller__button-grid"
        :class="{'words-view-mode-controller__button-grid_active' : !this.value }"
        @click="setGridView"
      >
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "WordsViewModeController",
  props: {
    value: {
      type: Boolean,
      default: false,
    }
  },
  methods: {
    setSliderView(){
      this.$emit('input', true);
    },
    setGridView(){
      this.$emit('input', false);
    }
  },
}
</script>

<style lang="scss" scoped>
@import "@/styles/mixins";
.words-view-mode-controller{
  display: flex;
  align-items: center;
  &__button{
    width: 33px;
    height: 33px;
    cursor: pointer;
    &-grid{
      margin-left: 18px;
      background: url('~@/assets/svg/grid.svg') no-repeat center;
      background-size: cover;
      &_active{
        background: url('~@/assets/svg/grid-blue.svg') no-repeat center;
        background-size: cover;
      }
    }
    &-slider{
      background: url('~@/assets/svg/slider.svg') no-repeat center;
      background-size: cover;
      &_active{
        background: url('~@/assets/svg/slider-blue.svg') no-repeat center;
        background-size: cover;
      }
    }
  }
}
@include media(">phone", "<=tablet") {
  .words-view-mode-controller{
    margin-right: 10px;
    &__button{
      width: 20px;
      height: 20px;
    }
  }
}
</style>
