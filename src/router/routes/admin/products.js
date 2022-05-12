import Products from '@/views/admin/products/Products';
import ProductList from '@/views/admin/products/ProductsList';
import ProductCreate from '@/views/admin/products/ProductCreate';

export default {
    path: 'products',
    component: Products,
    children: [
        {
            path: 'list',
            component: ProductList,
            name: 'product-list'
        },
        {
            path: 'create',
            component: ProductCreate,
            name: 'product-create'
        }
    ]
}