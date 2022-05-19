import Users from "@/views/school/users/Users";

import ListAll from "@/views/admin/users/ListAll";

export default {
  path: "users",
  component: Users,
  children: [
    {
      path: "all",
      component: ListAll,
      name: "school-users-all",
    },
  ],
};
