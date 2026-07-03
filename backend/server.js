import { createApp } from './src/app.js';
import { config } from './src/config/env.js';

const app = createApp();

app.listen(config.port, () => {
  console.log(`Plushi API запущен на http://localhost:${config.port}`);
  console.log(`   Сайт:    http://localhost:${config.port}`);
  console.log(`   API:     http://localhost:${config.port}/api/health`);
});
