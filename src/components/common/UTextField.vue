<template>
  <div
    class="u-text-field"
    :class="{
      'u-text-field_inset': inset,
      'u-text-field_error': error,
      'u-text-field_padding': padding,
    }"
  >
    <div class="u-text-field__input-wrap">
      <label :for="`input-${uuid}`">{{label}}</label>
      <div class="u-text-field__input-container">
        <input
          :id="'input-' + uuid"
          :type="inputType"
          :value="value"
          :placeholder="placeholder"
          @input="onInput"
        />
        <div class="u-text-field__append-icon" @click="togglePasswordVisibility" :class="{'u-text-field__append-icon_clickable': isPassword}" v-if="icon">
          <svg
              v-svg
              :symbol="icon"
              size="0 0 20 20"
          ></svg>
        </div>
        <div v-if="typeof error === 'string'" class="u-text-field__messages">{{ `${error && '*'}${error}` }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import UUID from '@/mixins/uuid.mixin.js';


export default {
  mixins: [ UUID ],
  props: {
    label: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: 'text',
    },
    value: {
      default: ''
    },
    placeholder: {
      type: String,
      default: '',
    },
    inset: {
      type: Boolean,
      default: false,
    },
    error: {
      default: ''
    },
    appendIcon: {
      type: String,
      default: '',
    },
    padding: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    showPassword: false
  }),
  computed: {
    icon: function() { return this.isPassword ? 'icon-eye' : this.appendIcon },
    isPassword: function() { return this.type === 'password' },
    inputType: function(){ return this.isPassword ? this.showPassword ? 'text' : this.type : this.type }
  },
  methods: {
    onInput(event){
      this.$emit('input', event.target.value);
    },
    togglePasswordVisibility(){
      if(this.isPassword)
        this.showPassword = !this.showPassword;
    }
  },
}
</script>

<style lang="scss">
@import '@/styles/vars';
@import '@/styles/mixins';

.u-text-field{
  max-width: 100%;
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  position: relative;
  &__input-wrap{
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    flex-wrap: wrap;
    min-width: 0;
    width: 100%;
    height: 100%;
    position: relative;
    &:before{
      content: '';
      border-color: rgba(0,0,0,.42);
      border-width: thin 0 0 0;
      border-style: solid;
      bottom: -1px;
      left: 0;
      position: absolute;
      transition: .3s cubic-bezier(.25,.8,.5,1);
      width: 100%;
    }
  }

  &_padding{
    input{
      padding: 8px 8px 0 18px !important;
    }
    label{
      padding-left: 18px;
    }
  }

  &__input-container{
    position: relative;
  }
  input{
    flex: 1 1 auto;
    line-height: 38px;
    padding: 8px 8px 0 0;
    max-width: 100%;
    min-width: 0;
    width: 100%;
    font-weight: 300;

    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }

    &[type=number] {
      -moz-appearance: textfield;
    }


    background-color: transparent;
    border-style: none;
    outline: none;
    &::placeholder{
      color: rgba(0,0,0,.2);
    }
  }
  label{
    font-size: 24px;
    color: #000;
    font-weight: 300;
    line-height: 50px;
  }
  &__messages{
    position: absolute;
    right: 65px;
    top: 50%;
    transform: translateY(-50%);
    line-height: 24px;
    font-size: 12px;
    color: $clr-error;
  }

  &_inset{
    // TODO: padding-right 20px, padding-left: 20px;
  }
  &_error{
    input{
      color: $clr-error !important;
    }
    .u-text-field__input-wrap:before{
      border-color: $clr-error !important;
    }
    .u-text-field__append-icon{
      svg{
        fill: #F44444 !important;
      }
    }
  }

  &__append-icon{
    position: absolute;
    right: 20px;
    top: 50%;
    height: 20px;
    width: 20px;
    transform: translateY(-50%);
    svg{
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    &_clickable{
      cursor: pointer;
    }
  }
}

@include media(">phone", "<=tablet") {
  .u-text-field{
    &__input-wrap {
      input {
        padding: 0 8px 0 8px !important;
      }
      label{
        font-size: 16px;
        line-height: 24px;
        padding-left: 0;
      }
    }
    &_padding {
      input {
        padding: 0 8px 0 8px !important;
      }
      label{
        font-size: 16px;
        line-height: 24px;
        padding-left: 0;
      }
    }
    &__messages{
      right: 65px;
    }
  }
}
</style>
