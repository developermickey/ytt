<template>
  <modal name="reply-sent" :width="deviceWidth" height="auto" classes="u-modal reply-sent" scrollable>
    <u-card class="u-modal-card u-px-24 u-pt-24 u-pb-15">
      <div class="reply-sent__cross" @click="hideModal">
        <svg
            v-svg
            symbol="icon-cross"
            size="0 0 72 72"
        />
      </div>
      <div class="reply-sent__container">
        <div class="reply-sent__title">
          Your reply has been sent!
        </div>
        <div class="reply-sent__subtitle">
          Thanks for the answer, moves on to the next task!
        </div>
        <img class="reply-sent__image" src="@/assets/reply-sent.png" alt="">
        <UBtn
            color="primary"
            size="x-large"
            @click="hideModal"
            width="262"
            class="reply-sent__ok"
        >
          Ok
        </UBtn>
      </div>

    </u-card>
  </modal>
</template>

<script>
import { mapActions } from 'vuex';
import UCard from '@/components/common/UCard.vue';


export default {
  data: () => ({
    login: ''
  }),
  components: {
    UCard
  },
  methods: {
    ...mapActions('Auth', ['forgotPassword']),
    hideModal(){
      this.$modal.hide('reply-sent');
    },
    resetPassword(login){
      this.forgotPassword(login)
        .then(() => {
          this.$notify({
            title: 'Email sent',
            text: 'Check you email please',
            type: 'success'
          });
        })
        .catch(({ message }) => {
          this.$notify({
            title: 'Reset password error',
            text: message,
            type: 'error'
          });
        })
    },
    save(){
      this.$emit('save');
      this.hideModal();
    }
  },
  computed:{
    deviceWidth(){
      const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
      return vw > 1250 ? '1250px' : '100%'
    }
  }
}
</script>

<style lang="scss" scoped>
.reply-sent{
  font-family: Poppins, sans-serif;

  &__container{
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  &__title{
    font-weight: 300;
    font-size: 64px;
    line-height: 96px;
    text-align: center;
    color: black;
  }
  &__subtitle{
    margin-top: 5px;
    font-weight: 300;
    font-size: 14px;
    line-height: 20px;
    text-align: center;
    color: #B3B3B3;
  }
  &__image{
    width: 472px;
    margin-top: 5px;
  }
  &__ok{
    margin-top: 45px;
    display: flex;
    justify-content: center;
  }

  &__cross{
    position: absolute;
    top: 38px;
    right: 58px;
    cursor: pointer;
  }

}
</style>
