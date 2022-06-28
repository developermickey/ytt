import UTextField from "@/components/common/UTextField";
import FileUpload from "@/components/common/FileUpload/FileUpload";

import { mapActions } from "vuex";

export default {
  data: () => ({
    name: "",
    phone: "",
    email: "",
    username: "",
    city: "",
    password: "",
    repeatPassword: "",
    avatar: null,
    role: 4,
    school_id: null,
    teacher_id: null,
    loading: false,
    studentId: null,
  }),
  components: {
    UTextField,
    FileUpload,
  },
  mounted() {},

  methods: {
    ...mapActions("Users", {
      create: "create",
    }),
    collectPostData() {
      let formData = {
        name: this.name,
        phone: this.phone,
        email: this.email,
        username: this.username,
        city: this.city,
        password: this.password,
        password_confirmation: this.repeatPassword,
        role: this.role,

        // school_id: this.school_id === null ? null : this.school_id.id,
      };

      if (this.avatar) {
        formData.avatar = this.avatar;
      }

      return formData;
    },
    async submit() {
      this.loading = true;
      let data = this.collectPostData();
      let self = this;
      await this.create(data)
        .then((res) => {
          console.log(res);
          this.loading = false;
          this.studentId = res.data.id;
          // this.$notify({
          //   title: "User successfully created!",
          //   type: "success",
          // });
          self.$modal.show("confirm-modal");
        })
        .catch(({ message }) => {
          this.loading = false;
          this.$notify({
            title: "User creation error ( unique Email)",
            text: message,
            type: "error",
          });
        });
    },
    async confirmModal() {
      this.$modal.hide("confirm-modal");
      this.$router.push("/school/payment/" + this.studentId);
    },
    async cancleModal() {
      this.$modal.hide("confirm-modal");
    },
  },
};
