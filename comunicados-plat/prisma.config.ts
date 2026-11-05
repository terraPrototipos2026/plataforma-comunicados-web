import { config } from 'dotenv';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { defineConfig } from 'prisma/config';

const currentDir = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(currentDir, '.env') });

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    seed: 'node ./prisma/seed.ts',
  },
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
