import School from "@/views/school/School";

import user from "./user";
// import students from "./students";
import settings from "./settings";

import { SCHOOL } from "@/constants/roles";
import routesExtendMeta from "@/router/routesExtendMeta";

const routes = {
  path: "/school",
  component: School,
  name: "school",
  meta: {
    auth: true,
    roleAccess: SCHOOL,
  },
  children: [user, settings],
};

export default routesExtendMeta(routes);
