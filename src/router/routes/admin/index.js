import Admin from "@/views/admin/Admin";

import lessons from "./lessons";
import users from "./users";
import settings from "./settings";
import coins from "./coins";
import products from "./products";
import order from "./order";
import Transaction from "@/views/admin/Transaction";
import AudioFiles from "@/views/admin/AudioFiles";
import PaymentConfiguration from "@/views/admin/PaymentConfiguration";
// import school from "./school";

import { ADMIN } from "@/constants/roles";
import routesExtendMeta from "@/router/routesExtendMeta";

import CouponList from "@/views/admin/coupon/CouponList";
import CouponCreate from "@/views/admin/coupon/CouponCreate";

const routes = {
  path: "/admin",
  component: Admin,
  name: "admin",
  meta: {
    auth: true,
    roleAccess: ADMIN,
  },
  children: [
    lessons,
    users,
    settings,
    coins,
    products,
    order,
    {
      path: "transaction",
      component: Transaction,
      name: "admin-transaction",
    },
    {
      path: "audio",
      component: AudioFiles,
      name: "admin-audio",
    },
    {
      path: "paymentConfiguration",
      component: PaymentConfiguration,
      name: "admin-paymentConfiguration",
    },
    {
      path: "coupon-list",
      component: CouponList,
      name: "admin-coupon-list",
    },
    {
      path: "coupon-create",
      component: CouponCreate,
      name: "admin-coupon-create",
    },
  ],
};

export default routesExtendMeta(routes);
