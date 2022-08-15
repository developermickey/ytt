import Order from "@/components/school/order/Order.vue";
import OrderList from "@/components/school/order/OrderList.vue";
import OrderDetails from "@/components/school/order/OrderDetails.vue";

export default {
  path: "order",
  component: Order,
  name: "school-order",
  children: [
    {
      path: "list",
      component: OrderList,
      name: "school-order-list",
    },
    {
      path: "details/:id",
      component: OrderDetails,
      name: "school-order-details",
    },
  ],
};
