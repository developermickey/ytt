import Users from "@/views/admin/users/Users";
import StudentSingleCreate from "@/views/admin/users/StudentSingleCreate";
import StudentInvite from "@/views/admin/users/StudentInvite";
import TeacherInvite from "@/views/admin/users/TeacherInvite";
import TeacherSingleCreate from "@/views/admin/users/TeacherSingleCreate";
import SchoolCreate from "@/views/admin/users/SchoolCreate";
import EditSingle from "@/views/admin/users/EditSingle";

import ListAll from "@/views/admin/users/ListAll";

export default {
  path: "users",
  component: Users,
  children: [
    {
      path: "all",
      component: ListAll,
      name: "admin-users-all",
    },
    {
      path: "create-teacher",
      component: TeacherSingleCreate,
      name: "admin-teacher-create",
    },
    {
      path: "create-school",
      component: SchoolCreate,
      name: "admin-school-create",
    },
    {
      path: "create-student",
      component: StudentSingleCreate,
      name: "admin-student-create",
    },
    {
      path: "student-invite",
      component: StudentInvite,
      name: "admin-student-invite",
    },
    {
      path: "teacher-invite",
      component: TeacherInvite,
      name: "admin-teacher-invite",
    },
    {
      path: "edit/:id",
      component: EditSingle,
      name: "admin-user-edit",
    },
  ],
};
