<template>
  <div class="u-alert" :class="compClasses">
    <UCard elevation="0" class="u-alert__card">
      <div class="u-alert__title">{{title}}</div>
      <div class="u-alert__message" v-if="message" v-html="message"></div>
      <div class="u-alert__buttons">

        <UBtn
          v-if="showConfirmButton"
          class="u-alert__btn u-alert__btn_confirm"
          v-bind="compConfirmBtnProps"
          @click="onConfirmClick"
        >
          {{confirmButtonText}}
        </UBtn>
        <UBtn
          v-if="showCancelButton"
          class="u-alert__btn u-alert__btn-cancel"
          v-bind="compCancelBtnProps"
          @click="onCancelClick"
        >
          {{cancelButtonText}}
        </UBtn>

      </div>
    </UCard>
  </div>
</template>

<script>
import UCard from "@/components/common/UCard";

const defaultConfirmBtnProps = {
  size: 'x-large',
  color: 'primary',
  width: 307,
}
const defaultCancelBtnProps = {
  size: 'x-large',
  color: 'blue',
  width: 307,
  outlined: true,
}

export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    message: {
      type: String,
      default: '',
    },
    classes: {
      type: [String, Array, Object],
      default: () => '',
    },
    showConfirmButton: {
      type: Boolean,
      default: true,
    },
    confirmButtonProps: {
      type: Object,
      default: () => {},
    },
    confirmButtonText: {
      type: String,
      default: 'OK',
    },
    onConfirm: {
      type: Function,
      default: null,
    },
    showCancelButton: {
      type: Boolean,
      default: false,
    },
    cancelButtonProps: {
      type: Object,
      default: () => defaultCancelBtnProps,
    },
    cancelButtonText: {
      type: String,
      default: 'Cancel',
    },
    onCancel: {
      type: Function,
      default: null,
    },
  },
  components: {
    UCard,
  },
  computed: {
    compClasses(){
      return this.classes;
    },
    compConfirmBtnProps(){
      return { ...defaultConfirmBtnProps, ...this.confirmButtonProps };
    },
    compCancelBtnProps(){
      return { ...defaultCancelBtnProps, ...this.cancelButtonProps}
    }
  },
  methods: {
    onConfirmClick(){
      if(this.onConfirm !== null){
        this.onConfirm();
      }
      this.$emit('close');
    },
    onCancelClick(){
      if(this.onCancel !== null){
        this.onCancel();
      }
      this.$emit('close');
    },
  }
}
</script>

<style lang="scss">
@import "@/styles/mixins";
.u-alert{
  width: 1140px;
  &__card{
    padding: 60px 60px 70px;
  }
  &__title{
    font-size: 48px;
    line-height: 64px;
    font-weight: 300;
    text-align: center;
    margin-bottom: 35px;
  }
  &__message{
    font-size: 22px;
    text-align: center;
    font-weight: 300;
    margin-bottom: 35px;
  }
  &__buttons{
    display: flex;
    justify-content: center;
  }
  &__btn{
    margin-right: 12.5px;
    margin-left: 12.5px;
  }
}
@include media(">phone", "<=tablet") {
  .u-alert {
    width: 100%;
    &__title{
      font-size: 24px;
      line-height: 30px;
    }
  }
}
</style>
