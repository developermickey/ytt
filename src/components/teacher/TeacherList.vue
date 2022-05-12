<!--used to display list of teachers on Lesson creation page -->
<template>
  <div class="teacher-list">
    <div
      class="teacher-list__column"
      v-for="item in value"
      :key="item.id"
    >
      <div
        class="teacher-list__item"
      >
        <div class="teacher-list__item-avatar" :style="getAvatarStyle(item)"></div>
        <span class="teacher-list__item-name">{{ item.name }}</span>
      </div>
    </div>
    <div
      class="teacher-list__column teacher-list__btn-column"
      >
      <button
        @click="showModal"
        class="teacher-list__add-btn"
        id="lesson_open_modal_select_teacher"
      >
        +
      </button>
    </div>

    <select-teacher
      :value="value"
      @input="onSelectTeachers"
      multiple
    ></select-teacher>
  </div>
</template>

<script>
import UCard from '@/components/common/UCard.vue';
import UAutocomplete from '@/components/common/UAutocomplete/UAutocomplete.vue';

import SelectTeacher from '@/components/modals/SelectTeacher';

// eslint-disable-next-line no-unused-vars
import { UsersApi } from '@/api/users.api';

export default {
  data: () => ({
    items: [],
  }),
  props: {
    value: {
      type: Array,
      required: true,
    }
  },
  components: {
    // eslint-disable-next-line vue/no-unused-components
    UCard,
    // eslint-disable-next-line vue/no-unused-components
    UAutocomplete,
    SelectTeacher,
  },
  methods: {
    getAvatarStyle(item){
      let style;
      if(item.avatar){
        style = { backgroundImage: `url(${item.avatar})`, }
      }
      return style;
    },
    showModal(){
      this.$modal.show('select-teacher');
    },
    hideModal(){
      this.$modal.hide('select-teacher');
    },
    onSelectTeachers(teachers){
      this.$emit('input', teachers);
    },
  }
}
</script>

<style lang="scss">
@import "@/styles/vars";
@import "@/styles/mixins";

.teacher-list{
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  &__column{
    flex-basis: calc(50% - 19px);
    margin-bottom: 17px;
  }
  &__item{
    height: 86px;
    display: flex;
    align-items: center;
    position: relative;
    background-color: #fff;
    box-shadow: 0px 12px 66px rgba(0, 0, 0, 0.03);
    border-radius: 62px;
    width: 100%;
    padding-right: 13px;
    padding-left: 100px;
  }
  &__item-avatar{
    height: 86px;
    width: 86px;
    border-radius: 50%;
    position: absolute;
    left: 0;
    background-color: red;
    background-size: cover;
  }
  &__item-name{
    font-weight: 300;
  }

  &__btn-column{
    min-height: 86px;
    display: flex;
    align-items: center;
  }
  &__add-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 45px;
    height: 45px;
    border: none;
    border-radius: 50%;
    padding: 0;
    background-color: $clr-blue;
    font-size: 24px;
    color: #fff;
    font-weight: 300;
    outline: none;
    cursor: pointer;
  }
}
@include media(">phone", "<=tablet") {
  .teacher-list{

    &__item{
      height: 47px;
      padding-left: 60px;
      width: 85%;
      &-avatar{
        height: 47px;
        width: 47px;
      }
    }
  }
}

</style>
