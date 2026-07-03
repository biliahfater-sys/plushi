import { Router } from 'express';
import { cartController } from '../controllers/cart.controller.js';
import { validate } from '../middleware/validate.js';
import { isEmail, isNonEmptyString } from '../utils/validators.js';

const router = Router();

const itemsRule = (value) =>
  Array.isArray(value) && value.length > 0
    ? true
    : 'Передайте непустой массив товаров';

const customerRule = (value) => {
  if (!value || typeof value !== 'object') return 'Не переданы данные покупателя';
  if (!isNonEmptyString(value.name)) return 'Укажите имя';
  if (!isEmail(value.email)) return 'Некорректный email';
  return true;
};

router.post('/preview', validate({ items: itemsRule }), cartController.preview);

router.post(
  '/checkout',
  validate({ items: itemsRule, customer: customerRule }),
  cartController.checkout,
);

export default router;
