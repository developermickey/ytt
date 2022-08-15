<template>
  <div class="container mt-5">
    <Loader class="loader" :show="loading" :fixedPosition="false" />
    <div v-if="!loading">
      <h1 class="mb-4">Custom Payment</h1>
      <div class="u-card elevation-3 p-4">
        <ValidationObserver tag="div" class="" v-slot="{ handleSubmit }">
          <div class="">
            <ValidationProvider
              rules="required"
              name="Pay Amount"
              v-slot="{ errors }"
            >
              <u-text-field
                label="Pay Amount"
                placeholder="Pay amount for school"
                v-model="pay"
                :error="errors[0]"
                class="w-50"
                type="number"
              >
              </u-text-field>
            </ValidationProvider>
          </div>
          <u-btn class="mt-4" @click="handleSubmit(submit)" :width="200"
            >Save</u-btn
          >
        </ValidationObserver>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import Loader from "@/components/Loader";
import UBtn from "@/components/common/UBtn.vue";
import user from "@/api/users.api.js";
import axios from "axios";
import UTextField from "@/components/common/UTextField";
export default {
  async mounted() {
    let self = this;
    await axios.get("/admin/paymentConfiguration").then((res) => {
      self.pay = res.data.payamount;
      self.loading = false;
    });
  },
  components: {
    Loader,
    UBtn,
    UTextField,
  },
  data() {
    return {
      loading: true,
      canPay: true,
      pay: "",
    };
  },
  methods: {
    ...mapActions("Users", {
      fetchUser: "fetchUser",
    }),
    async setLoaded() {
      let self = this;
      window.paypal
        .Buttons({
          createOrder: (data, actions) => {
            return actions.order.create({
              purchase_units: [
                {
                  description: `Pay for ${this.user.name}`,
                  amount: {
                    currency_code: "USD",
                    value: 99.0,
                  },
                },
              ],
            });
          },
          onApprove: async (data, actions) => {
            const order = await actions.order.capture();
            const payload = {
              payBy: "school",
              studentId: this.$route.params.studentId,
              payload: { ...order, studentId: this.$route.params.studentId },
            };
            await user.payStudent(payload).then(() => {
              self.$notify({
                title: "Payment Successful",
                type: "success",
              });
              setTimeout(() => {
                self.$router.push({ name: "school-users-all" });
              }, "1000");
            });
          },
          onError: (err) => {
            console.log(err);
          },
        })
        .render(this.$refs.paypal);
    },
    async submit() {
      this.loading = true;
      const payload = {
        payment: this.pay,
      };
      await axios.put("/admin/paymentConfiguration", payload);
      this.loading = false;
    },
  },
  computed: {
    ...mapGetters("Users", {
      user: "user",
    }),
  },
};
</script>

<style scoped>
.loader {
  position: inherit !important;
}
</style>
