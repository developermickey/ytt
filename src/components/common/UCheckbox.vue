<template>
  <label class="u-checkbox" :class="{ 'u-checkbox_error': error }">
    <slot/>
    <input :id="`input-${uuid}`" @input="onInput" type="checkbox" :checked="value">
    <span class="u-checkbox__checkmark"></span>
  </label>
</template>

<script>
import UUID from '@/mixins/uuid.mixin.js';


export default {
  mixins: [ UUID ],
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    error: Boolean
  },
  data: () => ({
  }),
  computed: {

  },
  methods: {
    onInput(event){
      this.$emit('input', event.target.checked);
    },
  },
}
</script>

<style lang="scss">
@import '@/styles/vars';
@import '@/styles/mixins';

a{
  color: #3C54AC;
  text-decoration: none;
}

.u-checkbox{
  &_error{
    .u-checkbox__checkmark{
      border: 1px solid $clr-error;
    }
  }
}

.u-checkbox {
  display: inline-block;
  position: relative;
  padding-left: 25px;
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  font-family: Poppins, sans-serif;
  font-style: normal;
  font-weight: 300;
  font-size: 13px;
}

.u-checkbox input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.u-checkbox__checkmark {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: 0;
  height: 16px;
  width: 16px;
  border: 1px solid #C4C4C4;
  box-sizing: border-box;
  transition: all .3s;
}

.u-checkbox:hover input ~ .u-checkbox__checkmark {
  background-color: white;
}

.u-checkbox input:checked ~ .u-checkbox__checkmark {
  background-color: #203B9A;
}

.u-checkbox__checkmark:after {
  content: "";
  position: absolute;
  opacity: 0;
}

.u-checkbox input:checked ~ .u-checkbox__checkmark:after {
  opacity: 1;
  transition: all .3s;
}

.u-checkbox .u-checkbox__checkmark:after {
  left: 4px;
  top: 2px;
  width: 5px;
  height: 8px;
  border: solid white;
  border-width: 0 2px 2px 0;
  -webkit-transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  transform: rotate(45deg);
}

@include media(">phone", "<=tablet") {
  .u-checkbox{
    font-size: 10px;
  }
}
</style>
