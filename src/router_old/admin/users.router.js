import Users from '@/views/admin/users/Users';
import StudentSingleCreate from '@/views/admin/users/StudentSingleCreate';
import TeacherSingleCreate from '@/views/admin/users/TeacherSingleCreate';

import ListAll from '@/views/admin/users/ListAll';

export default {
  path: 'users',
  component: Users,
  children: [
    {
      path: 'all',
      component: ListAll,
      name: 'admin-users-all',
    },
    {
      path: 'create-teacher',
      component: TeacherSingleCreate,
      name: 'admin-teacher-create',
    },
    {
      path: 'create-student',
      component: StudentSingleCreate,
      name: 'admin-student-create',
    },
  ]
}