import express from 'express';
import productRoutes from './product/product.route';
import userRoutes from './user/user.route';
import cartRoutes from './cart/cart.route';
import visitRoutes from './visit/visit.route'
import saleRoutes from './sale/sale.route'


const router = express.Router();

router.use('/products', productRoutes);
router.use('/users', userRoutes);
router.use('/cart', cartRoutes);
router.use('/visits', visitRoutes)
router.use('/sales', saleRoutes)

export default router;
