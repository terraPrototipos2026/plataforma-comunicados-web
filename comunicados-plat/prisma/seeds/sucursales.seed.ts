import type { PrismaClient } from '@prisma/client';

export const SUCURSALES_SEED_DATA = [
  {
    nombre: 'sucursal central',
    direccion: 'Av. Arce esq. Cordero #241',
  },
  {
    nombre: 'sucursal miraflores',
    direccion: 'Av. Saavedra #1234',
  },
  {
    nombre: 'sucursal calacoto',
    direccion: 'Calle 21 de Calacoto #1050',
  },
];

export async function seedSucursales(prisma: PrismaClient) {
  console.log('🌱 Sembrando tabla de sucursales...');

  for (const item of SUCURSALES_SEED_DATA) {
    const existing = await prisma.sucursal.findFirst({
      where: { nombre: item.nombre },
    });

    if (existing) {
      console.log(`  ✓ Sucursal ya existente: [id: ${existing.idSucursal}] "${existing.nombre}"`);
    } else {
      const record = await prisma.sucursal.create({
        data: item,
      });
      console.log(`  ✓ Sucursal creada: [id: ${record.idSucursal}] "${record.nombre}"`);
    }
  }
}
