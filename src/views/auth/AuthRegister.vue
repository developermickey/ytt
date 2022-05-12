<template>
  <ValidationObserver v-slot="{ handleSubmit }">
    <u-card class="register">
      <SocialsAuth/>

      <div class="register__form">
        <ValidationProvider rules="email|required" name="Email" v-slot="{ errors }">
          <UTextField
            label="Email"
            v-model="form.email"
            placeholder="myemail@example.com"
            :error="errors[0]"
            class="register__form-input"
            inset
          />
        </ValidationProvider>
        <ValidationProvider rules="min:6|max:20|required" name="New Password" v-slot="{ errors }">
          <UTextField
            label="New Password"
            v-model="form.password"
            type="password"
            placeholder="******"
            :error="errors[0]"
            class="register__form-input"
          />
        </ValidationProvider>
        <ValidationProvider rules="confirmed:Password" name="Repeat Password" v-slot="{ errors }">
          <UTextField
            label="Repeat Password"
            v-model="form.confirmPassword"
            type="password"
            :error="errors[0]"
            class="register__form-input"
            placeholder="******"
          />
        </ValidationProvider>

        <ValidationProvider rules="isTrue" name="Terms" v-slot="{ errors }">
          <UCheckbox class="register__form-terms" v-model="terms" :error="Boolean(errors.length)">
            I have read and I agree to the <a href="#">Terms and conditions</a> *
          </UCheckbox>
        </ValidationProvider>
      </div>

      <div class="u-flex is-justify-center">
        <UBtn
          size="large"
          color="primary"
          @click="() => handleSubmit(() => signUp(form))"
        >
          Register
        </UBtn>
      </div>
    </u-card>
  </ValidationObserver>
</template>

<script>
import UCard from '@/components/common/UCard.vue';
import UTextField from '@/components/common/UTextField.vue';
import UCheckbox from '@/components/common/UCheckbox.vue';
import SocialsAuth from '@/components/partials/SocialsAuth';
import { mapActions } from 'vuex';

export default {
  data: () => ({
    form: {
      email: '',
      password: '',
      confirmPassword: '',
    },
    terms: false,
  }),
  components: {
    UCard,
    UTextField,
    SocialsAuth,
    UCheckbox
  },
  methods: {
    ...mapActions('Auth', ['register']),
    signUp(form){
      this.register({ ...form, password_confirmation: form.confirmPassword })
        .then(() => {
          this.$notify({
            title: 'Welcome!',
            type: 'success'
          });
        })
        .catch(({ message }) => {
          this.$notify({
            title: 'Register error',
            text: message,
            type: 'error'
          });
        })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/vars';
@import "@/styles/mixins";
.register{
  width: $popup-width-xl;
  padding: 45px 75px 25px;

  &__form{
    &-input{
      margin-top: 20px;
    }
    &-terms{
      margin-top: 25px;
    }
  }

  &__btn{
    min-width: 262px;
    margin-top: 25px;
  }

}
@include media(">phone", "<=tablet") {
  .register {
    width: 100vw;
    padding: 0 20px 20px;
    margin-top: 40px;
  }
}

</style>
