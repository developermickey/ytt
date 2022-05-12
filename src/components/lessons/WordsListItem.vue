<template>
  <div class="words-list-item "
     :class="classes"
  >
    <div class="words-list-item__img-wrap">
      <img
        class="words-list-item__img"
        :src="image" alt=""
      >

        <div class="words-list-item__controls" v-if="hasControls">
          <slot name="word-controls">
            <ToggleWordButton
              class="words-list-item__toggle-word-button"
              :word-id="id"
              :active="!disabled"
            ></ToggleWordButton>
            <LastWordButton
              class="words-list-item__last-word-button"
              :word-id="id"
              :active="isLastWord"
            ></LastWordButton>
          </slot>
        </div>

      <div class="words-list-item__last-word-indicator" v-if="isLastWord">Last word</div>
    </div>

    <div class="words-list-item__index">{{index}}</div>
  </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import {mapGetters, mapMutations} from 'vuex';
import LastWordButton from "@/components/partials/WordsControlls/LastWordButton";
import ToggleWordButton from "@/components/partials/WordsControlls/ToggleWordButton";

export default {
  props: {
    index: {
      type: Number,
      default: 1,
    },
    id: {
      type: Number,
      default: 1,
    },
    image: {
      type: String,
      default: 'https://via.placeholder.com/240x120'
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    hasControls: {
      type: Boolean,
      default: false,
    },
    isLastWord: {
      type: Boolean,
      default: false,
    }
  },
  components: {
    LastWordButton,
    ToggleWordButton,
  },
  computed: {
    classes(){
      return {
        'words-list-item_disabled' : this.disabled,
      };
    },
  },
  methods: {

  }
}
</script>

<style lang="scss">
@import "@/styles/vars";

.words-list-item{
  &__img-wrap{
    background-color: #FAFAFA;
    border: 1px solid #E4E4E4;
    width: 100%;
    position: relative;
  }
  &__img{
    display: block;
    width: 100%;
  }
  &__controls{
    display: flex;
    justify-content: center;
    width: 100%;
    position: absolute;
    bottom: 0;
    transform: translateY(50%);

  }
  &__toggle-word-button,
  &__last-word-button{
    margin: 0 4px;

  }
  &__index{
    text-align: center;
    margin-top: 25px;
    font-size: 18px;
    line-height: 22px;
    color: rgba(#000000, .4);
  }

  &_disabled{
    .words-list-item__img{
      opacity: .3;
    }
  }

  &__last-word-indicator{
    position: absolute;
    top: 9px;
    right: 5px;
    color: $clr-blue;
    font-size: 15px;
  }
}
</style>
