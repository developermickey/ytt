import School from "@/views/school/School";
import StudentSingleCreate from "@/components/school/users/StudentSingleCreate";
import EditSingle from "@/views/school/users/EditSingle";
import Payment from "@/views/school/Payment";
import user from "./user";
import AudioFiles from "@/views/school/AudioFiles";
// import students from "./students";
import settings from "./settings";
import order from "./order";
import { SCHOOL } from "@/constants/roles";
import routesExtendMeta from "@/router/routesExtendMeta";
import ProductList from "@/views/school/products/ProductsList";
import ProductCreate from "@/views/school/products/ProductCreate";
import lessons from "./lessons";
const routes = {
  path: "/school",
  component: School,
  name: "school",
  meta: {
    auth: true,
    roleAccess: SCHOOL,
  },
  children: [
    lessons,
    user,
    settings,
    order,
    {
      path: "create-student",
      component: StudentSingleCreate,
      name: "school-student-create",
    },
    {
      path: "school-user-edit/:id",
      component: EditSingle,
      name: "school-user-edit",
    },
    {
      path: "payment/:studentId",
      component: Payment,
      name: "school-payment",
    },
    {
      path: "audio",
      component: AudioFiles,
      name: "school-audio",
    },
    {
      path: "store/list",
      component: ProductList,
      name: "school-product-list",
    },
    {
      path: "store/create",
      component: ProductCreate,
      name: "school-product-create",
    },
  ],
};

export default routesExtendMeta(routes);
