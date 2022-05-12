<template>
  <div :class="classes">
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    centered: {
      type: Boolean,
      default: true,
    },
    offsetTop: {
      type: Boolean,
      default: true,
    },
    offsetBottom: {
      type: Boolean,
      default: true,
    }
  },
  computed: {
    classes(){
      return {
        'content-container' : true,
        'content-container_centered': this.centered,
        'content-container_offset-top': this.offsetTop,
        'content-container_offset-bottom': this.offsetBottom,
      }
    }
  }
}
</script>

<style lang="scss">
@import "@/styles/vars";
@import "@/styles/mixins";

.content-container{
  width: $content-width-xl;

  &_centered{
    margin-right: auto;
    margin-left: auto;
  }
  &_offset-top{
    margin-top: 40px;
  }
  &_offset-bottom{
    margin-bottom: 100px;
  }
}


@include media(">phone", "<=tablet") {
  .content-container{
    width: 100%;
    &_offset-top{
      margin-top: 58px;
    }
  }
}
</style>
