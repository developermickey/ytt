import Store from '@/views/student/store/Store';
import ProductsList from '@/views/student/store/ProductsList';

export default {
    path: 'store',
    component: Store,
    children: [
        {
            path: 'products',
            component: ProductsList,
            name: 'student-store',
        },

    ]
}
