<template>
  <div v-show="isActive">
    <slot></slot>
  </div>
</template>

<script>
import UUID from '@/mixins/uuid.mixin';

export default {
  mixins: [ UUID ],
  data: () => ({
    isActive: false,
  }),
  props: {
    label: {
      type: String,
      default: 'Tab name'
    },
    index: Number
  },
  mounted(){
  }
}
</script>

<style>

</style>