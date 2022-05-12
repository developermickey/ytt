import Index from "@/views/Index";
import NoAccessFromMobile from "@/views/NoAccessFromMobile";
import auth from "./auth";
import admin from "./admin";
import teacher from "./teacher";
import student from "./student";
import school from "./school";
export default [
  {
    path: "/",
    component: Index,
    name: "index",
    redirect: { name: "auth-login" },
  },
  auth,
  admin,
  teacher,
  student,
  school,
  {
    path: "/no-access-from-mobile",
    component: NoAccessFromMobile,
    name: "no-access-from-mobile",
  },
];
