<template>
  <div 
    class="u-card"
    :class="classes"  
  >
    <slot></slot>
  </div>
</template>

<script>
import ElevationMixin from '@/mixins/elevation.mixin';

export default {
  mixins: [
    ElevationMixin,
  ],
  props: {
    elevation: {
      type: [Number, String],
      default: 3,
    },
  },
  computed: {
    classes(){
      return {
        ...this.elevationClasses, 
      };
    }
  }
}
</script>

<style lang="scss">
.u-card{
  background: #fff;
  border-radius: 28px;
  max-width: 100%;
  overflow: hidden;
}

.u-table-card{
  box-shadow: 0px 12px 66px rgba(0, 0, 0, 0.08);
  border-radius: 28px;

}
</style>