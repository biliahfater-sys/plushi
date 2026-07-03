import { subscriptionService } from '../services/subscription.service.js';
import { mailService } from '../services/mail.service.js';
import { AppError } from '../utils/AppError.js';
import { isEmail } from '../utils/validators.js';

export const subscriptionController = {
  async subscribe(req, res, next) {
    try {
      const { email, consent } = req.body;

      if (!consent) {
        throw new AppError('Необходимо согласие на обработку персональных данных', 400);
      }

      if (!isEmail(email)) {
        throw new AppError('Укажите корректный email', 400, { email: 'Укажите корректный email' });
      }

      const result = await subscriptionService.add(email, consent);

      if (!result.alreadySubscribed) {
        await mailService.send({
          to: result.email,
          subject: 'Добро пожаловать в «Плюши»',
          text: 'Спасибо за подписку! Будем присылать уютные новости и спецпредложения.',
        });
      }

      res.json({
        ok: true,
        message: result.alreadySubscribed
          ? 'Вы уже подписаны — спасибо, что с нами!'
          : 'Готово! Проверьте почту.',
      });
    } catch (err) {
      next(err);
    }
  },
};
