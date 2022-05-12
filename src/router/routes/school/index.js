import School from "@/views/school/School";

// import lessons from "./lessons";
// import students from "./students";
// import settings from "./settings";

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
  //   children: [lessons, students, settings],
};

export default routesExtendMeta(routes);
