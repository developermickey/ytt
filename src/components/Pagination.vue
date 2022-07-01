<template>
  <div class="d-flex mt-4 flex-wrap justify-content-center">
    <button
      class="px-4  m-2 btn btn btn-outline-primary rounded paginatinButton"
      @click="setPagination(paginationLinks[0])"
    >
      Previous
    </button>
    <button
      class="px-4 m-2 btn btn btn-outline-primary rounded paginatinButton"
      @click="setPagination(link)"
      v-for="link in paginationLinks.slice(1, paginationLinks.length - 1)"
      :key="link.label"
      :class="{ active: link.url == activeLink }"
    >
      <span>{{ link.label }}</span>
    </button>
    <button
      class="px-4 m-2 btn btn btn-outline-primary rounded paginatinButton"
      @click="setPagination(paginationLinks[paginationLinks.length - 1])"
    >
      Next
    </button>
  </div>
</template>

<script>
export default {
  props: {
    audio: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      // paginationLinks: []
    };
  },
  computed: {
    paginationLinks() {
      return this.$store.getters["Students/pagination"];
    },
    activeLink() {
      return this.$store.getters["Students/activeLink"];
    },
  },
  methods: {
    setPagination(link) {
      if (this.audio) {
        this.$store.dispatch("Students/setPaginationAudio", link);
      } else {
        this.$store.dispatch("Students/setPagination", link);
      }
    },
  },
};
</script>

<style lang="scss">
@import "@/styles/vars";
.active {
  background: $clr-primary !important;
}
</style>
