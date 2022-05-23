<template>
  <div class="u-container u-ml-auto u-mr-auto u-pt-15">
    <div class="u-text-h1 u-mr-6 mb-5">Orders</div>
    <div v-if="loading">
      <Loader class="loader" :show="loading" :fixedPosition="false" />
    </div>
    <u-card v-if="!loading" elevation="3">
      <div class="text-right mt-5 mr-5 mb-5">
        <div class="text">Change Order Status</div>
        <select
          @change="getOrdersList(orderStatus)"
          class=" mt-3 p-3 statusSelect"
          v-model="orderStatus"
        >
          <option class="text" value="processing">Processing</option>
          <option class="text" value="fullfilled">Fulfilled</option>
        </select>
      </div>
      <table class="u-data-table ">
        <thead>
          <tr>
            <template v-for="(column, index) in columns">
              <th class="text-center px-2 py-4" :key="index">
                {{ column.text }}
              </th>
            </template>
          </tr>
        </thead>
        <tbody v-if="orderList && orderList.length">
          <tr v-for="item in orderList" class="text-center" :key="item.id">
            <td class="">{{ item.order_date }}</td>
            <td class="">{{ item.users }}</td>
            <td class="">{{ item.products }}</td>
            <td class="">{{ item.product_amount }}</td>
            <td class="">
              {{ item.status }}
            </td>
            <td class="">
              <div class=" d-flex justify-content-center">
                <UIconBtn
                  class="u-mx-1 qa-delete-teacher-btn"
                  icon="icon-pencil"
                  icon-color="grey"
                  icon-hover-color="blue"
                  bg-hover-color="white"
                  hoverable
                  @click.native="viewOrder(item)"
                >
                </UIconBtn>
              </div>
            </td>
          </tr>
        </tbody>
        <tbody v-else>
          <tr>
            <td class="u-text-center" colspan="4">
              No data available
            </td>
          </tr>
        </tbody>
      </table>
    </u-card>
  </div>
</template>

<script>
import UCard from "@/components/common/UCard";
import UIconBtn from "@/components/common/UIconBtn";
import { OrderApi } from "@/api";
import Loader from "@/components/Loader";
import moment from "moment";

export default {
  components: {
    UCard,
    // SelectLesson,
    UIconBtn,
    Loader,
  },
  data: () => ({
    loading: true,
    orderList: [],
    orderStatus: "processing",
    columns: [
      {
        text: "Order Date",
      },
      {
        text: "Student Name",
      },
      {
        text: "Order Details",
      },
      {
        text: "Product Amount",
      },
      {
        text: "Order Status",
      },
      {
        text: "View",
        value: "actions",
      },
    ],
  }),

  methods: {
    viewOrder(item) {
      this.$router.push(`/admin/order/details/${item.order_id}`);
    },
    async getOrdersList(status) {
      let self = this;
      self.loading = true;
      await OrderApi.getOrderList(status).then((e) => {
        self.orderList = [];
        let reverse = e.data.reverse();
        reverse.forEach((element) => {
          self.orderList.push({
            order_date: moment(element.created_at, "YYYY-MM-DD").format(
              "MM-DD-YYYY"
            ),
            users: element.users,
            products: element.products,
            status:
              element.status === null
                ? "Processing"
                : element.status === "processing"
                ? "Processing"
                : "Fulfilled",
            product_amount: element.product_amount,
            order_id: element.order_id,
          });
        });
      });
      self.loading = false;
    },
  },
  async mounted() {
    await this.getOrdersList(this.orderStatus);
    this.loading = false;
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/vars";
.statusSelect {
  border: 1px solid #ecbf8c;
  width: 230px;
}
.statusSelect:focus-visible {
  outline: none !important;
  border: 1px solid #ecbf8c !important;
}

.avatar-wrap {
  border-radius: 50%;
  overflow: hidden;
  width: 40px;
  height: 40px;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

tbody tr:hover {
  color: #fff;
}
.grey-col {
  color: $clr-grey;
}

.edit-user-btn {
  height: 40px;
  width: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 15px;
  svg {
    width: 18px;
    height: 18px;
  }
  &:hover {
    background-color: #fff;
    svg {
      fill: $clr-blue;
    }
  }
}
.actions-col {
  display: flex;
  justify-content: flex-end;
}

.login-as-icon-btn {
  position: relative;
  left: -2px;
}
.loader {
  position: inherit !important;
}
.text {
  font-size: 22px;
}
</style>
