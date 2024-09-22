import express from 'express';
import {
  registerVisit,
  getVisits
} from './visit.controller';


const router = express.Router();

router.post('/register-visit', registerVisit);
router.get('/get-visits', getVisits);

export default router;
