import express from 'express';
import productRoutes from './product/product.route';
import userRoutes from './user/user.route';

const router = express.Router();

router.use('/products', productRoutes);
router.use('/users', userRoutes);

export default router;
