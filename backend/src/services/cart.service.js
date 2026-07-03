import { productsService } from './products.service.js';
import { AppError } from '../utils/AppError.js';

const MAX_QTY_PER_ITEM = 20;

export const cartService = {
  async buildOrder(items) {
    if (!Array.isArray(items) || items.length === 0) {
      throw new AppError('Корзина пуста', 400);
    }

    const ids = items.map((i) => i.id);
    const found = await productsService.getByIds(ids);
    const byId = new Map(found.map((p) => [p.id, p]));

    const lines = [];
    for (const { id, qty } of items) {
      const product = byId.get(id);
      if (!product) {
        throw new AppError(`Товар не найден: ${id}`, 404);
      }
      const quantity = Math.min(Math.max(Number(qty) || 1, 1), MAX_QTY_PER_ITEM);
      lines.push({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity,
        subtotal: product.price * quantity,
      });
    }

    const total = lines.reduce((sum, l) => sum + l.subtotal, 0);
    const itemsCount = lines.reduce((sum, l) => sum + l.quantity, 0);

    return { lines, total, itemsCount };
  },

  formatOrderEmail({ customer, order, consent }) {
    const linesText = order.lines
      .map((l) => `  • ${l.name} × ${l.quantity} = ${l.subtotal} ₽`)
      .join('\n');

    return [
      `Новый заказ от ${customer.name} (${customer.email})`,
      customer.phone ? `Телефон: ${customer.phone}` : null,
      customer.note ? `Комментарий: ${customer.note}` : null,
      '',
      'Состав заказа:',
      linesText,
      '',
      `Итого: ${order.total} ₽ (${order.itemsCount} шт.)`,
      '',
      `Согласие на обработку персональных данных (152-ФЗ): ${consent ? 'дано' : 'нет'}`,
    ]
      .filter(Boolean)
      .join('\n');
  },
};
