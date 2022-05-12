<template>
  <ValidationObserver v-slot="{ handleSubmit }">
    <u-card class="login">

      <div class="socials">
        <GoogleLogin
            :renderParams="{ height: 50, width: 180 }"
            :params="googleAuthParams"
            :onSuccess="googleSignIn"
            :onFailure="googleFailed"
            :onCurrentUser="googleCurrentUser"
        ></GoogleLogin>
      </div>
      <form  @submit.prevent="() => handleSubmit(() => signIn(form))">
        <div class="login__form">
          <ValidationProvider rules="required" name="Email or username" v-slot="{ errors }">
            <UTextField
              padding
              label="Email or username"
              v-model="form.login"
              placeholder="myemail@example.com"
              class="login__form-input"
              :error="errors[0]"
              inset
            ></UTextField>
          </ValidationProvider>
          <ValidationProvider rules="required" name="Password" v-slot="{ errors }">
            <UTextField
              padding
              label="Password"
              v-model="form.password"
              placeholder="******"
              type="password"
              :error="errors[0]"
              class="login__form-input"
            ></UTextField>
          </ValidationProvider>
          <UCheckbox class="login__form-remember" v-model="form.remember">
            Automatic  login
          </UCheckbox>
        </div>

        <div class="u-flex is-justify-center">
          <UBtn
            class="login__btn"
            size="x-large"
            color="primary"
            :loading="loading"
          >
            Log in
          </UBtn>
        </div>

      <div class="login__forgot">
        Forgot your password? <span @click="openResetPasswordModal">click here</span>
      </div>
      </form>
    </u-card>
    <ResetPassword></ResetPassword>
    <EmailDelivered></EmailDelivered>

  </ValidationObserver>
</template>

<script>
import UCard from '@/components/common/UCard.vue';
import UTextField from '@/components/common/UTextField.vue';
import UCheckbox from '@/components/common/UCheckbox.vue';
import ResetPassword from '@/components/modals/ResetPassword';
import EmailDelivered from '@/components/modals/EmailDelivered';
import ReplySent from '@/components/modals/ReplySent';
import GoogleLogin from 'vue-google-login';
import { mapActions, mapGetters } from 'vuex'

export default {

  data: () => ({
    form:{
      login: '',
      password: '',
      remember: false
    },
    googleAuthParams: {
      client_id: process.env.VUE_APP_GOOGLE_CLIENT_ID
    },
    googleUser: null
  }),
  mounted(){
  },
  components: {
    UCard,
    UTextField,
    UCheckbox,
    ResetPassword,
    EmailDelivered,
    // eslint-disable-next-line vue/no-unused-components
    ReplySent,
    GoogleLogin
  },
  computed: {
    ...mapGetters('Auth', ['loading'])
  },
  methods: {
    ...mapActions('Auth', ['login', 'googleLogin']),
    signIn(credentials){
      this.login(credentials)
      .then(() => {
        this.$notify({
          title: 'Welcome!',
          type: 'success'
        });
      })
      .catch(({ message }) => {
        this.$notify({
          title: 'Login error',
          text: message,
          type: 'error'
        });
      })
    },
    googleSuccess(googleUser){
      this.googleLogin(googleUser)
       .then(() => {
          this.$notify({
            title: 'Welcome!',
            type: 'success'
          });
        })
        .catch(({ message }) => {
          this.$notify({
            title: 'Login error',
            text: message,
            type: 'error'
          });
        })
    },
    googleSignIn(data){
      if(this.googleUser)
        return this.googleSuccess(this.googleUser);

      if(data)
        this.googleSuccess(data);
    },
    googleCurrentUser(data){
      this.googleUser = data;
    },
    googleFailed(err){
      console.error(err);
    },
    openResetPasswordModal(){
      this.$modal.show('reset-password');
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/vars';
@import '@/styles/mixins';
.socials{
  display: flex;
  justify-content: center;
}
.title{
  font-weight: 300;
  opacity: 0.2;
  color: #fff;
  text-decoration: none;

  width: 258px;
  text-align: center;
}

.login{
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
  .login {
    width: 100vw  ;
    border-radius: unset;
    padding: 31px 15px 32px 19px;
    margin-top: 30px;
    &__form{
      &-input{
        margin-top: 11px;
      }
      &-remember{
        margin-top: 14px;
      }
    }
    &__btn{
      min-width: 224px;
      margin-top: 30px;
    }
  }
}
</style>
