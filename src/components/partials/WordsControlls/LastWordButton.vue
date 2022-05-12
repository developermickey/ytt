<template>
  <button
    class="last-word-button"
    :class="classes"
    @click="SET_LAST_WORD(wordId)"
  ></button>
</template>

<script>


import {mapMutations} from "vuex";

export default {
  name: "LastWordButton",
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
          'last-word-button_active' : this.active,
      };
    },
  },
  methods: {
    ...mapMutations('Words', ['SET_LAST_WORD']),
  }
}
</script>

<style lang="scss">
@import '@/styles/vars';

.last-word-button{
  width: 30px;
  height: 30px;
  border: 0;
  border-radius: 50%;
  cursor: pointer;
  outline: none;
  background: url('~@/assets/svg/check.svg') no-repeat center;
  background-color: $clr-grey3;
  background-size: 17px 12px;
  &_active{
    background-color: $clr-primary;
  }

}
</style>