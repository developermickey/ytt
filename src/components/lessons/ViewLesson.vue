<template>
  <ContentContainer class="view-lesson">
    <div class="view-lesson__title-line">
      <BackBtn class="view-lesson__back-button"></BackBtn>
      <div class="u-text-h1">Lesson Name</div>
    </div>

    <LessonWordsList
      class="view-lesson__lesson-words-list"
      :words="allWords"
    ></LessonWordsList>
  </ContentContainer>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import BackBtn from "@/components/common/BackBtn";
import ContentContainer from "@/components/common/ContentContainer";
import LessonWordsList from "@/components/lessons/LessonWordsList";

export default {
  components: {
    ContentContainer,
    BackBtn,
    LessonWordsList,
  },
  computed: {
    ...mapGetters('Auth', ['userRole']),
    ...mapGetters('Words', ['allWords']),
    ...mapGetters('Lessons', ['lesson'])
  },
  methods: {
    ...mapActions('Lessons', ['fetchLesson']),
  },
  mounted() {
    this.fetchLesson({
      role: this.userRole,
      id: this.$route.params.id,
    });
  }
}
</script>

<style lang="scss">
@import "@/styles/vars";
@import "@/styles/mixins";

.view-lesson{
  &__title-line{
    display: flex;
    margin-bottom: 58px;
  }
  &__back-button{
    margin-right: 60px;
  }
  &__lesson-words-list{
    margin-bottom: 40px;
  }
  &__download{
    display: flex;
    justify-content: center;
  }
  &__download-text{
    font-size: 24px;
    font-weight: 500;
  }
  &__download-icon{
    fill: none;
    stroke: $clr-grey2;
    width: 25px;
    height: 27px;
    margin-right: 15px;
  }
}
@include media(">phone", "<=tablet") {
  .u-text-h1{
    font-size: 26px;
    line-height: 30px;
  }
  .view-lesson__title-line{
    padding-top: 40px;
    margin-bottom: 30px;
  }
}
</style>
