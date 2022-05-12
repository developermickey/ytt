import Students from "@/views/teacher/students/Students";
import StudentsList from "@/views/teacher/students/StudentsList";
import StudentsLessonList from "@/views/teacher/students/StudentsLessonList";
import SingleView from "@/views/teacher/lessons/SingleView";
import CheckLesson from "@/views/teacher/students/CheckLesson";
import EditLesson from "@/views/teacher/students/EditLesson";

export default {
    path: 'students',
    component: Students,
    children: [
        {
            path: 'all',
            component: StudentsList,
            name: 'teacher-students-all',
        },
        {
            path: ':id/lessons',
            name: 'teacher-students-lesson-list',
            component: StudentsLessonList,
        },
        {
            path: ':studentId/lessons/:lessonId/check',
            component: CheckLesson,
            name: 'teacher-students-lesson-check',
        },
        {
            path: ':studentId/lessons/:id/view',
            component: SingleView,
            name: 'teacher-students-lesson-view',
        },
        {
            path: ':studentId/lessons/:lessonId/edit',
            component: EditLesson,
            name: 'teacher-students-lesson-edit',
        },
    ]
}