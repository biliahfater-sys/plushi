import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PRODUCTS_PATH = resolve(__dirname, '../data/products.json');

let cache = null;

const loadProducts = async () => {
  if (cache) return cache;
  const raw = await readFile(PRODUCTS_PATH, 'utf-8');
  cache = JSON.parse(raw);
  return cache;
};

export const productsService = {
  async getAll() {
    return loadProducts();
  },

  async getById(id) {
    const products = await loadProducts();
    return products.find((p) => p.id === id) ?? null;
  },

  async getByIds(ids) {
    const products = await loadProducts();
    return products.filter((p) => ids.includes(p.id));
  },
};
