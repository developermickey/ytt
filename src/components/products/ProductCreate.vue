<template>
  <div class="user-settings">

    <ValidationObserver
      tag="div"
      class="user-settings__form"
      v-slot="{ handleSubmit }"
    >
      <div class="user-settings__form-col">
        <ValidationProvider rules="required" name="Name" v-slot="{ errors }">
          <u-text-field
            label="Name"
            placeholder="Name"
            v-model="name"
            :error="errors[0]"
          >
          </u-text-field>
        </ValidationProvider>
      </div>
      <div class="user-settings__form-col">
        <u-text-field
          label="Amount"
          placeholder="0"
          v-model="amount"
        >
        </u-text-field>
      </div>
      <div class="user-settings__form-col">
        <label class="user-settings__avatar-label">Image</label>
        <file-upload
          v-model="image"
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
import {mapGetters, mapActions} from "vuex";

export default {
  data: () => ({
    name: '',
    amount: '',
    image: null,
  }),
  components: {
    UTextField,
    FileUpload,
  },
  computed: {
    ...mapGetters('Products', ['loading']),
    submitId(){
      return this.$route.name + '_submit';
    }
  },
  methods: {
    ...mapActions('Products', ['createProduct']),

    collectPostData(){
      let formData = {
        name: this.name,
        amount: this.amount
      };

      if(this.image)
        formData.image = this.image;

      return formData;
    },
    submit(){
      let data = this.collectPostData();

      this.createProduct(data)
        .then(() => {
          this.$notify({
            title: 'Product successfully created!',
            type: 'success'
          });
          this.$router.push({ name: 'product-list' })
        })
        .catch(({ message }) => {
          this.$notify({
            title: 'Product create error',
            text: message,
            type: 'error'
          });
        });
    },

  },
}
</script>

<style lang="scss">

</style>