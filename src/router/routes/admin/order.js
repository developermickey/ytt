import Order from "@/components/admin/order/Order.vue";
import OrderList from "@/components/admin/order/OrderList.vue";
import OrderDetails from "@/components/admin/order/OrderDetails.vue";

export default {
  path: "order",
  component: Order,
  name: "admin-order",
  children: [
    {
      path: "list",
      component: OrderList,
      name: "order-list",
    },
    {
      path: "details/:id",
      component: OrderDetails,
      name: "order-details",
    },
  ],
};
