import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { seedSucursales } from './seeds/sucursales.seed.js';
import { seedRoles } from './seeds/roles.seed.js';
import { seedDepartamentos } from './seeds/departamentos.seed.js';
import { seedAdminUser } from './seeds/admin-user.seed.js';
import { seedComunicados } from './seeds/comunicados.seed.js';

const connectionString = process.env.DATABASE_URL;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 [SEED] Iniciando carga de datos iniciales...');

  await seedSucursales(prisma);
  await seedRoles(prisma);
  await seedDepartamentos(prisma);
  await seedAdminUser(prisma);
  await seedComunicados(prisma);

  console.log('✨ [SEED] Carga de datos completada con éxito.');
}

main()
  .catch((e) => {
    console.error('❌ [SEED] Error durante la ejecución del seeder:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
