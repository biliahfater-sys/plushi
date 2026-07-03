import { Router } from 'express';
import { subscriptionController } from '../controllers/subscription.controller.js';
import { validate } from '../middleware/validate.js';
import { isEmail } from '../utils/validators.js';

const router = Router();

const emailRule = (value) => (isEmail(value) ? true : 'Введите корректный email');

router.post('/', validate({ email: emailRule }), subscriptionController.subscribe);

export default router;
