<template>
  <div class="l-app-main" :style="style">
    <slot></slot>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  data: () => ({

  }),
  computed: {
    ...mapGetters({
      paddingTop: 'Application/getTop',
      paddingLeft: 'Application/getLeft',
    }),
    style(){
      // console.log(this.paddingTop + 'px 0 0 ' + this.paddingLeft + 'px');
      const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
      return {
        paddingLeft: vw > 768 ? this.paddingLeft + 'px' : '0px',
        paddingTop: vw > 768 ? this.paddingTop + 'px' : '0px'
      }
    },
  },
}
</script>

<style lang="scss">
.l-app-main{
  width: 100%;
  height: 100%;
  flex: 1 0 auto;
  max-width: 100%;
  max-height: 100%;
}
</style>
