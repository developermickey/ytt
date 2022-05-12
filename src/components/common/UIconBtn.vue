<template>
  <div
    class="u-icon-btn"
    :class="classes"
    @click="onClick"
  >
    <svg
      class="u-icon-btn__icon"
      v-svg
      :symbol="icon"
    ></svg>
  </div>
</template>

<script>
export default {
  props: {
    to: {
      type: [ String, Object ],
      default: null,
    },
    hoverable: {
      type: Boolean,
      default: false,
    },
    icon: {
      type: String,
      required: true,
    },
    iconColor: {
      type: String,
      default: null,
    },
    iconHoverColor: {
      type: String,
      default: null,
    },
    bgColor: {
      type: String,
      default: null,
    },
    bgHoverColor: {
      type: String,
      default: null,
    }
  },
  computed: {
    classes(){
      return {
        'u-icon-btn_hoverable' : this.hoverable,
        [ `u-icon-btn_icon-color_${this.iconColor}` ] : this.iconColor !== null,
        [ `u-icon-btn_icon-hover-color_${this.iconHoverColor}` ] : this.iconHoverColor !== null,
        [ `u-icon-btn_bg-color_${this.bgColor}` ] : this.bgColor !== null,
        [ `u-icon-btn_bg-hover-color_${this.bgHoverColor}` ] : this.bgHoverColor !== null,
      };
    }
  },
  methods: {
    onClick(){
      if(this.to !== null){
        this.$router.push(this.to);
      }
    }
  }
}
</script>

<style lang="scss">
@import "@/styles/vars";
@import "@/styles/mixins";

.u-icon-btn{
  height: 40px;
  width: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;

  transition: all .25s ease-in-out;

  &_hoverable{
    cursor: pointer;
  }

  &__icon{
    width: 19px;
    height: 19px;
  }


  &_icon-color{
    &_transparent{
      .u-icon-btn__icon{
        fill: transparent;
      }
    }
    &_grey{
      .u-icon-btn__icon{
        fill: $clr-grey2;
      }
    }
    &_blue{
      .u-icon-btn__icon{
        fill: $clr-blue;
      }
    }
  }

  &_icon-hover-color{
    &_transparent:hover{
      .u-icon-btn__icon{
        fill: transparent;
      }
    }
    &_grey:hover{
      .u-icon-btn__icon{
        fill: $clr-grey2;
      }
    }
    &_blue:hover{
      .u-icon-btn__icon{
        fill: $clr-blue;
      }
    }
  }

  &_bg-color{
    &_transparent{
      background-color: transparent;
    }
    &_white{
      background-color: #fff;
    }
    &_blue{
      background-color: $clr-blue;
    }
  }

  &_bg-hover-color{
    &_transparent:hover{
      background-color: transparent;
    }
    &_white:hover{
      background-color: #fff;
    }
    &_blue:hover{
      background-color: $clr-blue;
    }
  }
}
@include media(">phone", "<=tablet"){
  .u-icon-btn {
    width: 20px;
    height: 20px;
    display: flex;
    align-items: flex-end;
    &__icon {
      width: 14px;
      height: 14px;
    }

  }
}
</style>
