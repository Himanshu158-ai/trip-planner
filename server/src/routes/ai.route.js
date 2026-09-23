import express from 'express';
import { planner } from '../controllers/ai.controller.js';
const router = express.Router();

router.post('/chat', planner);


export default router;
