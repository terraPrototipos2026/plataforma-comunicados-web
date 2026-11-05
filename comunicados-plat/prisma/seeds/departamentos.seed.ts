import { type PrismaClient } from '@prisma/client';

export const DEPARTAMENTOS_SEED_DATA = [
  'ventas',
  'marketing',
  'sistemas',
  'administrativo',
];

export async function seedDepartamentos(prisma: PrismaClient) {
  console.log('🌱 Sembrando tabla de departamentos...');

  for (const nombre of DEPARTAMENTOS_SEED_DATA) {
    const existing = await prisma.departamento.findFirst({
      where: { nombre },
    });

    if (existing) {
      console.log(`  ✓ Departamento ya existente: [id: ${existing.idDepartamento}] "${existing.nombre}"`);
    } else {
      const record = await prisma.departamento.create({
        data: { nombre },
      });
      console.log(`  ✓ Departamento creado: [id: ${record.idDepartamento}] "${record.nombre}"`);
    }
  }
}

