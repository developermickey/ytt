<template>
  <button
    class="toggle-word-button"
    :class="classes"
    @click="TOGGLE_WORD(wordId)"
  ></button>
</template>

<script>


import {mapMutations} from "vuex";

export default {
  name: "ToggleWordButton",
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
        'toggle-word-button_active' : this.active,
      };
    },
  },
  methods: {
    ...mapMutations('Words', ['TOGGLE_WORD']),
  }
}
</script>

<style lang="scss">
@import '@/styles/vars';

.toggle-word-button{
  width: 30px;
  height: 30px;
  border: 0;
  border-radius: 50%;
  cursor: pointer;
  outline: none;
  background: url('~@/assets/svg/eye.svg') no-repeat center;
  background-color: $clr-grey3;
  background-size: 17px 12px;
  &_active{
    background-color: $clr-primary;
  }

}
</style>