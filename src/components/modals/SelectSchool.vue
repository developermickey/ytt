<template>
  <modal
    name="select-school"
    :width="deviceWidth"
    height="auto"
    classes="u-modal"
    scrollable
  >
    <u-card class="u-modal-card u-px-24 u-pt-24 u-pb-15">
      <div class="u-text-h2 u-text-center">Choose school</div>
      <u-autocomplete
        :value="value"
        :items="schoolList"
        @input="onSelectTeachers"
        :multiple="multiple"
        label="Choose school"
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
import UCard from "@/components/common/UCard.vue";
import UAutocomplete from "@/components/common/UAutocomplete/UAutocomplete.vue";
import { mapActions } from "vuex";

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
    },
    type: {
      type: String,
      default: "",
    },
  },
  methods: {
    ...mapActions("Teachers", ["fetchTeachersList"]),
    onSelectTeachers(teachers) {
      this.$emit("input", teachers);
    },
    save() {
      this.$emit("save");
      this.$modal.hide("select-school");
    },
  },
  async mounted() {
    await this.$store.dispatch("School/fetchSchoolList");
  },
  computed: {
    schoolList() {
      return this.$store.getters["School/filteredSchoolList"];
    },
    deviceWidth() {
      const vw = Math.max(
        document.documentElement.clientWidth || 0,
        window.innerWidth || 0
      );
      return vw > 1250 ? "1250px" : "100%";
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/mixins";

@include media(">phone", "<=tablet") {
  .u-modal-card {
    padding: 37px 15px !important;
  }
  .save--button {
    width: 100%;
    height: 42px;
    margin-top: 13px;
  }
}
</style>
