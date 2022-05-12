<template>
  <UCard class="lesson-words-list">
    <vue-scroll
      ref="scroll"
    >
      <div class="lesson-words-list__inner">
        <NewWordsListItem
          class="lesson-words-list__words-list-item"
          v-for="item in words"
          :key="item.id"
          :word="item"
          :display-words-controls="displayWordsControls"
        >
        </NewWordsListItem>
      </div>
    </vue-scroll>
  </UCard>
</template>

<script>
// import vueCustomScrollbar from 'vue-custom-scrollbar/src/main'
import UCard from "@/components/common/UCard";
import NewWordsListItem from "@/components/lessons/NewWordsListItem";
import {mapGetters} from "vuex";

export default {
  components: {
    UCard,
    NewWordsListItem,
  },
  data: () => ({

  }),
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
  computed: {
    ...mapGetters('Words', ['lastWord']),
  },
}
</script>

<style lang="scss">
@import "@/styles/vars";
@import "@/styles/mixins";

.lesson-words-list{
  padding: 35px 69px 15px 75px;
  height: 577px;
  //overflow-y: scroll;
  &__words-list-item{
    width: calc(25% - 34px);
    margin-right: 17px;
    margin-left: 17px;
    margin-bottom: 20px;
  }
  &__inner{
    display: flex;
    flex-wrap: wrap;
    //max-height: 577px;
    padding-right: 17px;
    &::-webkit-scrollbar {
      width: 12px;
      background-color: green;
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 10px;
      background-color: red;
    }
  }
}
@include media(">phone", "<=tablet") {

  .lesson-words-list{
    padding: 25px 20px 15px 20px;


    &__words-list-item{
      width: calc(50% - 34px);
    }
  }
}
</style>
