<template>
  <ContentContainer>
    <div class="teacher-students-list-view">
      <div class="teacher-students-list-view__header">
        <div class="u-text-h2">Students</div>
      </div>

      <StudentsList></StudentsList>
      <GiveCoins></GiveCoins>
    </div>
  </ContentContainer>
</template>

<script>
import ContentContainer from "@/components/common/ContentContainer";
import StudentsList from "@/components/teacher/students/StudentsList";
import GiveCoins from "@/components/modals/GiveCoins";

export default {
  components: {
    ContentContainer,
    StudentsList,
    GiveCoins
  }
}
</script>

<style lang="scss">
@import "@/styles/mixins";

@include media(">phone", "<=tablet") {
  .teacher-students-list-view{
    padding-top: 30px;

    &__header{
      padding-left: 15px;
      margin-bottom: 20px;
    }
  }
}
</style>
