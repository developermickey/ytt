<template>
  <UCard class="lesson-words-list">
    <vue-scroll
      ref="scroll"
    >
      <div class="lesson-words-list__inner">
        <NewWordsListItem
          class="lesson-words-list__words-list-item"
          :class="{ 'lesson-words-list__words-list-item_shuffle' : isInShuffleRange(item.serial)}"
          v-for="item in words"
          :key="item.id"
          :word="item"
          @click.native="handleWordsItemClick(item)"
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
import {mapGetters, mapMutations} from "vuex";
import { SHUFFLED_WORDS } from '@/constants/words';

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
  },
  computed: {
    ...mapGetters('Words', ['shuffleBottomEdge', 'shuffleTopEdge', 'tab']),
    ...mapGetters('Lessons', ['lesson']),
  },
  methods: {
    ...mapMutations('Words', ['SET_SHUFFLE_TOP_EDGE' ,'SET_SHUFFLE_BOTTOM_EDGE']),
    isInShuffleRange(index){

      let result = false;
      if(this.shuffleBottomEdge !== null && this.shuffleTopEdge !== null){
        if(index >= this.shuffleBottomEdge && index <= this.shuffleTopEdge){
          result = true;
        }
      }
      return result;
    },
    handleWordsItemClick(item){

      if(this.tab === SHUFFLED_WORDS)
        return;

      if(this.shuffleBottomEdge === item.serial){
        this.SET_SHUFFLE_BOTTOM_EDGE(null);
      }
      else if(this.shuffleTopEdge === item.serial){
        this.SET_SHUFFLE_TOP_EDGE(null);
      }
      else if(this.shuffleBottomEdge === null && this.shuffleTopEdge === null){
        this.SET_SHUFFLE_BOTTOM_EDGE(item.serial);
      }
      else if(this.shuffleBottomEdge === null){
        if(this.shuffleTopEdge > item.serial){
          this.SET_SHUFFLE_BOTTOM_EDGE(item.serial);
        }
        else{
          this.SET_SHUFFLE_BOTTOM_EDGE(this.shuffleTopEdge);
          this.SET_SHUFFLE_TOP_EDGE(item.serial);
        }
      }
      else if(this.shuffleTopEdge === null){
        if(this.shuffleBottomEdge < item.serial){
          this.SET_SHUFFLE_TOP_EDGE(item.serial);
        }
        else{
          this.SET_SHUFFLE_TOP_EDGE(this.shuffleBottomEdge);
          this.SET_SHUFFLE_BOTTOM_EDGE(item.serial);
        }
      }
      else{
        //calc the nearest shuffle edge
        let bottomDistance = Math.abs(this.shuffleBottomEdge - item.serial);
        let topDistance = Math.abs(this.shuffleTopEdge - item.serial);
        if(bottomDistance === topDistance){
          this.SET_SHUFFLE_BOTTOM_EDGE(item.serial);
        }
        else if(bottomDistance < topDistance){
          this.SET_SHUFFLE_BOTTOM_EDGE(item.serial);
        }
        else{
          this.SET_SHUFFLE_TOP_EDGE(item.serial);
        }
      }
    }
  }
}
</script>

<style lang="scss">
@import "@/styles/vars";

.shuffle-edge-button{
  width: 30px;
  height: 30px;
  border: 0;
  border-radius: 50%;
  cursor: pointer;
  outline: none;
  background: url('~@/assets/svg/check.svg') no-repeat center;
  background-color: $clr-primary;
  background-size: 17px 12px;

}
.lesson-words-list__words-list-item{
  &_shuffle{
    .words-list-item__img-wrap{
      border: 1px solid $clr-blue;
    }
  }
}
</style>