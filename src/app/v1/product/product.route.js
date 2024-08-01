import express from 'express';
import fileUpload from 'express-fileupload';
import {
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
  getCategoryProduct,
} from './product.controller';
import { TokenValidation } from 'Utils/authentication';

const router = express.Router();

router.get('/get-products', getAllProducts);
router.post(
  '/upload-product',
  TokenValidation,
  fileUpload({
    useTempFiles: true,
    tempFileDir: './uploads',
  }),
  createProduct,
);
router.put(
  '/:idProduct',
  fileUpload({
    useTempFiles: true,
    tempFileDir: './uploads',
  }),
  updateProduct,
);
router.get("/get-category-product", getCategoryProduct)
router.delete('/:idProduct', deleteProduct);

export default router;
