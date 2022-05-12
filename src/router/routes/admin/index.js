import Admin from "@/views/admin/Admin";

import lessons from "./lessons";
import users from "./users";
import settings from "./settings";
import coins from "./coins";
import products from "./products";
import order from "./order";
// import school from "./school";

import { ADMIN } from "@/constants/roles";
import routesExtendMeta from "@/router/routesExtendMeta";

const routes = {
  path: "/admin",
  component: Admin,
  name: "admin",
  meta: {
    auth: true,
    roleAccess: ADMIN,
  },
  children: [lessons, users, settings, coins, products, order],
};

export default routesExtendMeta(routes);
