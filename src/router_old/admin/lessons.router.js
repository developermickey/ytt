import Lessons from '@/views/admin/lessons/Lessons';
import SingleCreate from '@/views/admin/lessons/SingleCreate';
import SingleView from '@/views/admin/lessons/SingleView';
import ListAll from '@/views/admin/lessons/ListAll';

export default {
  path: 'lessons',
  component: Lessons,
  children: [
    {
      path: 'all',
      component: ListAll,
      name: 'admin-lessons-all',
    },
    {
      path: ':id',
      component: SingleView,
      name: 'admin-lessons-view',
    },
    {
      path: 'create',
      component: SingleCreate,
      name: 'admin-lessons-create',
    },
  ]
}