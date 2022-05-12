<template>
  <modal name="select-student" :width="deviceWidth" height="auto" classes="u-modal" scrollable>
    <u-card class="u-modal-card u-px-24 u-pt-24 u-pb-15">

      <slot name="title">
        <div class="u-text-h2 u-text-center">Choose Student</div>
      </slot>

      <u-autocomplete
        :value="value"
        :items="studentsList"
        @input="onSelectItems"
        :multiple="multiple"
      >
      </u-autocomplete>
      <div class="u-flex is-justify-center u-mt-2">
        <UBtn
          @click="save"
          color="primary"
          size="x-large"
          id="select_student_modal_submit"
          class="save--button"
        >
          Save
        </UBtn>
      </div>
    </u-card>
  </modal>
</template>

<script>
import {mapActions, mapGetters, mapMutations} from 'vuex';

import UCard from '@/components/common/UCard.vue';
import UAutocomplete from '@/components/common/UAutocomplete/UAutocomplete.vue';

export default {
  components: {
    UCard,
    UAutocomplete,
  },
  data: () => ({
    items: [],
  }),
  props: {
    value: {
      type: [Object, Array],
      default: null,
    },
    multiple: {
      type: Boolean,
      default: false,
    }
  },
  computed: {
    ...mapGetters('Students', ['studentsList']),
    ...mapGetters('Auth', ['userRole']),
    deviceWidth(){
      const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
      return vw > 1250 ? '1250px' : '100%'
    }
  },
  methods: {
    ...mapActions('Students', {
      getItems : 'fetchStudentsList',
    }),
    ...mapMutations('Students', ['RESET_STUDENTS_LIST']),
    onSelectItems(items){
      this.$emit('input', items);
    },
    hideModal(){
      this.$modal.hide('select-student');
    },
    save(){
      this.$emit('save');
      this.hideModal();
    },
  },
  mounted(){
    this.getItems(this.userRole);
  },
  beforeDestroy() {
    this.RESET_STUDENTS_LIST();
  },
}
</script>

<style lang="scss" scoped>
@import "@/styles/mixins";

@include media(">phone", "<=tablet") {
  .u-modal-card{
    padding: 37px 15px!important;
  }
  .save--button{
    width: 100%;
    height: 42px;
    margin-top: 13px;
  }
}
</style>
