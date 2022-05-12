<template>
  <div class="shuffle-words-view">
    <UTabs
      class="shuffle-lesson-view__tabs"
      @input="onTabChange"
      :default-active-tab="defaultActiveTab"
    >
      <UTab v-if="displayTabs" :index="WordsConstants.KNOWN_WORDS" :label="`Known words (${knownWords.length})`"></UTab>
      <UTab v-if="displayTabs" :index="WordsConstants.UNKNOWN_WORDS" :label="`Unknown words (${unknownWords.length})`"></UTab>
      <UTab v-if="displayTabs" :index="WordsConstants.MASTERED_WORDS" :label="`Mastered words (${masteredWords.length})`"></UTab>
      <UTab :index="WordsConstants.SHUFFLED_WORDS" label="Shuffle" v-if="wordsShuffled.length"></UTab>
      <UTab v-if="displayAllWords" :index="WordsConstants.ALL_WORDS" :label="`All words (${words.length})`"></UTab>
    </UTabs>
    <NewWordsSlider
      v-if="sliderMode"
      :display-words-controls="false"
      :words="words"
    ></NewWordsSlider>
    <ShuffleWordsList
      :words="words"
      v-else
    >
    </ShuffleWordsList>
  </div>
</template>

<script>
import NewWordsSlider from "@/components/lessons/NewWordsSlider";
import ShuffleWordsList from "@/components/lessons/ShuffleWordsList";
import UTabs from '@/components/common/UTabs/UTabs';
import UTab from '@/components/common/UTabs/UTab';
import * as WordsConstants from "@/constants/words";

import { mapGetters } from 'vuex';

export default {
  components: {
    NewWordsSlider,
    ShuffleWordsList,
    UTabs,
    UTab,
  },
  data: () => ({
    WordsConstants
  }),
  props: {
    displayTabs: {
      type: Boolean,
      default: false
    },
    displayAllWords: {
      type: Boolean,
      default: false
    },
    sliderMode: {
      type: Boolean,
      default: true,
    },
    defaultActiveTab: {
      type: Number,
      default: 2,
    },
  },
  computed: {
    ...mapGetters('Words', [
      'words',
      'knownWords',
      'unknownWords',
      'masteredWords',
      'wordsShuffled',
    ])
  },
  methods: {
    onTabChange(tabId){
      this.$emit('tab-change', tabId);
    }
  }
}
</script>

<style lang="scss">
.shuffle-lesson-view{
  &__tabs{
    margin-bottom: 30px;
  }
}
</style>