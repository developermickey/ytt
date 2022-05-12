<template>
  <div class="words-view">
    <EditWordsSlider
      v-if="sliderMode"
      :display-words-controls="displayWordsControls"
      :words="displayWords"
    ></EditWordsSlider>
    <LessonWordsList
      :words="filteredWords"
      :display-words-controls="displayWordsControls"
      v-else
    ></LessonWordsList>
  </div>
</template>

<script>
import EditWordsSlider from "@/components/lessons/EditWordsSlider";
import LessonWordsList from "@/components/lessons/LessonWordsList";

import { mapGetters } from 'vuex';

export default {
  components: {
    EditWordsSlider,
    LessonWordsList,
  },
  props: {
    sliderMode: {
      type: Boolean,
      default: true,
    },
    displayWordsControls: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      default: 'known',
    }
  },
  computed: {
    ...mapGetters('Words', [
      'words', 'knownWords', 'unknownWords', 'allWords', 'masteredWords'
    ]),
    displayWords(){
      switch (this.status) {
        case 'known':
          return this.knownWords;
        case 'unknown':
          return this.unknownWords;
        case 'mastered':
          return this.masteredWords;
      
        default: return this.knownWords;
       }
    },
    filteredWords(){
      //gets list of all words
      //with 'disabled' property dependent on displayKnown prop

      return this.allWords.map(item => {
        return {
          id: item.id,
          image_default: item.image_default,
          word: item.word,
          translation_default: item.translation_default,
          status: item.status,
          disabled: item.status !== this.status,
        }
      })
    }
  }
}
</script>

<style lang="scss">

</style>