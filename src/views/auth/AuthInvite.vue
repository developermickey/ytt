<template>
  <ValidationObserver v-slot="{ handleSubmit }">
    <u-card class="invite">
      <form  @submit.prevent="() => handleSubmit(createAccount)">
        <div class="invite__form">
          <ValidationProvider rules="required" name="Full Name" v-slot="{ errors }">
            <UTextField
              padding
              label="Full Name"
              v-model="form.name"
              placeholder="Full Name"
              :error="errors[0]"
              class="invite__form-input"
            ></UTextField>
          </ValidationProvider>
          <ValidationProvider rules="required" name="Username" v-slot="{ errors }">
            <UTextField
              padding
              label="Username"
              v-model="form.username"
              placeholder="Username"
              :error="errors[0]"
              class="invite__form-input"
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
              class="invite__form-input"
            ></UTextField>
          </ValidationProvider>
          <ValidationProvider rules="confirmed:Password" name="Repeat Password" v-slot="{ errors }">
            <UTextField
                padding
                label="Repeat Password"
                v-model="form.password_confirmation"
                placeholder="******"
                type="password"
                :error="errors[0]"
                class="invite__form-input"
            ></UTextField>
          </ValidationProvider>
          <ValidationProvider rules="isTrue" name="Terms" v-slot="{ errors }">
            <UCheckbox :error="Boolean(errors.length)" class="invite__form-terms" v-model="form.terms">
              By clicking this checkbox, you agree to our <a :href="getTermsUrl(0)">Terms & Conditions</a> <span v-if="isTeacher">&nbsp; and &nbsp;<a :href="getTermsUrl(1)">Complete agreement.</a></span>
            </UCheckbox>
          </ValidationProvider>

        </div>

        <div class="u-flex is-justify-center">
          <UBtn
            class="invite__btn"
            size="x-large"
            color="primary"
            :loading="loading"
          >
            Create
          </UBtn>
        </div>
      </form>
    </u-card>

  </ValidationObserver>
</template>

<script>
import UCard from '@/components/common/UCard.vue';
import UTextField from '@/components/common/UTextField.vue';
import UCheckbox from '@/components/common/UCheckbox.vue';
import { mapActions, mapGetters } from 'vuex';
import { STUDENT, TEACHER } from '@/constants/roles';

export default {

  data: () => ({
    role_id: null,
    isTeacher: false,
    form:{
      name: '',
      username: '',
      password: '',
      password_confirmation: '',
      terms: false
    },
    roleMap: {
      redirect: {
        [STUDENT]: 'student-lessons-all',
        [TEACHER]: 'teacher-settings'
      },
      terms: {
        [STUDENT]: [
            'https://yourtorahtutors.com/non-disclosure-agreement/'
        ],
        [TEACHER]: [
            'https://yourtorahtutors.com/non-disclosure-agreement/',
            'https://yourtorahtutors.com/non-compete-agreement/'
        ],
      }
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
    UCheckbox
  },
  computed: {
    ...mapGetters('Auth', ['loading'])
  },
  methods: {
    ...mapActions('Auth', ['inviteTokenValid', 'createAccountInvite']),

    getTermsUrl(index){
      return this.role_id && this.roleMap.terms[this.role_id][index];
    },
    checkToken(route){
      this.inviteTokenValid(route.params.token)
        .then(({ isValid, role }) => {
          if(!isValid) {
            this.$notify({
              title: 'Token is not valid',
              text: `Token has expired or doesn't exist`,
              type: 'warn'
            });
            this.$router.push({ name: 'auth-login' });
          } else {
            this.role_id = role;
            this.isTeacher = role === TEACHER;
          }
        })
        .catch(({ message }) => {
          this.$notify({
            title: 'Create account error',
            text: message,
            type: 'error'
          });
        });
    },
    createAccount(){
      console.log(this.$route);
      this.createAccountInvite({
        token: this.$route.params.token,
        role_id: this.role_id,
        ...this.form
      })
      .then(() => {
        this.$notify({
          title: 'Success',
          text: `Account successfully created.`,
          type: 'success'
        });
        this.$router.push({ name: this.roleMap.redirect[this.role_id] });
      })
      .catch(({ message }) => {
        this.$notify({
          title: 'Account create error',
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
.invite{
  width: $popup-width-xl;
  padding: 45px 75px 25px;
  margin-top: 40px;

  &__form{
    &-input{
      margin-top: 60px;
    }
    &-terms{
      margin-top: 50px;

      a{
        text-decoration: underline;
      }
    }

  }

  &__btn{
    min-width: 262px;
    margin-top: 60px;
  }

}
@include media(">phone", "<=tablet") {
  .invite {
    width: 100vw;
    padding: 0 20px 20px;
  }
}
</style>
