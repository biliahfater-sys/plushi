import { cartService } from '../services/cart.service.js';
import { mailService } from '../services/mail.service.js';
import { config } from '../config/env.js';
import { AppError } from '../utils/AppError.js';
import { isEmail, isNonEmptyString } from '../utils/validators.js';

export const cartController = {
  async preview(req, res, next) {
    try {
      const order = await cartService.buildOrder(req.body.items);
      res.json(order);
    } catch (err) {
      next(err);
    }
  },

  async checkout(req, res, next) {
    try {
      const { customer, items, consent } = req.body;

      if (!consent) {
        throw new AppError('Необходимо согласие на обработку персональных данных', 400);
      }

      if (!isNonEmptyString(customer?.name)) {
        throw new AppError('Укажите ваше имя', 400, { name: 'Укажите ваше имя' });
      }

      if (!isEmail(customer?.email)) {
        throw new AppError('Укажите корректный email', 400, { email: 'Укажите корректный email' });
      }

      const order = await cartService.buildOrder(items);
      const text = cartService.formatOrderEmail({ customer, order, consent });

      await mailService.send({
        to: config.shopEmail,
        subject: `Новый заказ — ${order.total} ₽`,
        text,
      });

      res.json({
        ok: true,
        message: 'Заказ принят. Мы свяжемся с вами в ближайшее время.',
        order,
      });
    } catch (err) {
      next(err);
    }
  },
};
