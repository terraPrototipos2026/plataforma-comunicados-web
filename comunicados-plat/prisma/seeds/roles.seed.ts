import { type PrismaClient } from '@prisma/client';

export const ROLES_SEED_DATA = [
  { nombre: 'administrador general' },
  { nombre: 'administrador sucursal' },
  { nombre: 'encargado de departamento' },
  { nombre: 'operario' },
];

export async function seedRoles(prisma: PrismaClient) {
  console.log('🌱 Sembrando tabla de roles...');

  for (const rol of ROLES_SEED_DATA) {
    const record = await prisma.roles.upsert({
      where: { nombre: rol.nombre },
      update: {},
      create: { nombre: rol.nombre },
    });
    console.log(`  ✓ Rol listo: [id: ${record.idRol}] "${record.nombre}"`);
  }
}
