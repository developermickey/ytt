import Student from '@/views/student/Student';

import lessons from './lessons';
import store from "./store";

import { STUDENT } from '@/constants/roles';
import routesExtendMeta from '@/router/routesExtendMeta';


const routes = {
	path: '/student',
	component: Student,
	name: 'student',
	meta: {
		auth: true,
		roleAccess: STUDENT
	},
	children: [
		lessons,
		store
	]
};

export default routesExtendMeta(routes);
