import UTextField from "@/components/common/UTextField";
import FileUpload from "@/components/common/FileUpload/FileUpload";

import { mapActions, mapGetters } from "vuex";

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
    loaded: false,
    paidFor: false,
    product: {
      price: 777.77,
      description: "leg lamp from that one movie",
      img: "./assets/lamp.jpg",
    },
  }),
  components: {
    UTextField,
    FileUpload,
  },
  mounted() {
    const script = document.createElement("script");
    script.src = `https://www.paypal.com/sdk/js?client-id=${process.env.VUE_APP_PAYPAL_CLIENT_ID}`;
    script.addEventListener("load", this.setLoaded);
    document.body.appendChild(script);
  },
  computed: {
    ...mapGetters("Users", ["loading"]),
  },
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
    submit() {
      this.$modal.show("confirm-modal");
    },
    async confirmModal() {
      this.$modal.hide("confirm-modal");
      let data = this.collectPostData();
      this.create(data)
        .then(() => {
          this.$router.push({ name: "school-users-all" });
          this.$notify({
            title: "User successfully created!",
            type: "success",
          });
        })
        .catch(({ message }) => {
          this.$notify({
            title: "User creation error",
            text: message,
            type: "error",
          });
        });
    },
    async cancleModal() {
      this.$modal.hide("confirm-modal");
    },
    async setLoaded() {
      this.loaded = true;
      window.paypal
        .Buttons({
          createOrder: (data, actions) => {
            return actions.order.create({
              purchase_units: [
                {
                  description: this.product.description,
                  amount: {
                    currency_code: "USD",
                    value: this.product.price,
                  },
                },
              ],
            });
          },
          onApprove: async (data, actions) => {
            const order = await actions.order.capture();
            this.data;
            this.paidFor = true;
            console.log(order);
          },
          onError: (err) => {
            console.log(err);
          },
        })
        .render(this.$refs.paypal);
    },
  },
};
