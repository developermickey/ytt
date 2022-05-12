<template>
  <div class="u-autocomplete">
    <label class="u-autocomplete__input" :for="'input-' + uuid">
      <div class="u-autocomplete__label">{{label}}</div>
      <div class="u-autocomplete__selections u-py-2">

        <template v-if="computedValue">
          <template v-if="multiple">
            <div
              class="u-autocomplete__chip u-ma-1 u-px-11"
              v-for="item in computedValue"
              :key="item.id"
            >
              {{item[itemText]}}
            </div>
          </template>
          <template v-else>
            <div
              class="u-autocomplete__chip u-ma-1 u-px-11"
            >
              {{computedValue[itemText]}}
            </div>
          </template>
        </template>


<!--        <input -->
<!--          :id="'input-' + uuid"-->
<!--          type="text" -->
<!--          v-model="autocomplete"-->
<!--          @input="handleFilter"-->
<!--          @keyup.delete="deleteLastItem"-->
<!--        >-->
        <div class="u-autocomplete__cross" @click="toggleOpen">+</div>
      </div>
    </label>
    <div class="u-autocomplete__list" v-if="isOpen">
      <vue-scroll>
        <div class="u-autocomplete__list-inner">
          <div
            class="u-autocomplete__list-item u-flex is-align-center u-px-12"
            v-for="item in computedItems"
            :key="item.id"
            @click="toggleItem(item)"
            :class="{ 'is-active' : item.isSelected }"
          >
            {{item[itemText]}}
            <svg
              v-show="item.isSelected"
              class="u-autocomplete__check-icon"
              v-svg
              symbol="icon-check"
            ></svg>
          </div>
        </div>
      </vue-scroll>
    </div>
  </div>
</template>

<script>
// import { UsersApi } from '@/api';
import UUID from '@/mixins/uuid.mixin';

export default {
  mixins: [ UUID ],
  data: () => ({
    autocomplete: '',
    isOpen: false,
  }),
  props: {
    value: {
      type: [Array, Object],
      default: null,
    },
    label: {
      type: String,
      default: '',
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    items: {
      type: Array,
      default: () => [],//objects
    },
    itemText: {
      type: String,
      default: 'name',
    }
  },
  computed: {
    computedItems(){
      let compItems = [];
      let selectedVals = [];

      if(this.value){
        if(this.multiple){
          selectedVals = this.value.map(item => item.id);
        }
        else{
          selectedVals.push(this.value.id);
        }
      }
      // console.log('selectedVals',selectedVals);

      compItems = this.items.map(item => {
        if(selectedVals.includes(item.id)){
          item.isSelected = true;
        }
        else{
          item.isSelected = false;
        }
        return item;
      });

      return compItems;
    },
    computedValue(){
      let computedValue = null;
      if(this.value){
        if(this.multiple){
          computedValue = this.value.map(item => {
            let resItem = this.computedItems.find(compItem => compItem.id === item.id);
            return resItem;
          });
          computedValue = computedValue.filter(e => e !== undefined);
        }
        else{
          computedValue = this.computedItems.find(compItem => compItem.id === this.value.id);
        }
      }

      return computedValue;
    },
  },
  methods: {
    toggleOpen(){
      this.isOpen = !this.isOpen;
    },
    toggleItem(item){
      //TODO: remove selection from item
      if(item.isSelected){

        if(this.multiple){

          console.log('Comp Value before ',this.computedValue);

          let removeIndex = this.computedValue.map(curItem => curItem.id).indexOf(item.id);
          console.log('removeIndex ', removeIndex);


          let resVal = [ ...this.computedValue ];
          resVal.splice(removeIndex, 1);
          console.log('resVal after ', resVal);

          this.$emit('input', resVal);
        }
        else{
          this.$emit('input', null);
        }
      }
      else{
        if(this.multiple){
          this.$emit('input', [ ...this.computedValue, item]);
        }
        else{
          this.$emit('input', item);
        }
      }
    },
    handleFilter(event){
      console.log(event.target.value);
    },
    deleteLastItem(){
      if(this.computedValue !== null){
        if(this.multiple){
          let resVal = [ ...this.computedValue ];
          resVal.pop();
          this.$emit('input',   resVal);
        }
        else{
          this.$emit('input', null);
        }
      }
    }
  },
  mounted(){

  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/vars';
@import '@/styles/mixins';

.u-autocomplete{
  font-size: 18px;
  font-weight: 300;
  &__list{
    height: 300px;
    box-shadow: 0px 12px 66px rgba(0, 0, 0, 0.15);
    background: #fff;
    padding: 20px;
    &-inner{
      padding-right: 20px;
    }
  }
  &__list-item{
    font-size: 18px;
    font-weight: 300;
    height: 78px;
    cursor: pointer;
    position: relative;
    &:hover,
    &.is-active{
      color: $clr-blue;
      background-color: rgba($clr-blue, .1);
    }
    &:hover{
    }
    &.is-active{
      //background: url('~@/assets/svg/check.svg') no-repeat center, rgba($clr-blue, .1);
      background-size: 39px 26px;
    }
  }
  &__check-icon{
    width: 36px;
    height: 26px;
    stroke-width: 2px;
    stroke: $clr-blue;
    fill: none;
    position: absolute;
    right: 30px;
  }
  &__label{
    font-size: 30px;
  }
  &__input{
    display: block;
    margin-bottom: 2px;
    border-bottom: 1px solid rgba(0,0,0, .2);
  }
  &__selections{
    display: flex;
    flex: 1 1;
    flex-wrap: wrap;
    align-items: center;
    max-width: 100%;
    min-width: 0;
    position: relative;
    padding-right: 90px;
    padding-left: 15px;
    min-height: 70px;

    input{
      flex: 1 1;
      margin-top: 0;
      min-width: 0;
      pointer-events: none;
      position: relative;
      background-color: transparent;
      border-style: none;
      outline: none;
    }
  }
  &__chip{
    display: flex;
    align-items: center;
    justify-content: center;
    height: 46px;
    font-size: 18px;
    border-radius: 23.5px;
    background-color: rgba($clr-blue, .2);
    color: $clr-blue;
  }

  &__cross{
    width: 46px;
    height: 46px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 24px;
    font-weight: 300;
    color: #fff;
    background-color: $clr-blue;
    border-radius: 50%;
    position: absolute;
    right: 30px;
    top: 12px;
    cursor: pointer;
    user-select: none;
  }
}
@include media(">phone", "<=tablet") {
.u-autocomplete{
  &__cross{
    width: 33px;
    height: 33px;
    top: unset;
    bottom: 8px;
  }
 &__chip{
   height: 33px;
 }
  &__selections{
    padding-bottom: 0!important;
  }
  &__list-item{
    height: 60px;
  }
  &__label{
    font-size: 18px;
  }
}

}
</style>
