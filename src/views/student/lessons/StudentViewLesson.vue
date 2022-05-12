<template>
  <ShuffleLessonView 
    :displayVoiceRecord="true"
    :displayLessonTimer="false"
  ></ShuffleLessonView>
</template>

<script>
import ShuffleLessonView from "@/components/lessons/ShuffleLessonView";

export default {
  components: {
    ShuffleLessonView,
  },
}
</script>

<style lang="scss" scoped>
@import '@/styles/vars';

.student-pass-lesson{
  &__tabs::v-deep{
    .u-tabs__header{
      margin-bottom: 30px;
    }
  }

  &__ytt-recorder,
  &__submit{
    margin-right: 36px;
    margin-left: 36px;
  }

}
</style>
