<template>
  <div class="u-container u-ml-auto u-mr-auto u-pt-15 order-details">
    <div class="u-text-h1 u-mr-6 ">Order Details</div>
    <hr class="mb-5 " />
    <div v-if="loading">
      <Loader class="loader" :show="loading" :fixedPosition="false" />
    </div>
    <div v-else class="row">
      <div class="col-md-4 mb-5">
        <h4>Order Date</h4>
        <div class="text">{{ order.created_at }}</div>
      </div>
      <div class="col-md-4 mb-5">
        <h4>Name</h4>
        <div class="text">{{ order.name }}</div>
      </div>

      <div class="col-md-4 mb-5">
        <h4>Order Status</h4>
        <div class="text">
          {{  order.status === null
              ? "Processing"
              : order.status === "processing"
              ? "Processing"
              : "Fulfilled", }}
        </div>
      </div>
      <div class="col-md-12 mb-5 mt-5">
        <div class="row">
          <div class="col-md-6 col-12">
            <h4>Product Details</h4>
            <hr class="mb-5 " />
            <img
              :src="order.product.image_path"
              alt="Product Image path"
              height="200"
              width="200"
              style="border-radius:15px;object-fit:contain;"
            />
            <div class="text mt-4 mb-4">
              <span class="h4">Product Name :</span>
              {{ order.product.product_name }}
            </div>
            <div class="text">
              <span class="h4">Product Amount: </span>
              {{ order.product.amount }}
            </div>
          </div>
          <div class="col-md-6 col-12">
            <div class="text">Change Order Status</div>
            <select class="w-100 mt-3 p-3 statusSelect" v-model="orderStatus">
              <option class="text" value="processing">Processing</option>
              <option class="text" value="fullfilled">Fullfilled</option>
            </select>

            <div class="d-flex mt-5 justify-content-between">
              <UBtn
                color="blue"
                style="font-size:24px"
                :block="true"
                size="x-large"
                @click="$router.push(`/admin/order/list`)"
                class="mr-4"
              >
                Cancel
              </UBtn>

              <UBtn
                class="ml-4"
                color="primary"
                style="font-size:24px"
                :block="true"
                size="x-large"
                @click="orderStatusChnage()"
              >
                Save
              </UBtn>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { OrderApi } from "@/api";
import Loader from "@/components/Loader";
import UBtn from "@/components/common/UBtn.vue";
export default {
  components: {
    Loader,
    UBtn,
  },
  data() {
    return {
      order: {},
      orderStatus: null,
      loading: true,
    };
  },
  async mounted() {
    let payload = {
      order_id: this.$route.params.id,
    };
    let self = this;
    await OrderApi.getOrderDetails(payload).then((e) => {
      self.order = e.data[0];
      let env = process.env.VUE_APP_API_URL;
      // console.log("base url", env);
      let img = env.replace(`.org/api`, "");
      // console.log("imgpath", img);
      self.orderStatus =
        e.data[0].status === null ? "processing" : e.data[0].status;
      self.order.product.image_path =
        img + ".org/" + e.data[0].product.image_path;
    });
    this.loading = false;
  },
  methods: {
    async orderStatusChnage() {
      let self = this;
      let payload = {
        order_id: self.$route.params.id,
        status: self.orderStatus,
      };
      this.loading = true;
      await OrderApi.changeOrderStatus(payload).then(() => {
        self.loading = false;
        self.$router.push(`/admin/order/list`);
      });
    },
  },
};
</script>

<style scoped>
h4 {
  font-size: 30px !important;
  font-weight: bold;
}
.h4 {
  font-size: 30px !important;
  font-weight: bold;
  margin-right: 10px;
}
.text {
  font-size: 26px;
}
hr {
  border-bottom: 5px solid gray;
}
.loader {
  position: inherit !important;
}
.statusSelect {
  border: 1px solid #ecbf8c;
}
.statusSelect:focus-visible {
  outline: none !important;
  border: 1px solid #ecbf8c !important;
}
</style>
