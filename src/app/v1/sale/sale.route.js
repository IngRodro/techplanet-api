import express from 'express';
import {
  createSale,
  getMonthlySalesTotal
} from './sale.controller';
import { TokenValidation } from 'Utils/authentication';


const router = express.Router();

router.post('/save-sale', TokenValidation, createSale);
router.get('/get-monthly-total-amount', TokenValidation, getMonthlySalesTotal);

export default router;
