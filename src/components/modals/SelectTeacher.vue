<template>
  <modal name="select-teacher" :width="deviceWidth" height="auto" classes="u-modal" scrollable>
    <u-card class="u-modal-card u-px-24 u-pt-24 u-pb-15">
      <div class="u-text-h2 u-text-center">Choose Teacher</div>
      <u-autocomplete
        :value="value"
        :items="items"
        @input="onSelectTeachers"
        :multiple="multiple"
        label="Choose teacher"
      >
      </u-autocomplete>
      <div class="u-flex is-justify-center u-mt-2">
        <UBtn
          color="primary"
          size="x-large"
          @click="save"
          id="select_teacher_modal_submit"
        >
          Save
        </UBtn>
      </div>
    </u-card>
  </modal>
</template>

<script>
import { UsersApi } from '@/api';

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
  methods: {
    onSelectTeachers(teachers){
      this.$emit('input', teachers);
    },
    save(){
      this.$emit('save');
      this.$modal.hide('select-teacher');
    },
    getItems(){
      UsersApi.getPage({per_page: 10000, role: 2}).then(response => {
        this.items = response.data;
      })
    },
  },
  mounted(){
    this.getItems();
  },
  computed:{
    deviceWidth(){
      const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
      return vw > 1250 ? '1250px' : '100%'
    }
  }
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
