<template>
  <div class="teacher-students-list">
    <StudentsListItem
      v-for="item in students"
      :key="item.id"
      v-bind="item"
      @open-select-lessons-modal="openSelectLessonsModal(item)"
    ></StudentsListItem>

    <SelectLesson
      v-model="selectedLessons"
      @save="shareLessonsToStudent"
      multiple
    ></SelectLesson>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { TEACHER } from "@/constants/roles";

import SelectLesson from "@/components/modals/SelectLesson";
import StudentsListItem from "@/components/teacher/students/StudentsListItem";


export default {
  data: () => ({
    selectedStudent: null,
    selectedLessons: [],
  }),
  components: {
    StudentsListItem,
    SelectLesson
  },
  methods: {
    ...mapActions('Students', {
      fetchStudents : 'fetchStudentsList',
      addAccessToLessons: 'addAccessToLessons',
    }),
    openSelectLessonsModal(student){
      this.selectedStudent = student;
      this.selectedLessons = [ ...student.lessons ];
      this.$modal.show('select-lesson');
    },
    shareLessonsToStudent(){
      this.addAccessToLessons({
        studentId: this.selectedStudent.id,
        lessons: this.selectedLessons.map(e => e.id),
      });
    },
  },
  computed: {
    ...mapGetters('Students', {
      students: 'studentsList'
    })
  },
  mounted(){
    this.fetchStudents(TEACHER);
  }
}
</script>

<style lang="scss">
@import "@/styles/mixins";

.teacher-students-list{
  .teacher-students-list-item{
    padding-top: 26px;
    padding-bottom: 23px;
    border-bottom: 1px solid rgba(0,0,0,.2);
  }
}
@include media(">phone", "<=tablet") {
  .teacher-students-list{
    .teacher-students-list-item{
      padding: 10px;
    }
  }
}
</style>
