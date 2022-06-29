<template>
  <div class="container mt-5">
    <Loader class="loader" :show="loading" :fixedPosition="false" />
    <div v-if="!loading">
      <h1 class="mb-4">Payment</h1>
      <div v-if="canPay" class="u-card elevation-3 p-4">
        <h1>Pay $99.0 for {{ user.name }}</h1>
      </div>
      <div v-else class="u-card elevation-3 p-4">
        <h1>For {{ user.name }} , payment is already Done</h1>
        <h2>You can pay after {{ user.license_expire_at }}</h2>
        <div class="text-center mt-4">
          <u-btn :to="{ name: 'school-users-all' }" :width="200"
            >Back to List</u-btn
          >
        </div>
      </div>
    </div>
    <div v-if="canPay" class="u-card elevation-3 mt-4  py-5">
      <div class="mx-auto" style="max-width:400px" ref="paypal"></div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import Loader from "@/components/Loader";
import UBtn from "@/components/common/UBtn.vue";
import user from "@/api/users.api.js";
import moment from "moment";
export default {
  async mounted() {
    if (this.$route.params.studentId) {
      const script = document.createElement("script");
      script.src = `https://www.paypal.com/sdk/js?client-id=${process.env.VUE_APP_PAYPAL_CLIENT_ID}`;
      script.addEventListener("load", this.setLoaded);
      document.body.appendChild(script);
      this.fetchUser({
        id: this.$route.params.studentId,
        type: "school",
      }).then(() => {
        const currentDate = moment();
        let canPay = "";

        const exDate = moment(
          this.user.license_expire_at,
          "YYYY-MM-DD HH:mm:ss"
        ).format("YYYY-MM-DD");
        canPay = currentDate.isSameOrAfter(exDate, "days");
        if (this.user.license_expire_at === null || canPay) {
          this.canPay = true;
          this.loading = false;
        } else {
          this.loading = false;
          this.canPay = false;
        }
      });
    }
  },
  components: {
    Loader,
    UBtn,
  },
  data() {
    return {
      loading: true,
      canPay: true,
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
