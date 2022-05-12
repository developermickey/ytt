<template>
  <button
    class="mastered-word-button"
    :class="classes"
    @click="CHANGE_WORD_STATUS({ wordId, status: 'mastered'})"
  >M</button>
</template>

<script>


import {mapMutations} from "vuex";

export default {
  name: "MasteredWordButton",
  props: {
    active: {
      type: Boolean,
      default: false,
    },
    wordId: {
      type: Number,
    }
  },
  computed: {
    classes(){
      return {
        'mastered-word-button_active' : this.active,
      };
    },
  },
  methods: {
    ...mapMutations('Words', ['CHANGE_WORD_STATUS']),
  }
}
</script>

<style lang="scss">
@import '@/styles/vars';

.mastered-word-button{
  width: 30px;
  height: 30px;
  margin: 0 5px;
  border: 0;
  border-radius: 50%;
  cursor: pointer;
  outline: none;
  color: rgba($color: $clr-dark-blue, $alpha: 0.6);
  border: 1px solid rgba($color: $clr-grey, $alpha: 0.6);
  background: #fff;
  &_active{
    border: none;
    background-color: $clr-dark-blue;
    color: #fff;
  }

}
</style>