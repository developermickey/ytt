<template>
  <ValidationObserver v-slot="{ handleSubmit }">
    <u-card class="reset-password">
      <form  @submit.prevent="() => handleSubmit(changePassword)">
        <div class="reset-password__form">
          <ValidationProvider rules="required" name="Password" v-slot="{ errors }">
            <UTextField
              padding
              label="Password"
              v-model="form.password"
              placeholder="******"
              type="password"
              :error="errors[0]"
              class="reset-password__form-input"
            ></UTextField>
          </ValidationProvider>
          <ValidationProvider rules="confirmed:Password" name="Repeat Password" v-slot="{ errors }">
            <UTextField
                padding
                label="Repeat Password"
                v-model="form.confirmPassword"
                placeholder="******"
                type="password"
                :error="errors[0]"
                class="reset-password__form-input"
            ></UTextField>
          </ValidationProvider>
        </div>

        <div class="u-flex is-justify-center">
          <UBtn
            class="reset-password__btn"
            size="x-large"
            color="primary"
            :loading="loading"
          >
            Reset
          </UBtn>
        </div>
      </form>
    </u-card>
    <ResetPassword></ResetPassword>

  </ValidationObserver>
</template>

<script>
import UCard from '@/components/common/UCard.vue';
import UTextField from '@/components/common/UTextField.vue';
import ResetPassword from '@/components/modals/ResetPassword';
import { mapActions, mapGetters } from 'vuex'

export default {

  data: () => ({
    form:{
      password: '',
      confirmPassword: '',
      remember: false
    }
  }),
  beforeRouteUpdate(route){
    this.checkToken(route);
  },
  mounted() {
    this.checkToken(this.$route);
  },
  components: {
    UCard,
    UTextField,
    ResetPassword
  },
  computed: {
    ...mapGetters('Auth', ['loading'])
  },
  methods: {
    ...mapActions('Auth', ['resetTokenValid', 'resetPassword']),

    checkToken(route){
      this.resetTokenValid(route.params.token)
        .then(valid => {
          if(!valid) {
            this.$notify({
              title: 'Token is not valid',
              text: `Token has expired or doesn't exist`,
              type: 'warn'
            });
            this.$router.push({ name: 'auth-login' });
          }
        })
          .catch(({ message }) => {
            this.$notify({
              title: 'Reset password error',
              text: message,
              type: 'error'
            });
          });
    },
    changePassword(){
      this.resetPassword({
        token: this.$route.params.token,
        password: this.form.password,
        password_confirmation: this.form.confirmPassword
      })
      .then(() => {
        this.$notify({
          title: 'Success',
          text: `Your password successfully changed.`,
          type: 'success'
        });
        this.$router.push({ name: 'auth-login' });
      })
      .catch(({ message }) => {
        this.$notify({
          title: 'Reset password error',
          text: message,
          type: 'error'
        });
      });
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/vars';
@import "@/styles/mixins";
.reset-password{
  width: $popup-width-xl;
  padding: 45px 75px 25px;

  &__form{
    //margin-top: 66px;
    &-input{
      margin-top: 20px;
    }
    &-remember{
      margin-top: 30px;
    }
  }

  &__btn{
    min-width: 262px;
    margin-top: 23px;
  }
  &__forgot{
    text-align: center;
    font-family: Poppins, sans-serif;
    font-style: normal;
    font-weight: 300;
    font-size: 14px;
    line-height: 20px;
    color: #2E2E2E;
    margin-top: 15px;
    span{
      color: #3C54AC;
      cursor: pointer;
    }
  }

}
@include media(">phone", "<=tablet") {
  .reset-password {
    width: 100vw;
    padding: 0 20px 20px;
    margin-top: 20px;
  }
}
</style>
