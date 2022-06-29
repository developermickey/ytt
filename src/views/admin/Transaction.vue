<template>
  <div class="u-container u-ml-auto u-mr-auto u-pt-15">
    <div class="u-text-h1 u-mr-6 mb-5">Transaction</div>
    <div v-if="loading">
      <Loader class="loader" :show="loading" :fixedPosition="false" />
    </div>
    <u-card v-if="!loading" elevation="3">
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
            <td class="">{{ item.transaction_id }}</td>
            <td class="">{{ item.student_name }}</td>
            <td class="">
              {{ item.status }}
            </td>
            <!-- 
            <td class="pr-5 u-text-right">
              <div class="actions-col actions-cell">
                <b-dropdown no-caret>
                  <template #button-content>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="feather feather-more-vertical"
                    >
                      <circle cx="12" cy="12" r="1"></circle>
                      <circle cx="12" cy="5" r="1"></circle>
                      <circle cx="12" cy="19" r="1"></circle>
                    </svg>
                  </template>
                  <b-dropdown-item>
                    <UIconBtn
                      class="u-mx-1 qa-delete-teacher-btn"
                      icon="icon-trash"
                      icon-color="grey"
                      icon-hover-color="blue"
                      bg-hover-color="white"
                      hoverable
                      @click.native="openModal(item)"
                      title="Delete Order"
                    >
                    </UIconBtn>
                  </b-dropdown-item>
                  <b-dropdown-item>
                    <UIconBtn
                      class="u-mx-1 qa-delete-teacher-btn"
                      icon="icon-pencil"
                      icon-color="grey"
                      icon-hover-color="blue"
                      bg-hover-color="white"
                      hoverable
                      @click.native="viewOrder(item)"
                      title="Edit Order"
                    >
                    </UIconBtn>
                  </b-dropdown-item>
                </b-dropdown>
              </div>
            </td>
            <td class="">
              <div class=" d-flex justify-content-center"></div>
            </td> -->
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
    <basic-modal
      :title="'Are you sure to delete ' + itemForDelete.users + ' order ?'"
      @save="confirmModal"
      @closeModal="cancelModal"
    >
    </basic-modal>
  </div>
</template>

<script>
import UCard from "@/components/common/UCard";
import UIconBtn from "@/components/common/UIconBtn";
import { OrderApi } from "@/api";
import Loader from "@/components/Loader";
// import { BDropdown, BDropdownItem } from "bootstrap-vue";
import BasicModal from "@/components/modals/BasicModal.vue";
// import moment from "moment";

export default {
  components: {
    UCard,
    // SelectLesson,
    // UIconBtn,
    Loader,
    // BDropdown,
    // BDropdownItem,
    BasicModal,
  },
  data: () => ({
    loading: true,
    orderList: [],
    orderStatus: "processing",
    columns: [
      {
        text: "Transaction id",
      },
      {
        text: "Student Name",
      },
    ],
    itemForDelete: {},
  }),

  methods: {
    viewOrder(item) {
      this.$router.push(`/admin/order/details/${item.order_id}`);
    },
    async getOrdersList() {
      let self = this;
      self.loading = true;
      await OrderApi.getTransaction().then((e) => {
        console.log(e.data.result);
        self.orderList = e.data.result;
        console.log();
        self.loading = false;
      });
    },
    openModal(item) {
      this.itemForDelete = item;
      console.log(this.itemForDelete);
      this.$modal.show("confirm-modal");
    },
    async confirmModal() {
      this.$modal.hide("comment-modal");
      this.loading = true;
      await OrderApi.deleteOrder(this.itemForDelete.order_id);
      await this.getOrdersList(this.orderStatus);
      this.loading = false;
    },
    cancelModal() {
      this.$modal.hide("confirm-modal");
      this.itemForDelete = {};
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
