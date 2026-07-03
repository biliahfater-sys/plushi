import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const FILE = resolve(__dirname, '../data/subscribers.json');

const readAll = async () => {
  try {
    const raw = await readFile(FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
};

const writeAll = (list) =>
  writeFile(FILE, JSON.stringify(list, null, 2), 'utf-8');

export const subscriptionService = {
  async add(email, consent = false) {
    const normalized = email.trim().toLowerCase();
    const list = await readAll();

    if (list.some((s) => s.email === normalized)) {
      return { email: normalized, alreadySubscribed: true };
    }

    list.push({
      email: normalized,
      consent,
      createdAt: new Date().toISOString(),
    });
    await writeAll(list);

    return { email: normalized, alreadySubscribed: false };
  },
};
