import { productsService } from '../services/products.service.js';

export const productsController = {
  async list(req, res, next) {
    try {
      const { category } = req.query;
      const all = await productsService.getAll();
      const items = category ? all.filter((p) => p.category === category) : all;
      res.json({ items });
    } catch (err) {
      next(err);
    }
  },
};
