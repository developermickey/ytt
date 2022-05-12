import Lessons from '@/views/admin/lessons/Lessons';
import SingleCreate from '@/views/admin/lessons/SingleCreate';
import ListAll from '@/views/admin/lessons/ListAll';

export default {
  path: 'lessons',
  component: Lessons,
  children: [
    {
      path: 'all',
      component: ListAll,
      name: 'admin-lessons-all'
    },
    {
      path: ':id',
      component: () => import('@/views/admin/lessons/EditLesson'),
      name: 'admin-lessons-edit',
    },
    {
      path: 'create',
      component: SingleCreate,
      name: 'admin-lessons-create',
    },
  ]
}
