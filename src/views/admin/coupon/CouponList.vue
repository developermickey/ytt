<template>
  <div class="u-container u-ml-auto u-mr-auto u-pt-15">
    <div class="u-text-h1 u-mr-6 mb-4">Coupon List</div>
    <div v-if="loading">
      <Loader class="loader" :show="loading" :fixedPosition="false" />
    </div>
    <div class="text-right mr-4 mb-4">
      <UBtn
        :to="{ name: 'admin-coupon-create' }"
        id="create_lesson_link"
        class="add-button-admin"
        size="x-large"
        color="blue"
        :width="250"
      >
        Add Coupon
      </UBtn>
    </div>
    <u-card v-if="!loading" elevation="3">
      <table class="u-data-table">
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
            <td class="">{{ item.copunName }}</td>
            <td class="">{{ item.discountAmmount }}</td>
            <td class="">{{ item.SchoolName }}</td>
            <td class="">{{ item.numberOfCopuns }}</td>
            <td class="">{{ item.numberOfUsedCopuns }}</td>
          </tr>
        </tbody>
        <tbody v-else>
          <tr>
            <td class="u-text-center" colspan="4">No data available</td>
          </tr>
        </tbody>
      </table>
    </u-card>
  </div>
</template>

<script>
import UCard from "@/components/common/UCard";
import Loader from "@/components/Loader";
import axios from "axios";

export default {
  components: {
    UCard,
    Loader,
  },
  data: () => ({
    loading: true,
    orderList: [],
    columns: [
      {
        text: "Coupon Name",
      },
      {
        text: "Discount Amount",
      },
      {
        text: "School Name",
      },
      {
        text: "Number Of Coupons",
      },
      {
        text: "Number Of Used Coupons",
      },
    ],
  }),

  methods: {
    async getOrdersList() {
      let self = this;
      self.loading = true;
      await axios
        .get("admin/getCopunsList")
        .then((e) => (self.orderList = e.data.result));
      self.loading = false;
    },
  },
  async mounted() {
    await this.getOrdersList(this.orderStatus);
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
