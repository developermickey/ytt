<template>
  <modal
    name="comment-modal"
    :width="deviceWidth"
    height="auto"
    classes="u-modal"
    scrollable
  >
    <u-card class="u-modal-card u-px-24 u-pt-24 u-pb-15">
      <div class="u-alert__title-modal u-text-center">
        {{ title }}
      </div>
      <div class="d-block mx-auto">
        <slot name="comment"></slot>
      </div>

      <div class="text-center u-mt-2 ">
        <UBtn
          style="width:200px;font-size:25px !important;"
          color="primary"
          size="x-large"
          @click="save"
        >
          {{ saveTitle }}
        </UBtn>
        <UBtn
          style="width:200px; font-size:25px !important;"
          class="ml-4"
          color="secondary"
          size="x-large"
          @click="closeModal"
        >
          {{ closeTitle }}
        </UBtn>
      </div>
    </u-card>
  </modal>
</template>

<script>
import UCard from "@/components/common/UCard.vue";

export default {
  props: {
    title: {
      type: String,
      default: "active",
    },
    saveTitle: {
      type: String,
      default: "Yes",
    },
    closeTitle: {
      type: String,
      default: "No",
    },
  },
  components: {
    UCard,
  },

  methods: {
    save() {
      this.$emit("save");
      this.$modal.hide("confirm-modal");
    },
    closeModal() {
      this.$emit("closeModal");
      this.$modal.hide("confirm-modal");
    },
  },
  computed: {
    deviceWidth() {
      return "800px";
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/mixins";
.u-alert__title-modal {
  font-size: 34px;
  line-height: 50px;
  font-weight: 300;
  margin-bottom: 35px;
}

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
