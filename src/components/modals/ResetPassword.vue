<template>
  <modal name="reset-password" :width="deviceWidth" height="auto" classes="u-modal reset-password" scrollable>
    <u-card class="u-modal-card u-px-24 u-pt-24 u-pb-15">
      <div class="reset-password__cross" @click="hideModal">
        <svg
            v-svg
            symbol="icon-cross"
            size="0 0 72 72"
        />
      </div>
      <slot name="title">
        <div class="u-text-h2 u-text-center">
          Forgot Password?
        </div>
      </slot>
      <div class="reset-password__subtitle">
        Please enter your e-mail or username to search for your account.
      </div>
      <ValidationObserver v-slot="{ handleSubmit }">
        <form class="reset-password__form" @submit.prevent="() => handleSubmit(() => resetPassword(login))">
          <ValidationProvider rules="required" name="Email or username" v-slot="{ errors }">
            <UTextField
                padding
                label="Email or username"
                v-model="login"
                placeholder="Email or username"
                :error="errors[0]"
                inset
            ></UTextField>
          </ValidationProvider>
          <div class="reset-password__submit">
            <UBtn
                color="primary"
                size="x-large"
                @click="save"
                width="262"
            >
              Submit
            </UBtn>
          </div>
        </form>
      </ValidationObserver>


    </u-card>
  </modal>
</template>

<script>
import { mapActions } from 'vuex';
import UCard from '@/components/common/UCard.vue';
import UTextField from '@/components/common/UTextField.vue';


export default {
  data: () => ({
    login: ''
  }),
  components: {
    UCard,
    UTextField
  },
  methods: {
    ...mapActions('Auth', ['forgotPassword']),
    hideModal(){
      this.$modal.hide('reset-password');
    },
    resetPassword(login){
      this.forgotPassword(login)
        .then(() => {
          this.$notify({
            title: 'Email sent',
            text: 'Check you email please',
            type: 'success'
          });
          this.$modal.show('email-delivered');
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
@import "@/styles/mixins";
.reset-password{
  &__subtitle{
    font-family: Poppins, sans-serif;
    font-weight: 300;
    font-size: 14px;
    line-height: 20px;
    text-align: center;
    color: #B3B3B3;
    margin-top: 4px;
  }

  &__form{
    max-width: 664px;
    margin: 23px auto 0;
  }
  &__submit{
    margin-top: 44px;
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
@include media(">phone", "<=tablet") {
  .reset-password{
    &--form{
      max-width: 100vw;
    }

    .u-modal-card{
      padding: 45px 35px !important;
    }
    &__cross{
      top: 5px;
      right: 10px;
    }
  }
}
</style>
