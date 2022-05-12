<template>
  <ContentContainer>
    <UAutocomplete
      v-model="selectedStudent"
      :items="studentsList"
    >
    </UAutocomplete>
    <UTextField
      label="count"
      v-model="amount"
    ></UTextField>
    <UBtn @click="onSubmit">Save</UBtn>
  </ContentContainer>
</template>

<script>
import ContentContainer from "@/components/common/ContentContainer";
import UAutocomplete from '@/components/common/UAutocomplete/UAutocomplete.vue';
import UTextField from "@/components/common/UTextField";
import {mapActions, mapMutations, mapGetters} from "vuex";

export default {
  data: () => ({
    selectedStudent: null,
    amount: 0,
  }),
  components: {
    ContentContainer,
    UAutocomplete,
    UTextField,
  },
  computed: {
    ...mapGetters('Students', ['studentsList']),
    ...mapGetters('Auth', ['userRole']),
  },
  methods: {
    ...mapActions('Students', {
      getStudents : 'fetchStudentsList',
    }),
    ...mapActions('Coins', ['charge']),
    ...mapMutations('Students', ['RESET_STUDENTS_LIST']),
    onSubmit(){
      this.charge({
        role: this.userRole,
        userId: this.selectedStudent.id,
        amount: this.amount,
      }).then(() => {
        this.$notify({
          title: 'Success!',
          text: 'Successfully charged coins',
          type: 'success'
        })
      }).catch(({ message }) => {
        this.$notify({
          title: 'charge coins error',
          text: message,
          type: 'error'
        })
      });
    }
  },
  mounted() {
    this.getStudents(this.userRole);
  },
  beforeDestroy() {
    this.RESET_STUDENTS_LIST();
  },
}
</script>

<style scoped>

</style>