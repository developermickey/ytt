<template>
  <div class="container mt-5">
    <Loader class="loader" :show="loading" :fixedPosition="false" />
    <div v-if="!loading">
      <h1 class="mb-4">Payment</h1>
      <div v-if="canPay" class="u-card elevation-3 p-4 d-flex flex-wrap">
        <h1>Pay ${{ payAmount }} for {{ user.name }}</h1>
        <UBtn
          id="create_lesson_link"
          class="add-button-admin ml-auto"
          size="x-large"
          color="blue"
          :width="250"
          @click="openModal"
          v-if="hasCopun"
        >
          Apply Coupon
        </UBtn>
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
    <div v-if="canPay && payAmount !== 0" class="u-card elevation-3 mt-4 py-5">
      <div class="mx-auto" style="max-width: 400px" ref="paypal"></div>
    </div>
    <div
      v-if="payAmount === 0 && !loading"
      class="u-card elevation-3 mt-4 py-5 text-center"
    >
      <UBtn
        id="create_lesson_link"
        class="add-button-admin ml-auto"
        size="x-large"
        color="blue"
        :width="250"
        @click="freePay"
      >
        Pay
      </UBtn>
    </div>
    <comment-modal
      title="Enter Coupon Name"
      @save="confirmModal"
      @closeModal="cancelModal"
    >
      <template v-slot:comment>
        <div class="u-row create-wrap">
          <div class="u-col-12 u-mb-8 create-item">
            <u-text-field
              label="Coupon name"
              placeholder="Coupon name"
              v-model="couponName"
            >
            </u-text-field>
            <p v-if="couponError" class="mt-2" style="color: red">
              Coupon Name is required
            </p>
            <p v-if="invalidCoupon" class="mt-2" style="color: red">
              Coupon is not valid
            </p>
          </div>
        </div>
      </template>
    </comment-modal>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import Loader from "@/components/Loader";
import UBtn from "@/components/common/UBtn.vue";
import user from "@/api/users.api.js";
import moment from "moment";
import axios from "axios";
import CommentModal from "@/components/modals/CommentModal.vue";
import UTextField from "@/components/common/UTextField";
import uuid4 from "uuid4";

export default {
  async mounted() {
    let self = this;

    if (this.$route.params.studentId) {
      const script = document.createElement("script");
      script.src = `https://www.paypal.com/sdk/js?client-id=${process.env.VUE_APP_PAYPAL_CLIENT_ID}`;
      script.addEventListener("load", this.setLoaded);
      document.body.appendChild(script);
      await this.fetchUser({
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
          axios.get("/school/paymentConfiguration").then((res) => {
            self.payAmount = parseInt(res.data.payamount);
          });
          axios
            .get(`/school/validateCoupun/${this.user.school_id}`)
            .then((res) => {
              if (res.data.response.length > 0) {
                res.data.response.forEach((element) => {
                  element.discountAmmount = Number(element.discountAmmount);
                  element.numberOfCopuns = Number(element.numberOfCopuns);
                  element.numberOfUsedCopuns = Number(
                    element.numberOfUsedCopuns
                  );
                });
                // console.log(res.data.response);
                const usableCoupon = res.data.response.filter(
                  (x) => x.numberOfUsedCopuns < x.numberOfCopuns
                );

                if (usableCoupon.length > 0) {
                  self.hasCopun = true;
                  self.couponNameFromServer = res.data.response.copunName;
                  self.validCopunList = usableCoupon;
                }
              }
            });

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
    CommentModal,
    UTextField,
  },
  data() {
    return {
      loading: true,
      canPay: true,
      payAmount: "",
      couponName: "",
      couponError: false,
      hasCopun: false,
      couponNameFromServer: "",
      numberOfCopuns: "",
      usedCopuns: "",
      invalidCoupon: false,
      discount: "",
      appliedCopun: false,
      validCopunList: [],
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
                    value: this.payAmount,
                  },
                },
              ],
            });
          },
          onApprove: async (data, actions) => {
            const order = await actions.order.capture();
            // console.log(order);
            const payload = {
              payBy: "school",
              studentId: this.$route.params.studentId,
              payload: { ...order, studentId: this.$route.params.studentId },
            };
            await user.payStudent(payload).then(() => {
              if (self.appliedCopun) {
                axios
                  .put(`/school/updateNumberOfCopuns/1/${self.couponName}`)
                  .then(() => {
                    self.$notify({
                      title: "Payment Successful",
                      type: "success",
                    });
                    setTimeout(() => {
                      self.$router.push({ name: "school-users-all" });
                    }, "1000");
                  });
              } else {
                self.$notify({
                  title: "Payment Successful",
                  type: "success",
                });
                setTimeout(() => {
                  self.$router.push({ name: "school-users-all" });
                }, "1000");
              }
            });
          },
          onError: (err) => {
            console.log(err);
            // location.reload();
          },
        })
        .render(this.$refs.paypal);
    },
    openModal() {
      this.$modal.show("comment-modal");
    },
    async confirmModal() {
      if (this.couponName === "") {
        this.couponError = true;
      } else {
        this.couponError = false;
        const couponFind = this.validCopunList.find(
          (x) => this.couponName === x.copunName
        );
        console.log(couponFind);
        if (couponFind) {
          this.invalidCoupon = false;
          this.discount = couponFind.discountAmmount;
          this.payAmount = this.payAmount - this.discount;
          this.appliedCopun = true;
          this.hasCopun = false;
          this.$modal.hide("comment-modal");
          this.couponError = false;
        } else {
          this.invalidCoupon = true;
        }
        // if (this.couponNameFromServer !== this.couponName) {
        //   this.invalidCoupon = true;
        // } else {
        //   this.payAmount = this.payAmount - this.discount;
        //   this.appliedCopun = true;
        //   this.hasCopun = false;
        //   this.cancelModal();
        // }
      }
    },
    cancelModal() {
      this.$modal.hide("comment-modal");
      this.couponName = "";
      this.couponError = false;
      this.invalidCoupon = false;
    },
    async freePay() {
      if (this.payAmount === 0) {
        this.loading = true;

        const order = {
          id: uuid4(),
          purchase_units: [
            {
              amount: {
                value: 0,
              },
            },
          ],
          status: "COMPLETED",
        };
        const payPayload = {
          payBy: "school",
          studentId: this.$route.params.studentId,
          payload: { ...order, studentId: this.$route.params.studentId },
        };
        // console.log(payPayload);
        let self = this;
        console.log(this.couponName);
        await user.payStudent(payPayload).then(() => {
          if (self.appliedCopun) {
            console.log(self.couponName);
            axios
              .put(`/school/updateNumberOfCopuns/1/${self.couponName}`)
              .then(() => {
                self.$notify({
                  title: "Payment Successful",
                  type: "success",
                });
                setTimeout(() => {
                  self.$router.push({ name: "school-users-all" });
                }, "1000");
              });
          }
        });
        this.loading = false;
      }
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
