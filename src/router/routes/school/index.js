import School from "@/views/school/School";
import StudentSingleCreate from "@/components/school/users/StudentSingleCreate";

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
  children: [
    user,
    settings,
    {
      path: "create-student",
      component: StudentSingleCreate,
      name: "school-student-create",
    },
  ],
};

export default routesExtendMeta(routes);
