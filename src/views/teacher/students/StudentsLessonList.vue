<template>
  <ContentContainer>
    <div class="teacher-students-lessons-list-view">
      <div class="teacher-students-lessons-list-view__header">
        <div class="u-text-h2">
          Lessons of
          <span class="teacher-students-lessons-list-view__student-name">{{ username }}</span>
        </div>
      </div>
    </div>

    <StudentsLessonsList></StudentsLessonsList>
  </ContentContainer>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import ContentContainer from "@/components/common/ContentContainer";
import StudentsLessonsList from "@/components/teacher/students/StudentsLessonsList";
import {TEACHER} from "@/constants/roles";

//TODO: load student and display his name dynamically

export default {
  components: {
    ContentContainer,
    StudentsLessonsList,
  },
  computed: {
    ...mapGetters('Students', ['student']),
    username(){
      let username = ''
      if(this.student){
        username = this.student.name || this.student.email;
      }
      return username;
    },
  },
  methods: {
    ...mapActions('Students', ['fetchStudent']),
  },
  mounted(){
    this.fetchStudent({
      id: this.$route.params.id,
      role: TEACHER,
    });
  }
}
</script>

<style lang="scss">
@import "@/styles/vars";
@import "@/styles/mixins";

.teacher-students-lessons-list-view{
  &__student-name{
    color: $clr-blue;
  }
}

@include media(">phone", "<=tablet") {
  .teacher-students-lessons-list-view{
    &__header{
      padding-top: 15px;
    }
  }
}
</style>