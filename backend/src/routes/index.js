import { Router } from 'express';
import productsRoutes from './products.routes.js';
import cartRoutes from './cart.routes.js';
import subscriptionRoutes from './subscription.routes.js';

const router = Router();

router.get('/health', (req, res) => res.json({ ok: true }));

router.use('/products', productsRoutes);
router.use('/cart', cartRoutes);
router.use('/subscribe', subscriptionRoutes);

export default router;
