<template>
  <div
    class="back-button"
    @click="$router.go(-1)"
  >
    <div class="back-button__icon-wrap">
      <svg
        class="back-button__icon"
        v-svg
        symbol="arrow-left"
      ></svg>
    </div>
    <span class="back-button__text" v-if="label.length">{{label}}</span>
  </div>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      default: 'Back'
    }
  }
}
</script>

<style lang="scss">
@import "@/styles/vars";
@import "@/styles/mixins";

.back-button{
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  &__icon{
    fill: $clr-blue;
    height: 24px;
    width: 14px;
  }
  &__text{
    color: $clr-blue;
    margin-left: 14px;
  }
}
@include media(">phone", "<=tablet") {
  .back-button__text{
    margin-left: 5px;
  }
  .back-button__icon{
    height: 14px;
  }
}
</style>
