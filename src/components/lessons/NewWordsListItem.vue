<template>
  <div 
    class="new-words-list-item"
    :class="{'new-words-list-item_disabled' : word.disabled}"
  >
    <div class="new-words-list-item__wrap">
      <div class="new-words-list-item__row">
        <div class="new-words-list-item__imgfit">
          <img 
            class="new-words-list-item__img"
            :src="word.image_default" 
            alt=""
          >
        </div>
        <div
           class="new-words-list-item__hebrew"
        >{{ word.word }}</div>
      </div>
      <div class="new-words-list-item__translation">
        {{ word.translation_default }}
      </div>

      <div class="new-words-list-item__controls" v-if="displayWordsControls">
        <slot name="word-controls">
          <MasteredWordButton
            class="new-words-list-item__toggle-word-button"
            :word-id="word.id"
            :active="word.status == 'mastered'"
          ></MasteredWordButton>
          <KnownWordButton
            class="new-words-list-item__toggle-word-button"
            :word-id="word.id"
            :active="word.status == 'known'"
          ></KnownWordButton>
          <UnknownWordButton
            class="new-words-list-item__toggle-word-button"
            :word-id="word.id"
            :active="word.status == 'unknown'"
          ></UnknownWordButton>
        </slot>
      </div>
    </div>

    <div class="new-words-list-item__index">{{ word.serial }}</div>
  </div>
</template>

<script>
import KnownWordButton from "@/components/partials/WordsControlls/KnownWordButton";
import UnknownWordButton from "@/components/partials/WordsControlls/UnknownWordButton";
import MasteredWordButton from "@/components/partials/WordsControlls/MasteredWordButton";

export default {
  components: {
    KnownWordButton,
    UnknownWordButton,
    MasteredWordButton,
  },
  props: {
    word: {
      type: Object,
      default: () => {},
    },
    displayWordsControls: {
      type: Boolean,
      default: false,
    },
  },
}
</script>

<style lang="scss">
@import "@/styles/vars";

.new-words-list-item{
  transition: 0.3s;
  &:hover {
    opacity: 1;
  }
  &__wrap{
    padding: 15px;
    background-color: #FAFAFA;
    border: 1px solid #E4E4E4;
    width: 100%;
    height: 145px;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  &__row {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  &__imgfit{
    width: 80px;
    height: 80px;
  }
  &__img {
    border-radius: 5px;
    width: 100%;
    height: 100%;
    object-fit: cover;
    pointer-events: none;
    user-select: none;
  }
  &__hebrew, &__translation {
    font-size: 14px;
    font-weight: bold;
    user-select: none;
  }
  &__translation {
    text-align: center;

  }

  &__controls{
    display: flex;
    justify-content: center;
    width: 100%;
    position: absolute;
    left: 0;
    bottom: 0;
    transform: translateY(50%);
  }

  &__index{
    text-align: center;
    margin-top: 25px;
    font-size: 18px;
    line-height: 22px;
    color: rgba(#000000, .4);
  }

  &_disabled{
    opacity: .3;
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
