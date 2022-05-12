<template>
  <ValidationObserver v-slot="{ handleSubmit }">
    <form @submit.prevent="() => handleSubmit(invite)" class="u-flex is-flex-column u-flex-grow u-pb-25 screen-container">
      <div class="u-container u-mr-auto u-ml-auto">
        <div>
          <div class="head">
            <div class="u-text-h2 u-mt-10 title">Add via e-mail invite</div>
            <UBtn class="usual-btn" type="button" :to="{ name: 'admin-student-create' }" color="blue">Usual adding</UBtn>
          </div>
          <div class="sub-title">
            Please enter the e-mail to send future user invite
          </div>
        </div>
        <div class="field">
          <ValidationProvider rules="required|email" name="E-mail" v-slot="{ errors }">
            <UTextField
              label="E-mail"
              placeholder="Write the e-mail of the future user"
              v-model="email"
              :error="errors[0]"
            >
            </UTextField>
          </ValidationProvider>
        </div>
        <div class="submit">
          <UBtn
              size="x-large"
              color="primary"
              id="create_teacher_submit"
              width="320"
              :loading="loading"
          >
            Send
          </UBtn>
        </div>
      </div>


    </form>
  </ValidationObserver>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import UTextField from '@/components/common/UTextField.vue';
import { STUDENT } from '@/constants/roles';

export default {
  data: () => ({
    email: ''
  }),
  components: {
    UTextField
  },
  computed: {
    ...mapGetters('Auth', ['loading'])
  },
  methods: {
    ...mapActions('Auth', ['inviteUser']),
    invite(){
      this.inviteUser({ email: this.email, role: STUDENT })
        .then(res => {
          this.$notify({
            title: 'Invite success',
            text: res.data.message,
            type: 'success'
          });
          this.email = ''
        })
        .catch(({ message }) => {
          this.$notify({
            title: 'Invite error',
            text: message,
            type: 'error'
          });
        });
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/mixins";
.screen-container{
  min-height: 100%;
}
label{
  font-size: 24px;
  color: #000;
  font-weight: 300;
  line-height: 46px;
  display: inline-block;
}

.add-photo{
  margin-top: 11px;
}

.head{
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 64px;
  .title{
    margin-bottom: 19px;
  }
}
.sub-title{
  font-family: Poppins, sans-serif;
  font-weight: 300;
  font-size: 24px;
  line-height: 20px;
  color: #B3B3B3;
}

.field{
  margin-top: 80px;
  max-width: 50%;
}
.submit{
  margin-top: 47px;
}
@include media(">phone", "<=tablet") {
  .head{
    padding-top: 40px;
    .title{
      font-size: 24px;
    }
    .usual-btn{
      padding: 0 30px;
    }
  }
  .sub-title{
    margin-top: 40px;
    font-size: 20px;
  }
  .field{
    margin-top: 20px;
    max-width: unset;
  }
  .submit{
    display: flex;
    justify-content: center;
  }
}
</style>
