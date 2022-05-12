<template>
  <ShuffleLessonView
    :display-tabs="false"
    :display-all-words="true"
    :display-voice-record="false"
  ></ShuffleLessonView>
</template>

<script>
import ShuffleLessonView from "@/components/lessons/ShuffleLessonView";

export default {
  components: {
    ShuffleLessonView,
  }
}
</script>

<style lang="scss" >

</style>