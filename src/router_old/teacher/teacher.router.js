import Admin from '@/views/admin/Admin';

import lessons from './lessons.router';

const routes = {
    path: '/teacher',
    component: Admin,
    name: 'teacher',
    // beforeEnter: multiguard([ middleware.isLogged ]),
    children: [
        lessons,
    ]
};

export default routes;