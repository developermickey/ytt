<template>
  <div class="ytt-loader" :class="{ 'ytt-loader_show': show }">
    <div class="ytt-loader__wrap">
      <svg
        v-svg
        symbol="icon-loader"
        size="0 0 72 72"
        class="ytt-loader__icon"
      />
      <div class="ytt-loader__text">
        loading
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    show: Boolean,
    transparent: Boolean,
  },
};
</script>

<style lang="scss" scoped>
@keyframes spin {
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
.ytt-loader {
  position: fixed;
  height: 100%;
  width: 100%;
  opacity: 0;
  visibility: hidden;
  transition: all 0.5s;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: white;
  z-index: 9999;

  &_show {
    opacity: 1;
    visibility: visible;
    transition: none;
  }

  &__wrap {
    display: flex;
    align-items: center;
  }
  &__icon {
    margin-right: 32px;
    animation: spin 2s linear infinite;
    fill: #2c4cc1;
  }
  &__text {
    color: #131313;
    font-family: Poppins, sans-serif;
    font-size: 28px;
  }
}
</style>
