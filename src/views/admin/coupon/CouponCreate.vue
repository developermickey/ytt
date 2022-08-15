<template>
  <ValidationObserver v-slot="{ handleSubmit }">
    <div class="u-flex is-flex-column u-flex-grow u-pb-25 screen-container">
      <div class="u-container u-mr-auto u-ml-auto">
        <div class="u-row">
          <div class="head">
            <div class="u-text-h2 u-mb-10 u-mt-10 head-title">
              Coupon Create
            </div>
          </div>
        </div>
        <div class="u-row create-wrap">
          <div class="u-col-6 u-mb-8 create-item">
            <ValidationProvider
              rules="required"
              name="Coupon name"
              v-slot="{ errors }"
            >
              <u-text-field
                label="Coupon name"
                placeholder="Coupon name"
                v-model="copunName"
                :error="errors[0]"
              >
              </u-text-field>
            </ValidationProvider>
          </div>
          <div class="u-col-6 u-mb-8 create-item">
            <ValidationProvider
              rules="required"
              name="Discount Amount"
              v-slot="{ errors }"
            >
              <u-text-field
                label="Discount Amount"
                placeholder="Discount Amount"
                v-model="discountAmount"
                :error="errors[0]"
                type="number"
              >
              </u-text-field>
            </ValidationProvider>
          </div>
          <div class="u-col-6 u-mb-8 create-item">
            <label for="teacher">Select School</label>
            <ValidationProvider
              rules="required"
              name="School"
              v-slot="{ errors }"
            >
              <multiselect
                v-model="schoolId"
                :options="schoolList === null ? [] : schoolList"
                :close-on-select="true"
                label="name"
                :track-by="'id'"
                placeholder="Select School"
                :multiple="false"
                :value="'id'"
                :option-height="500"
              ></multiselect>
              <p style="color: red">{{ errors[0] }}</p>
            </ValidationProvider>
          </div>
          <div class="u-col-6 u-mb-8 create-item">
            <ValidationProvider
              rules="required"
              name="Number Of Coupon"
              v-slot="{ errors }"
            >
              <u-text-field
                label="Number Of Coupon"
                placeholder="Number Of Coupon"
                v-model="numberOfCoupuns"
                :error="errors[0]"
              >
              </u-text-field>
            </ValidationProvider>
          </div>
        </div>
      </div>
      <div class="u-flex is-justify-center">
        <UBtn
          class="save-button"
          size="x-large"
          color="primary"
          @click="handleSubmit(submit)"
          id="create_teacher_submit"
          width="320"
          :loading="loading"
        >
          Save
        </UBtn>
      </div>
    </div>
  </ValidationObserver>
</template>

<script>
import Multiselect from "vue-multiselect";
import "vue-multiselect/dist/vue-multiselect.min.css";
import UTextField from "@/components/common/UTextField";
import axios from "axios";

export default {
  data: () => ({
    copunName: "",
    discountAmount: "",
    schoolId: "",
    numberOfCoupuns: "",
    numberOfUsedCopuns: 0,
    loading: false,
  }),
  components: {
    Multiselect,
    UTextField,
  },
  async mounted() {
    await this.$store.dispatch("School/fetchSchoolList");
  },
  computed: {
    schoolList() {
      return this.$store.getters["School/schoolList"];
    },
  },
  methods: {
    async submit() {
      let self = this;
      const payload = {
        copunName: this.copunName,
        discountAmount: parseInt(this.discountAmount),
        schoolId: this.schoolId.id,
        numberOfCoupuns: parseInt(this.numberOfCoupuns),
        numberOfUsedCopuns: parseInt(this.numberOfUsedCopuns),
      };
      this.loading = true;
      const formData = new FormData();
      for (let field in payload) formData.append(field, payload[field]);

      await axios
        .post("/admin/createCoupun", formData)
        .then((e) => {
          if (e.data.result) {
            self.$router.push("/admin/coupon-list");
          }
        })
        .catch(() => {
          self.$notify({
            title: "Coupon Already Exists",
            type: "error",
          });
          self.loading = false;
        });
      this.loading = false;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/mixins";

.screen-container {
  min-height: 100%;
}

label {
  font-size: 24px;
  color: #000;
  font-weight: 300;
  line-height: 46px;
  display: inline-block;
}

.add-photo {
  margin-top: 11px;
}

.head {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

@include media(">phone", "<=tablet") {
  .create-wrap {
    flex-wrap: nowrap;
    flex-direction: column;

    .create-item {
      flex: auto;
      max-width: unset;
    }
  }
  .head {
    padding-top: 40px;

    .head-title {
      font-size: 24px;
      padding-left: 20px;
    }

    .head-btn {
      padding: 0 20px;
      margin-right: 5px;
    }
  }
  .avatar-block {
    label {
      font-size: 20px;
    }

    .add-photo {
      font-size: 14px;
      height: 40px;
      padding: 0 20px;
    }
  }
  .save-button {
    height: 40px;
  }
}
</style>
