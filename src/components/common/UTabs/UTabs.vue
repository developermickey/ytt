<template>
  <div
    :class="classes"
    >
    <div class='u-tabs__header'>
      <div
        v-for="(item) in tabs"
        :key="item.label"
        class="u-tabs__tab"
        :class="{ 'u-tabs__tab_active' : item.index === tab}"
        @click="handleTabClick(item.index)"
      >
        {{ item.label }}
      </div>
    </div>
    <slot></slot>
  </div>
</template>

<script>
import { mapMutations, mapGetters } from 'vuex';

export default {
  data: () => ({
    tabs: [],
  }),
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    defaultActiveTab: {
      type: Number,
      default: 2,
    }
  },
  computed: {
    ...mapGetters('Words', ['tab']),
    classes(){
      return {
        'u-tabs' : true,
        'u-tabs_disabled' : this.disabled,
      }
    }
  },
  methods: {
    ...mapMutations('Words', ['SET_TAB']),
    selectTab (i) {
      this.SET_TAB(i);
      this.tabs.forEach((tab) => {
        tab.isActive = (tab.index === i);
      });
    },
    handleTabClick(tabIndex){
      if(!this.disabled){
        this.selectTab(tabIndex);
        this.$emit('input', tabIndex);
      }
    }
  },
  mounted () {
    this.selectTab(this.defaultActiveTab);
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
@import "@/styles/mixins";

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
    display: none;
    .u-tabs__tab{
      cursor: default;
    }
  }
}
@include media(">phone", "<=tablet") {
  .u-tabs__tab{
    font-size: 18px;
  }
}
</style>
