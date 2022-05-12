import Lessons from '@/views/teacher/lessons/Lessons';
import StudentPassLesson from '@/views/student/lessons/PassLesson';
import StudentViewLesson from "@/views/student/lessons/StudentViewLesson";
import LessonsList from "@/views/student/lessons/LessonsList";

export default {
    path: 'lessons',
    component: Lessons,
    children: [
        {
            path: 'all',
            component: LessonsList,
            name: 'student-lessons-all',
        },
        {
            path: ':id/pass',
            component: StudentPassLesson,
            name: 'student-pass-lesson',
        },
        {
            path: ':id',
            component: StudentViewLesson,
            name: 'student-view-lesson',
        },
    ]
}
