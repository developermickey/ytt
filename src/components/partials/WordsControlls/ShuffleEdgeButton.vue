<template>
  <button
    class="shuffle-edge-button"
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
</style>