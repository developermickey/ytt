import Lessons from "@/views/school/lessons/Lessons";
import SingleCreate from "@/views/school/lessons/SingleCreate";
import ListAll from "@/views/school/lessons/ListAll";

export default {
  path: "lessons",
  component: Lessons,
  children: [
    {
      path: "all",
      component: ListAll,
      name: "school-lessons-all",
    },
    {
      path: ":id",
      component: () => import("@/views/school/lessons/EditLesson"),
      name: "school-lessons-edit",
    },
    {
      path: "create",
      component: SingleCreate,
      name: "school-lessons-create",
    },
  ],
};
