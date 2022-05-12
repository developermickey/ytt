import multiguard from 'vue-router-multiguard';
import middleware from '../middleware';

import Admin from '@/views/admin/Admin';

import lessons from './lessons.router';
import users from './users.router';
import settings from './settings.router';

const routes = {
  path: '/admin',
  component: Admin,
  name: 'admin',
  beforeEnter: multiguard([ middleware.isLogged ]),
  children: [
    lessons,
    users,
    settings,
  ]
};


export default routes;
