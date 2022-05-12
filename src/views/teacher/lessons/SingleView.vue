<template>
  <ShuffleLessonView 
    :displayVoiceRecord="false" 
    :shouldFetchLesson="false" 
    :displayLessonTimer="true" 
    :displayHidings="true"
    :displayLogs="true"
  ></ShuffleLessonView>
</template>

<script>
import ShuffleLessonView from "@/components/lessons/ShuffleLessonView";
import { mapActions, mapGetters } from 'vuex';

export default {
  components: {
    ShuffleLessonView
  },
  methods: {
    ...mapActions('Lessons', ['fetchStudentsLesson']),
  },
  computed: {
    ...mapGetters('Auth', ['userRole']),
  },
  mounted(){

    this.fetchStudentsLesson({
      studentId: this.$route.params.studentId,
      lessonId: this.$route.params.id,
    })
      .catch(({ message }) => {
        this.$notify({
          title: 'Lesson load error',
          text: message,
          type: 'error'
        });
      });
  }
}
</script>

<style lang="scss">

</style>