import express from 'express';
import { requestSignup, verifySignup } from '../controllers/authMySQL.js';

const router = express.Router();
router.post('/signup', requestSignup);
router.get('/verify/:token', verifySignup);

export default router;
