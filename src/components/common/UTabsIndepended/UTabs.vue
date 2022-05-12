<template>
  <div
  :class="classes"
>
  <div class='u-tabs__header'>
    <div
      v-for="(tab, index) in tabs"
    :key="tab.label"
       class="u-tabs__tab"
    :class="{ 'u-tabs__tab_active' : index === value }"
    @click="handleTabClick(index)"
  >
    {{ tab.label }}
  </div>
</div>
<slot></slot>
</div>
</template>

<script>
  export default {
  data: () => ({
  tabs: [],
}),
  props: {
  disabled: {
  type: Boolean,
  default: false,
},
  value: {
  required: true,
  default: null,
},
},
  computed: {
  classes(){
  return {
  'u-tabs' : true,
  'u-tabs_disabled' : this.disabled,
}
}
},
  methods: {
  selectTab (i) {

  this.tabs.forEach((tab, index) => {
  tab.isActive = (index === i);
});
},
  handleTabClick(tabIndex){
  if(!this.disabled){
  this.selectTab(tabIndex);
  this.$emit('input', tabIndex);
}
}
},
  watch: {
    // eslint-disable-next-line no-unused-vars
  value(newValue, oldValue){
  this.selectTab(newValue);
}
},
  mounted () {
  this.selectTab(0)
},
  created(){
  this.tabs = this.$children;
}
  // render: function(createElement){
  //   return createElement('div', this.$slots.default);
  // },
}
</script>

<style lang="scss">
  @import "@/styles/vars";

  .u-tabs{
  &__header{
  display: flex;
  width: 100%;
}
  &__tab{
  flex-grow: 1;
  font-size: 24px;
  font-weight: 300;
  line-height: 40px;
  text-align: center;

  padding-bottom: 12px;
  border-bottom: 1px solid rgba(0,0,0,.1);
  color: rgba(0,0,0,.2);
  cursor: pointer;
  position: relative;
  &_active{
  color: #000;
  &:before{
  content: '';
  height: 3px;
  background-color: $clr-blue;
  position: absolute;
  left: 0;
  bottom: -2px;
  width: 100%;
}
}
}

  &_disabled{
  .u-tabs__tab{
  cursor: default;
}
}
}
</style>
