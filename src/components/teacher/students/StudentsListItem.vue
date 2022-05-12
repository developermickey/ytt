<template>
  <div class="teacher-students-list-item">
    <div class="teacher-students-list-item__avatar" :style="avatarStyle"></div>
    <div class="teacher-students-list-item__name-col">
      <div class="teacher-students-list-item__name">
        {{ name || email }}
        <div
          class="teacher-students-list-item__answers-count"
          v-if="records_count"
        >
          {{ records_count }}
        </div>
      </div>
      <div class="teacher-students-list-item__city" v-if="city">{{city}}</div>
    </div>
    <div class="teacher-students-list-item__reward-col" @click="showGiveCoinsModal">
      <img src="@/assets/svg/reward.svg" alt="">
    </div>

    <div class="teacher-students-list-item__actions">
      <UIconBtn
          class="u-mx-1 qa-login-as-teacher-btn login-as-icon-btn teacher-students-list-item__impersonate"
          icon="icon-enter"
          icon-color="grey"
          icon-hover-color="blue"
          bg-hover-color="white"
          hoverable
          @click.native="onLoginAsUserClick(id)"
          title="Login as user"
      >
      </UIconBtn>
      <UBtn
        size="x-large"
        class="lessons-button student-list--button"
        color="blue"
        outlined
        @click="goToStudentLessons"
        v-if="lessons_count"
        :width="buttonWidth"
      >
        Student lessons
      </UBtn>
      <UBtn
        class="teacher-students-list-item__add-lesson-btn student-list--button"
        size="x-large"
        color="primary"
        :width="buttonWidth"
        @click="openSelectLessonsModal"
      >
        Add lesson
      </UBtn>
    </div>
  </div>
</template>

<script>
import { mapActions, mapMutations } from 'vuex';
import UIconBtn from "@/components/common/UIconBtn";


export default {
  props: {
    id: {
      type: Number,
      required: true,
    },
    avatar: {
      type: String,
      required: true,
    },
    name: {
      type: String,
    },
    email: {
      type: String,
    },
    city: {
      type: String,
    },
    records_count: {
      type: Number,
      default: 0,
    },
    lessons_count: {
      type: Number,
      default: 0,
    }
  },
  components: {
    UIconBtn
  },
  computed: {
    avatarStyle(){
      return { backgroundImage : `url(${this.avatar})` };
    },
    buttonWidth(){
      const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
      return vw > 768 ? 250 : 102
    }
  },
  methods: {
    ...mapMutations('Coins', ['SET_STUDENT']),
    ...mapActions('Auth', ['loginAsUser']),
    onLoginAsUserClick(id){
      this.loginAsUser(id).then(() => {
        this.$notify({
          title: 'Welcome!',
          type: 'success'
        });
      }).catch(({ message }) => {
        this.$notify({
          title: 'Login error',
          text: message,
          type: 'error'
        });
      })
    },
    goToStudentLessons(){

      this.$router.push({
        name: 'teacher-students-lesson-list',
        params: { id: this.id }
      });
    },
    openSelectLessonsModal(){
      this.$emit('open-select-lessons-modal');
    },
    showGiveCoinsModal(){
      this.SET_STUDENT({ id: this.id, name: this.name });
      this.$modal.show('give-coins');
    }
  }
}
</script>

<style lang="scss">
@import "@/styles/vars";
@import "@/styles/mixins";

.teacher-students-list-item{
  display: flex;
  align-items: center;
  &__avatar{
    width: 87px;
    height: 87px;
    border-radius: 50%;
    background-size: cover;
    background-position: center;

    margin-right: 30px;
  }
  &__name{
    font-size: 24px;
    font-weight: 300;

    display: flex;
    align-items: center;
  }
  &__reward-col{
    margin-left: 75px;
    cursor: pointer;
  }
  &__answers-count{
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    font-size: 14px;
    color: #fff;
    font-weight: 500;
    background-color: $clr-blue;
    margin-left: 10px;
  }
  &__city{
    color: #000;
    opacity: .4;
  }

  &__actions{
    display: flex;
    margin-left: auto;
    align-items: center;
  }
  &__impersonate{
    margin-right: 20px !important;
  }
  &__add-lesson-btn{
    margin-left: 14px;
  }
  &__answers-count{
    width: 16px;
    height: 16px;
    font-size: 12px;
  }
}

@include media(">phone", "<=tablet") {
  .teacher-students-list{
    .teacher-students-list-item{
      padding-top: 10px;
      &__avatar{
        width: 41px;
        height: 41px;
        margin-right: 14px;
      }
      &__reward-col{
        margin-left: 14px;
        img {
          width: 25px;
          height: 25px;
        }
      }
      &__name{
        font-size: 12px
      }
      &__city{
        font-size: 11px;
      }
    }

  }

  .teacher-students-list-item__add-lesson-btn.student-list--button, .lessons-button.student-list--button{
    grid-area: studlessons;
    font-size: 10px;
    height: 25px;
    padding-left: 4px;
    padding-right: 4px;
    margin-left: 0;
  }
  .lessons-button.student-list--button{
    grid-area: addlessons;
  }
  .student-list--button span.u-btn__content{
    font-size: 12px;
  }
  .teacher-students-list-item__impersonate{
    margin-right: 0!important;
    grid-area: loginas;
  }
  .teacher-students-list-item__actions{
    display: grid;
    justify-items: flex-end;
    grid-template-columns: 1fr 3fr;
    grid-template-rows: 1fr 1fr;
    grid-template-areas:
        "loginas studlessons"
        "loginas addlessons";
    grid-gap: 5px;
  }
}
</style>
