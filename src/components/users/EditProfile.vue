<template>
  <div class="user-settings">

    <ValidationObserver
      tag="div"
      class="user-settings__form"
      v-slot="{ handleSubmit }"
    >
      <div class="user-settings__form-col">
        <ValidationProvider rules="required" name="Full name" v-slot="{ errors }">
          <u-text-field
            label="Full name"
            placeholder="Full name"
            v-model="name"
            :error="errors[0]"
          >
          </u-text-field>
        </ValidationProvider>
      </div>
      <div class="user-settings__form-col">
        <u-text-field
          label="Phone"
          placeholder="Phone"
          v-model="phone"
        >
        </u-text-field>
      </div>
      <div class="user-settings__form-col">
        <ValidationProvider rules="required|email" name="E-mail" v-slot="{ errors }">
          <u-text-field
            label="E-mail"
            placeholder="E-mail"
            v-model="email"
            :error="errors[0]"
          >
          </u-text-field>
        </ValidationProvider>
      </div>
      <div class="user-settings__form-col">
        <ValidationProvider rules="required" name="Username" v-slot="{ errors }">
          <u-text-field
            label="Username"
            placeholder="Username"
            v-model="username"
            :error="errors[0]"
          >
          </u-text-field>
        </ValidationProvider>
      </div>
      <div class="user-settings__form-col user-settings__form-col_city">
        <u-text-field
          label="City"
          placeholder="City"
          v-model="city"
        ></u-text-field>
      </div>
      <div class="user-settings__form-col">
        <ValidationProvider
          :rules="{
            min:6,
            max:20,
            is: repeatPassword
          }"
          name="Password"
          v-slot="{ errors }"
        >
          <u-text-field
            label="Password"
            placeholder="Password"
            type="password"
            v-model="password"
            :error="errors[0]"
          >
          </u-text-field>
        </ValidationProvider>
      </div>
      <div class="user-settings__form-col">
        <ValidationProvider
          :rules="{
            min:6,
            max:20,
            is: password,
          }"
          name="Repeat password" v-slot="{ errors }"
        >
          <u-text-field
            label="Repeat password"
            placeholder="Repeat password"
            type="password"
            v-model="repeatPassword"
            :error="errors[0]"
          >
          </u-text-field>
        </ValidationProvider>
      </div>
      <div class="user-settings__form-col">
        <label class="user-settings__avatar-label">Avatar</label>
        <file-upload
          v-model="avatar"
          accept="image/*"
        >
          <template v-slot:default-label>
            <UBtn
              size="large"
              color="primary"
              tag="div"
              class="add-photo"
            >
              Add photo
            </UBtn>
          </template>
        </file-upload>
      </div>
      <div class="user-settings__form-col">
        <u-text-field
            label="Expires at"
            placeholder="Expires at"
            type="date"
            v-model="expiresAt"
        >
        </u-text-field>
      </div>

      <div class="user-settings__form-submit">
        <UBtn
          size="x-large"
          color="primary"
          @click="handleSubmit(submit)"
          :id="submitId"
          width="320"
          :loading="loading"
        >
          Save
        </UBtn>
      </div>


    </ValidationObserver>
  </div>
</template>

<script>
import UTextField from '@/components/common/UTextField';
import FileUpload from '@/components/common/FileUpload/FileUpload';
// eslint-disable-next-line no-unused-vars
import {mapGetters, mapMutations, mapActions} from "vuex";
import moment from 'moment';

export default {
  data: () => ({
    name: '',
    phone: '',
    email: '',
    username: '',
    city: '',
    password: '',
    repeatPassword: '',
    avatar: null,
    expiresAt: null,
  }),
  components: {
    UTextField,
    FileUpload,
  },
  computed: {
    ...mapGetters('Users', {
      loading : 'loading',
      user: 'user',
    }),
    submitId(){
      return this.$route.name + '_submit';
    }
  },
  methods: {
    ...mapActions('Users', {
      fetchUser : 'fetchUser',
      updateUser: 'updateUser',
    }),
    setInitialState(){
      this.name = this.user.name;
      this.phone = this.user.phone;
      this.email = this.user.email;
      this.username = this.user.username;
      this.city = this.user.city;
      this.avatar = this.user.avatar;
      this.expiresAt = this.user.expires_at && moment(this.user.expires_at).format('YYYY-MM-DD');
    },
    collectPostData(){
      let formData = {
        name: this.name,
        phone: this.phone,
        email: this.email,
        username: this.username,
        city: this.city,
        expires_at: this.expiresAt
      };

      if(this.password){
        formData.password = this.password;
        formData.password_confirmation = this.repeatPassword;
      }

      if(this.avatar && typeof this.avatar !== "string"){
        formData.avatar = this.avatar;
      }

      return formData;
    },
    submit(){
      let data = this.collectPostData();

      this.updateUser({
        user: data,
        id: this.$route.params.id,
      })
        .then(() => {
          this.$notify({
            title: 'User successfully updated!',
            type: 'success'
          });
        })
        .catch(({ message }) => {
          this.$notify({
            title: 'User update error',
            text: message,
            type: 'error'
          });
        });
    },

  },
  mounted() {
    this.fetchUser({
      id: this.$route.params.id,
    })
    .then(() => {
      this.setInitialState();
    });
  }
}
</script>

<style lang="scss">

</style>
